"""
FastAPI Backend for EduLearn Course Content API
Provides endpoints for course management, PDF viewing, and content delivery
"""

from fastapi import FastAPI, HTTPException, Depends, Query, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
import json
import os
from pathlib import Path as FilePath
import io
import base64

# Initialize FastAPI app
app = FastAPI(
    title="EduLearn Course Content API",
    description="API for managing course content, PDF viewing, and educational resources",
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

class Resource(BaseModel):
    id: Optional[str] = None
    title: str
    url: str
    type: str = "pdf"  # pdf, video, link, document
    size: Optional[int] = None
    pages: Optional[int] = None

class Lesson(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration: int = 0  # in minutes
    order: int = 0
    is_free: bool = False
    resources: List[Resource] = []
    content_type: str = "video"  # video, pdf, quiz, reading

class Section(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    order: int = 0
    lessons: List[Lesson] = []
    total_duration: int = 0

class Course(BaseModel):
    id: str
    title: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail: Optional[str] = None
    category: str = "Accountancy"
    level: str = "all-levels"
    language: str = "English"
    price: float = 0
    currency: str = "php"
    sections: List[Section] = []
    total_duration: int = 0
    total_lessons: int = 0
    is_published: bool = False
    is_featured: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[str]
    correct_answer: str
    points: int = 1
    explanation: Optional[str] = None

class QuizProgram(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    questions: List[QuizQuestion] = []
    passing_score: int = 70
    time_limit: Optional[int] = None  # in minutes
    max_attempts: Optional[int] = None

class ProgressUpdate(BaseModel):
    lesson_id: str
    completed: bool = False
    watched_seconds: int = 0
    score: Optional[float] = None

class PDFMetadata(BaseModel):
    title: str
    pages: int
    size: int
    author: Optional[str] = None
    created: Optional[str] = None
    thumbnail: Optional[str] = None

# ============== Sample Data ==============

# Load course data from JSON file
def load_course_data():
    json_path = FilePath("philippine-cpa-far-complete-course.json")
    if json_path.exists():
        with open(json_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

COURSE_DATA = load_course_data()

# Sample PDF resources for CPA course
PDF_RESOURCES = {
    "conceptual-framework": {
        "title": "Conceptual Framework Summary",
        "pages": 25,
        "size": 2048000,
        "author": "EduLearn",
        "description": "Comprehensive summary of the Conceptual Framework for Financial Reporting"
    },
    "pfrs-standards": {
        "title": "PFRS Standards Guide 2024",
        "pages": 150,
        "size": 15360000,
        "author": "FRSC",
        "description": "Complete guide to Philippine Financial Reporting Standards"
    },
    "financial-ratios": {
        "title": "Financial Ratios Formula Sheet",
        "pages": 10,
        "size": 512000,
        "author": "EduLearn",
        "description": "Quick reference for all financial ratios"
    },
    "board-exam-prep": {
        "title": "Board Exam Preparation Guide",
        "pages": 50,
        "size": 4096000,
        "author": "EduLearn",
        "description": "Strategies and tips for passing the CPA Board Exam"
    },
    "practice-problems": {
        "title": "Practice Problems Collection",
        "pages": 200,
        "size": 20480000,
        "author": "EduLearn",
        "description": "200+ practice problems with detailed solutions"
    }
}

# ============== API Endpoints ==============

@app.get("/")
async def root():
    return {
        "message": "EduLearn Course Content API",
        "version": "1.0.0",
        "endpoints": {
            "courses": "/api/courses",
            "course_detail": "/api/courses/{slug}",
            "pdf_viewer": "/api/pdf/{resource_id}",
            "quiz": "/api/quiz/{program_id}"
        }
    }

# ============== Course Endpoints ==============

@app.get("/api/courses", response_model=List[Dict[str, Any]])
async def get_courses(
    category: Optional[str] = None,
    level: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(default=10, le=100)
):
    """Get all courses with optional filtering"""
    courses = []
    
    # Add the CPA course if loaded
    if COURSE_DATA:
        courses.append({
            "id": "cpa-far-001",
            "title": COURSE_DATA.get("title", "Philippine CPA Board Exam Review"),
            "slug": COURSE_DATA.get("slug", "philippine-cpa-board-far"),
            "description": COURSE_DATA.get("description", ""),
            "short_description": COURSE_DATA.get("shortDescription", ""),
            "thumbnail": COURSE_DATA.get("thumbnail", ""),
            "category": COURSE_DATA.get("category", "Accountancy"),
            "level": COURSE_DATA.get("level", "all-levels"),
            "price": COURSE_DATA.get("price", 0),
            "discount_price": COURSE_DATA.get("discountPrice", 0),
            "currency": COURSE_DATA.get("currency", "php"),
            "total_lessons": COURSE_DATA.get("totalLessons", 0),
            "total_duration": COURSE_DATA.get("totalDuration", 0),
            "is_featured": COURSE_DATA.get("isFeatured", False),
            "rating": 4.9,
            "review_count": 156,
            "enrollment_count": 1234
        })
    
    # Apply filters
    if category:
        courses = [c for c in courses if c.get("category", "").lower() == category.lower()]
    if level:
        courses = [c for c in courses if c.get("level", "").lower() == level.lower()]
    if featured is not None:
        courses = [c for c in courses if c.get("is_featured", False) == featured]
    
    return courses[:limit]

@app.get("/api/courses/{slug}")
async def get_course_by_slug(slug: str):
    """Get course details by slug"""
    if COURSE_DATA and COURSE_DATA.get("slug") == slug:
        return {
            "id": "cpa-far-001",
            **COURSE_DATA,
            "sections": COURSE_DATA.get("sections", []),
            "programs": COURSE_DATA.get("programs", [])
        }
    raise HTTPException(status_code=404, detail="Course not found")

@app.get("/api/courses/{slug}/sections")
async def get_course_sections(slug: str):
    """Get all sections for a course"""
    if COURSE_DATA and COURSE_DATA.get("slug") == slug:
        return COURSE_DATA.get("sections", [])
    raise HTTPException(status_code=404, detail="Course not found")

@app.get("/api/courses/{slug}/sections/{section_id}")
async def get_section_detail(slug: str, section_id: str):
    """Get section details with lessons"""
    if COURSE_DATA and COURSE_DATA.get("slug") == slug:
        sections = COURSE_DATA.get("sections", [])
        for section in sections:
            if section.get("id") == section_id or str(section.get("order")) == section_id:
                return section
    raise HTTPException(status_code=404, detail="Section not found")

@app.get("/api/courses/{slug}/lessons/{lesson_id}")
async def get_lesson_detail(slug: str, lesson_id: str):
    """Get lesson details"""
    if COURSE_DATA and COURSE_DATA.get("slug") == slug:
        for section in COURSE_DATA.get("sections", []):
            for lesson in section.get("lessons", []):
                if lesson.get("id") == lesson_id or lesson.get("title", "").lower().replace(" ", "-") == lesson_id:
                    return {
                        **lesson,
                        "section_title": section.get("title"),
                        "resources": lesson.get("resources", [])
                    }
    raise HTTPException(status_code=404, detail="Lesson not found")

# ============== PDF Viewer Endpoints ==============

@app.get("/api/pdf/resources")
async def get_pdf_resources():
    """Get all available PDF resources"""
    resources = []
    for resource_id, metadata in PDF_RESOURCES.items():
        resources.append({
            "id": resource_id,
            **metadata
        })
    return resources

@app.get("/api/pdf/{resource_id}")
async def get_pdf_resource(resource_id: str):
    """Get PDF resource metadata"""
    if resource_id in PDF_RESOURCES:
        return {
            "id": resource_id,
            **PDF_RESOURCES[resource_id],
            "view_url": f"/api/pdf/{resource_id}/view",
            "download_url": f"/api/pdf/{resource_id}/download"
        }
    raise HTTPException(status_code=404, detail="PDF resource not found")

@app.get("/api/pdf/{resource_id}/metadata")
async def get_pdf_metadata(resource_id: str):
    """Get PDF metadata"""
    if resource_id in PDF_RESOURCES:
        return PDF_RESOURCES[resource_id]
    raise HTTPException(status_code=404, detail="PDF resource not found")

@app.get("/api/pdf/{resource_id}/view")
async def view_pdf(resource_id: str, page: int = Query(default=1, ge=1)):
    """Get PDF viewing data (simulated)"""
    if resource_id in PDF_RESOURCES:
        resource = PDF_RESOURCES[resource_id]
        return {
            "resource_id": resource_id,
            "title": resource["title"],
            "current_page": page,
            "total_pages": resource["pages"],
            "zoom_level": 100,
            "view_mode": "single",  # single, continuous, facing
            "thumbnail": f"/api/pdf/{resource_id}/thumbnail",
            "content": f"Content for page {page} of {resource['title']}"
        }
    raise HTTPException(status_code=404, detail="PDF resource not found")

@app.get("/api/pdf/{resource_id}/thumbnail")
async def get_pdf_thumbnail(resource_id: str):
    """Get PDF thumbnail"""
    if resource_id in PDF_RESOURCES:
        # Return placeholder thumbnail
        return {
            "resource_id": resource_id,
            "thumbnail_url": f"https://via.placeholder.com/200x280?text={resource_id}",
            "width": 200,
            "height": 280
        }
    raise HTTPException(status_code=404, detail="PDF resource not found")

@app.get("/api/pdf/{resource_id}/download")
async def download_pdf(resource_id: str):
    """Download PDF resource"""
    if resource_id in PDF_RESOURCES:
        resource = PDF_RESOURCES[resource_id]
        # In real implementation, return actual file
        return {
            "resource_id": resource_id,
            "filename": f"{resource_id}.pdf",
            "size": resource["size"],
            "download_url": f"/files/pdfs/{resource_id}.pdf",
            "expires_at": (datetime.now() + timedelta(hours=1)).isoformat()
        }
    raise HTTPException(status_code=404, detail="PDF resource not found")

# ============== Quiz Endpoints ==============

@app.get("/api/quiz/programs")
async def get_quiz_programs(course_slug: Optional[str] = None):
    """Get all quiz programs"""
    programs = COURSE_DATA.get("programs", [])
    if course_slug:
        # Filter by course if needed
        return programs[:20]
    return programs[:50]

@app.get("/api/quiz/{program_id}")
async def get_quiz_program(program_id: str):
    """Get quiz program with questions"""
    programs = COURSE_DATA.get("programs", [])
    for program in programs:
        if program.get("id") == program_id:
            return program
    raise HTTPException(status_code=404, detail="Quiz program not found")

@app.post("/api/quiz/{program_id}/submit")
async def submit_quiz(program_id: str, answers: Dict[str, str] = Body(...)):
    """Submit quiz answers and get results"""
    programs = COURSE_DATA.get("programs", [])
    for program in programs:
        if program.get("id") == program_id:
            questions = program.get("questions", [])
            total_questions = len(questions)
            correct_answers = 0
            
            for question in questions:
                question_id = question.get("id", "")
                correct_answer = question.get("correctAnswer", "")
                user_answer = answers.get(question_id, "")
                
                if user_answer.lower() == correct_answer.lower():
                    correct_answers += 1
            
            score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
            passed = score >= program.get("passingScore", 70)
            
            return {
                "program_id": program_id,
                "total_questions": total_questions,
                "correct_answers": correct_answers,
                "score": round(score, 2),
                "passed": passed,
                "passing_score": program.get("passingScore", 70),
                "submitted_at": datetime.now().isoformat()
            }
    raise HTTPException(status_code=404, detail="Quiz program not found")

# ============== Progress Tracking Endpoints ==============

@app.get("/api/progress/{user_id}/{course_id}")
async def get_user_progress(user_id: str, course_id: str):
    """Get user progress for a course"""
    # Simulated progress data
    return {
        "user_id": user_id,
        "course_id": course_id,
        "enrolled_at": datetime.now().isoformat(),
        "last_accessed": datetime.now().isoformat(),
        "completed_lessons": [],
        "quiz_scores": {},
        "overall_progress": 0,
        "total_time_spent": 0
    }

@app.post("/api/progress/{user_id}/{course_id}")
async def update_progress(user_id: str, course_id: str, update: ProgressUpdate):
    """Update user progress"""
    return {
        "user_id": user_id,
        "course_id": course_id,
        "lesson_id": update.lesson_id,
        "completed": update.completed,
        "watched_seconds": update.watched_seconds,
        "score": update.score,
        "updated_at": datetime.now().isoformat(),
        "success": True
    }

# ============== Content Search Endpoints ==============

@app.get("/api/search")
async def search_content(
    q: str = Query(..., min_length=2),
    type: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    """Search courses, lessons, and resources"""
    results = []
    query = q.lower()
    
    # Search in course data
    if COURSE_DATA:
        # Search in title
        if query in COURSE_DATA.get("title", "").lower():
            results.append({
                "type": "course",
                "id": COURSE_DATA.get("slug"),
                "title": COURSE_DATA.get("title"),
                "description": COURSE_DATA.get("shortDescription", "")
            })
        
        # Search in sections and lessons
        for section in COURSE_DATA.get("sections", []):
            if query in section.get("title", "").lower():
                results.append({
                    "type": "section",
                    "id": section.get("id", ""),
                    "title": section.get("title"),
                    "course": COURSE_DATA.get("title")
                })
            
            for lesson in section.get("lessons", []):
                if query in lesson.get("title", "").lower() or query in lesson.get("description", "").lower():
                    results.append({
                        "type": "lesson",
                        "id": lesson.get("id", ""),
                        "title": lesson.get("title"),
                        "section": section.get("title"),
                        "duration": lesson.get("duration", 0)
                    })
    
    # Search in PDF resources
    for resource_id, resource in PDF_RESOURCES.items():
        if query in resource["title"].lower() or query in resource.get("description", "").lower():
            results.append({
                "type": "pdf",
                "id": resource_id,
                "title": resource["title"],
                "pages": resource["pages"]
            })
    
    return {
        "query": q,
        "results": results[:limit],
        "total": len(results)
    }

# ============== Admin Endpoints ==============

@app.post("/api/admin/courses")
async def create_course(course: Course):
    """Create a new course (admin only)"""
    return {
        "id": course.id or "new-course-001",
        **course.dict(),
        "created_at": datetime.now().isoformat(),
        "success": True
    }

@app.put("/api/admin/courses/{course_id}")
async def update_course(course_id: str, course: Course):
    """Update a course (admin only)"""
    return {
        "id": course_id,
        **course.dict(),
        "updated_at": datetime.now().isoformat(),
        "success": True
    }

@app.delete("/api/admin/courses/{course_id}")
async def delete_course(course_id: str):
    """Delete a course (admin only)"""
    return {
        "id": course_id,
        "deleted": True,
        "deleted_at": datetime.now().isoformat()
    }

# ============== Health Check ==============

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "EduLearn Course Content API"
    }

# ============== Chat API Endpoints ==============

# Sample chat data storage (in-memory for demo, use MongoDB in production)
conversations_db = {}
messages_db = {}

@app.get("/api/chat/conversations")
async def get_chat_conversations(user_id: str = Query(..., description="User ID")):
    """Get all conversations for a user"""
    user_conversations = []
    
    for conv_id, conv in conversations_db.items():
        if user_id in conv.get("participants", []):
            user_conversations.append({
                "id": conv_id,
                "participants": conv.get("participants", []),
                "lastMessage": conv.get("last_message", ""),
                "lastMessageAt": conv.get("last_message_at"),
                "unreadCount": conv.get("unread_count", {}).get(user_id, 0)
            })
    
    return {"conversations": user_conversations}

@app.post("/api/chat/conversations")
async def create_chat_conversation(participants: List[str] = Body(...), initial_message: Optional[str] = Body(None)):
    """Create a new conversation"""
    conv_id = f"conv_{len(conversations_db) + 1:04d}"
    
    conversations_db[conv_id] = {
        "id": conv_id,
        "participants": participants,
        "last_message": initial_message or "",
        "last_message_at": datetime.now().isoformat() if initial_message else None,
        "unread_count": {p: 0 for p in participants}
    }
    
    if initial_message:
        msg_id = f"msg_{len(messages_db) + 1:04d}"
        messages_db[msg_id] = {
            "id": msg_id,
            "conversation_id": conv_id,
            "sender_id": participants[0],
            "content": initial_message,
            "message_type": "text",
            "created_at": datetime.now().isoformat()
        }
    
    return {"conversation_id": conv_id, "success": True}

@app.get("/api/chat/messages")
async def get_chat_messages(conversation_id: str = Query(..., description="Conversation ID")):
    """Get messages for a conversation"""
    conversation_messages = []
    
    for msg_id, msg in messages_db.items():
        if msg.get("conversation_id") == conversation_id:
            conversation_messages.append(msg)
    
    # Sort by created_at
    conversation_messages.sort(key=lambda x: x.get("created_at", ""))
    
    return {"messages": conversation_messages}

@app.post("/api/chat/messages")
async def send_chat_message(
    conversation_id: str = Body(...),
    sender_id: str = Body(...),
    content: str = Body(...),
    message_type: str = Body("text")
):
    """Send a new message"""
    msg_id = f"msg_{len(messages_db) + 1:04d}"
    
    message = {
        "id": msg_id,
        "conversation_id": conversation_id,
        "sender_id": sender_id,
        "content": content,
        "message_type": message_type,
        "created_at": datetime.now().isoformat()
    }
    
    messages_db[msg_id] = message
    
    # Update conversation
    if conversation_id in conversations_db:
        conversations_db[conversation_id]["last_message"] = content
        conversations_db[conversation_id]["last_message_at"] = datetime.now().isoformat()
        
        # Update unread count for other participants
        for participant in conversations_db[conversation_id].get("participants", []):
            if participant != sender_id:
                current_count = conversations_db[conversation_id].get("unread_count", {}).get(participant, 0)
                if "unread_count" not in conversations_db[conversation_id]:
                    conversations_db[conversation_id]["unread_count"] = {}
                conversations_db[conversation_id]["unread_count"][participant] = current_count + 1
    
    return {"message": message, "success": True}

@app.post("/api/chat/read")
async def mark_messages_read(conversation_id: str = Body(...), user_id: str = Body(...)):
    """Mark messages as read"""
    if conversation_id in conversations_db:
        if "unread_count" in conversations_db[conversation_id]:
            conversations_db[conversation_id]["unread_count"][user_id] = 0
    
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)