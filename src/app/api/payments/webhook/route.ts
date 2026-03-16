import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectDB } from '@/lib/mongodb'
import Enrollment from '@/models/Enrollment'
import Course from '@/models/Course'
import { Payment } from '@/models/Review'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[WEBHOOK] Invalid signature:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  await connectDB()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, courseId } = session.metadata!

    try {
      // Update payment record
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          status: 'succeeded',
          stripePaymentIntentId: session.payment_intent as string,
        }
      )

      // Create enrollment
      const existing = await Enrollment.findOne({ user: userId, course: courseId })
      if (!existing) {
        await Enrollment.create({
          user: userId,
          course: courseId,
          amountPaid: (session.amount_total ?? 0) / 100,
          currency: session.currency ?? 'usd',
          paymentId: session.payment_intent as string,
          status: 'active',
        })
        await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } })
      }

      console.log(`[WEBHOOK] Enrolled user ${userId} in course ${courseId}`)
    } catch (err) {
      console.error('[WEBHOOK] Enrollment error:', err)
    }
  }

  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge
    await Payment.findOneAndUpdate(
      { stripePaymentIntentId: charge.payment_intent },
      { status: 'refunded' }
    )
    // Mark enrollment as refunded
    const payment = await Payment.findOne({ stripePaymentIntentId: charge.payment_intent })
    if (payment) {
      await Enrollment.findOneAndUpdate(
        { user: payment.user, course: payment.course },
        { status: 'refunded' }
      )
      await Course.findByIdAndUpdate(payment.course, { $inc: { enrollmentCount: -1 } })
    }
  }

  return NextResponse.json({ received: true })
}
