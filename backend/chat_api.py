"""
FastAPI Chat Messenger API
Real-time chat functionality with WebSocket support
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import asyncio
from collections import defaultdict
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="EduLearn Chat Messenger API",
    description="Real-time chat API with WebSocket support for course discussions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== Pydantic Models ==============

class MessageCreate(BaseModel):
    conversation_id: str
    content: str
    message_type: str = "text"
    sender_id: str

class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender_name: str
    sender_image: Optional[str] = None
    content: str
    message_type: str
    read_by: List[str] = []
    status: str = "sent"
    created_at: datetime
    updated_at: datetime

class ConversationCreate(BaseModel):
    participants: List[str]
    initial_message: Optional[str] = None

class ConversationResponse(BaseModel):
    id: str
    participants: List[Dict[str, Any]]
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    last_sender_id: Optional[str] = None
    unread_count: Dict[str, int] = {}
    created_at: datetime

class TypingIndicator(BaseModel):
    conversation_id: str
    user_id: str
    user_name: str
    is_typing: bool

class ReadReceipt(BaseModel):
    conversation_id: str
    user_id: str
    message_ids: List[str]

# ============== In-Memory Storage ==============

# In production, use MongoDB or Redis
messages_db: Dict[str, List[Dict]] = defaultdict(list)
conversations_db: Dict[str, Dict] = {}
users_db: Dict[str, Dict] = {}
online_users: Dict[str, WebSocket] = {}
typing_users: Dict[str, Dict[str, datetime]] = defaultdict(dict)

# ============== WebSocket Connection Manager ==============

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_conversations: Dict[str, set] = defaultdict(set)

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        online_users[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in online_users:
            del online_users[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast_to_conversation(self, message: str, conversation_id: str, exclude_user: str = None):
        for user_id, conv_ids in self.user_conversations.items():
            if conversation_id in conv_ids and user_id != exclude_user:
                if user_id in self.active_connections:
                    await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

# ============== Helper Functions ==============

def generate_id():
    return str(uuid.uuid4())

def get_user_info(user_id: str) -> Dict:
    """Get user info from database or return default"""
    if user_id in users_db:
        return users_db[user_id]
    return {
        "id": user_id,
        "name": f"User {user_id[:8]}",
        "email": f"user{user_id[:8]}@example.com",
        "image": None
    }

def format_message(msg: Dict) -> Dict:
    """Format message for API response"""
    sender = get_user_info(msg.get("sender_id", ""))
    return {
        "id": msg.get("id", generate_id()),
        "conversationId": msg.get("conversation_id"),
        "sender": {
            "id": sender["id"],
            "name": sender["name"],
            "email": sender["email"],
            "image": sender.get("image")
        },
        "content": msg.get("content", ""),
        "messageType": msg.get("message_type", "text"),
        "readBy": msg.get("read_by", []),
        "status": msg.get("status", "sent"),
        "createdAt": msg.get("created_at", datetime.now()).isoformat(),
        "updatedAt": msg.get("updated_at", datetime.now()).isoformat()
    }

# ============== REST API Endpoints ==============

@app.get("/")
async def root():
    return {
        "message": "EduLearn Chat Messenger API",
        "version": "1.0.0",
        "endpoints": {
            "conversations": "/api/chat/conversations",
            "messages": "/api/chat/messages",
            "websocket": "/ws/chat/{user_id}"
        }
    }

@app.get("/api/chat/conversations")
async def get_conversations(user_id: str = Query(...)):
    """Get all conversations for a user"""
    user_conversations = []
    
    for conv_id, conv in conversations_db.items():
        if user_id in conv.get("participants", []):
            # Get participant details
            participants = []
            for pid in conv.get("participants", []):
                participants.append(get_user_info(pid))
            
            user_conversations.append({
                "id": conv_id,
                "participants": participants,
                "lastMessage": conv.get("last_message"),
                "lastMessageAt": conv.get("last_message_at").isoformat() if conv.get("last_message_at") else None,
                "lastSender": conv.get("last_sender_id"),
                "unreadCount": conv.get("unread_count", {}),
                "createdAt": conv.get("created_at", datetime.now()).isoformat()
            })
    
    # Sort by last message time
    user_conversations.sort(
        key=lambda x: x.get("lastMessageAt") or "1970-01-01",
        reverse=True
    )
    
    return {"conversations": user_conversations}

@app.post("/api/chat/conversations")
async def create_conversation(data: ConversationCreate):
    """Create a new conversation"""
    conv_id = generate_id()
    
    conversation = {
        "id": conv_id,
        "participants": data.participants,
        "last_message": data.initial_message,
        "last_message_at": datetime.now() if data.initial_message else None,
        "last_sender_id": data.participants[0] if data.participants else None,
        "unread_count": {p: 0 for p in data.participants},
        "created_at": datetime.now()
    }
    
    conversations_db[conv_id] = conversation
    
    # Add initial message if provided
    if data.initial_message:
        message = {
            "id": generate_id(),
            "conversation_id": conv_id,
            "sender_id": data.participants[0],
            "content": data.initial_message,
            "message_type": "text",
            "read_by": [data.participants[0]],
            "status": "sent",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        messages_db[conv_id].append(message)
    
    # Notify participants
    for participant_id in data.participants:
        manager.user_conversations[participant_id].add(conv_id)
    
    return {"conversation_id": conv_id, "success": True}

@app.get("/api/chat/messages")
async def get_messages(
    conversation_id: str = Query(...),
    limit: int = Query(50, le=100),
    before: Optional[str] = None
):
    """Get messages for a conversation"""
    if conversation_id not in messages_db:
        return {"messages": []}
    
    messages = messages_db[conversation_id]
    
    # Apply pagination
    if before:
        messages = [m for m in messages if m.get("id") != before]
    
    messages = messages[-limit:]
    
    formatted_messages = [format_message(m) for m in messages]
    
    return {"messages": formatted_messages}

@app.post("/api/chat/messages")
async def send_message(data: MessageCreate):
    """Send a new message"""
    if data.conversation_id not in conversations_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    message = {
        "id": generate_id(),
        "conversation_id": data.conversation_id,
        "sender_id": data.sender_id,
        "content": data.content,
        "message_type": data.message_type,
        "read_by": [data.sender_id],
        "status": "sent",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    messages_db[data.conversation_id].append(message)
    
    # Update conversation
    conv = conversations_db[data.conversation_id]
    conv["last_message"] = data.content
    conv["last_message_at"] = datetime.now()
    conv["last_sender_id"] = data.sender_id
    
    # Update unread count for other participants
    for participant_id in conv.get("participants", []):
        if participant_id != data.sender_id:
            conv["unread_count"][participant_id] = conv["unread_count"].get(participant_id, 0) + 1
    
    # Broadcast to other participants via WebSocket
    formatted_message = format_message(message)
    broadcast_data = {
        "type": "new_message",
        "message": formatted_message,
        "conversation_id": data.conversation_id
    }
    
    await manager.broadcast_to_conversation(
        json.dumps(broadcast_data, default=str),
        data.conversation_id,
        exclude_user=data.sender_id
    )
    
    return {"message": formatted_message}

@app.post("/api/chat/read")
async def mark_messages_read(data: ReadReceipt):
    """Mark messages as read"""
    if data.conversation_id not in messages_db:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = messages_db[data.conversation_id]
    updated_count = 0
    
    for msg in messages:
        if msg.get("id") in data.message_ids and data.user_id not in msg.get("read_by", []):
            msg.setdefault("read_by", []).append(data.user_id)
            msg["status"] = "read"
            updated_count += 1
    
    # Reset unread count
    if data.conversation_id in conversations_db:
        conv = conversations_db[data.conversation_id]
        conv["unread_count"][data.user_id] = 0
    
    return {"updated": updated_count}

@app.get("/api/chat/users")
async def search_users(q: str = Query(..., min_length=2)):
    """Search for users"""
    results = []
    query = q.lower()
    
    for user_id, user in users_db.items():
        if query in user.get("name", "").lower() or query in user.get("email", "").lower():
            results.append({
                "id": user_id,
                "name": user.get("name"),
                "email": user.get("email"),
                "image": user.get("image"),
                "online": user_id in online_users
            })
    
    return {"users": results}

# ============== WebSocket Endpoints ==============

@app.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time chat"""
    await manager.connect(websocket, user_id)
    
    # Register user's conversations
    for conv_id, conv in conversations_db.items():
        if user_id in conv.get("participants", []):
            manager.user_conversations[user_id].add(conv_id)
    
    # Broadcast online status
    online_notification = {
        "type": "user_online",
        "user_id": user_id,
        "timestamp": datetime.now().isoformat()
    }
    for uid, ws in manager.active_connections.items():
        if uid != user_id:
            try:
                await ws.send_text(json.dumps(online_notification))
            except:
                pass
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            msg_type = message_data.get("type")
            
            if msg_type == "chat_message":
                # Handle chat message
                content = message_data.get("content")
                conversation_id = message_data.get("conversation_id")
                
                if content and conversation_id:
                    # Save message
                    message = {
                        "id": generate_id(),
                        "conversation_id": conversation_id,
                        "sender_id": user_id,
                        "content": content,
                        "message_type": "text",
                        "read_by": [user_id],
                        "status": "sent",
                        "created_at": datetime.now(),
                        "updated_at": datetime.now()
                    }
                    
                    messages_db[conversation_id].append(message)
                    
                    # Update conversation
                    if conversation_id in conversations_db:
                        conv = conversations_db[conversation_id]
                        conv["last_message"] = content
                        conv["last_message_at"] = datetime.now()
                        conv["last_sender_id"] = user_id
                        
                        for pid in conv.get("participants", []):
                            if pid != user_id:
                                conv["unread_count"][pid] = conv["unread_count"].get(pid, 0) + 1
                    
                    # Broadcast to conversation
                    formatted_message = format_message(message)
                    broadcast_data = {
                        "type": "new_message",
                        "message": formatted_message,
                        "conversation_id": conversation_id
                    }
                    
                    await manager.broadcast_to_conversation(
                        json.dumps(broadcast_data, default=str),
                        conversation_id,
                        exclude_user=user_id
                    )
                    
                    # Confirm to sender
                    await websocket.send_text(json.dumps({
                        "type": "message_sent",
                        "message_id": message["id"],
                        "status": "sent"
                    }))
            
            elif msg_type == "typing":
                # Handle typing indicator
                conversation_id = message_data.get("conversation_id")
                is_typing = message_data.get("is_typing", True)
                
                if conversation_id:
                    user_info = get_user_info(user_id)
                    
                    typing_data = {
                        "type": "typing_indicator",
                        "conversation_id": conversation_id,
                        "user_id": user_id,
                        "user_name": user_info.get("name", "Unknown"),
                        "is_typing": is_typing
                    }
                    
                    await manager.broadcast_to_conversation(
                        json.dumps(typing_data),
                        conversation_id,
                        exclude_user=user_id
                    )
            
            elif msg_type == "read_receipt":
                # Handle read receipts
                conversation_id = message_data.get("conversation_id")
                message_ids = message_data.get("message_ids", [])
                
                if conversation_id and message_ids:
                    for msg in messages_db.get(conversation_id, []):
                        if msg.get("id") in message_ids and user_id not in msg.get("read_by", []):
                            msg.setdefault("read_by", []).append(user_id)
                            msg["status"] = "read"
                    
                    # Notify sender
                    receipt_data = {
                        "type": "messages_read",
                        "conversation_id": conversation_id,
                        "reader_id": user_id,
                        "message_ids": message_ids
                    }
                    
                    await manager.broadcast_to_conversation(
                        json.dumps(receipt_data),
                        conversation_id,
                        exclude_user=user_id
                    )
    
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        
        # Broadcast offline status
        offline_notification = {
            "type": "user_offline",
            "user_id": user_id,
            "timestamp": datetime.now().isoformat()
        }
        for uid, ws in manager.active_connections.items():
            if uid != user_id:
                try:
                    await ws.send_text(json.dumps(offline_notification))
                except:
                    pass

# ============== Health Check ==============

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "EduLearn Chat Messenger API",
        "connections": len(online_users)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)