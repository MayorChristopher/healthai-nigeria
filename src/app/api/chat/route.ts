import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { detectEmergencyType, recommendHospitals, shouldSuggestOnlineDoctor } from '@/lib/hospital-recommender'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYSTEM_PROMPT = `You are HealthAI, a medical assistant for Nigerian communities. You provide health guidance in English and Nigerian Pidgin.

CRITICAL RULES:
1. You are NOT a doctor. Always remind users to consult healthcare professionals.
2. For emergencies (chest pain, severe bleeding, unconsciousness, difficulty breathing), immediately tell them to call 112 or go to hospital.
3. Provide general health information only, never diagnose.
4. Be culturally sensitive to Nigerian context.
5. If user speaks Pidgin, respond in Pidgin.
6. Keep responses concise (2-3 paragraphs max).

Format your response as:
- Brief acknowledgment of symptoms
- General information about possible causes
- When to seek immediate care
- Self-care suggestions (if appropriate)
- Reminder to consult a doctor

Never claim to diagnose. Always emphasize this is general information only.`

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to .env.local' },
        { status: 500 }
      )
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    // Detect emergency
    const emergencyType = detectEmergencyType(message)
    const isEmergency = emergencyType !== 'none'

    // Get AI response
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    })
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${message}`)
    const response = result.response.text()

    // Get hospital recommendations if emergency
    const hospitals = isEmergency ? recommendHospitals(emergencyType) : []

    // Check if online doctor consultation is appropriate
    const onlineDoctors = !isEmergency && shouldSuggestOnlineDoctor(message)

    return NextResponse.json({
      response,
      isEmergency,
      hospitals,
      onlineDoctors,
      sessionId
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    if (error?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your GEMINI_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
