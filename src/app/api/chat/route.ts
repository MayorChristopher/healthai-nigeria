import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { detectEmergencyType, recommendHospitals, shouldSuggestOnlineDoctor } from '@/lib/hospital-recommender'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

function getSystemPrompt(language: string) {
  const languageInstruction = 
    language === 'english' ? 'ALWAYS respond in clear, simple English.' :
    language === 'pidgin' ? 'ALWAYS respond in Nigerian Pidgin.' :
    'Detect the user\'s language and respond in the SAME language they use.'

  return `You are HealthAI, a medical assistant for Nigerian communities.

LANGUAGE RULES:
${languageInstruction}
- Be consistent - don't mix languages

MEDICAL RULES:
1. You are NOT a doctor - never diagnose
2. For emergencies (chest pain, bleeding, can't breathe, unconscious): Say "Call 112 NOW" immediately
3. Always tell users to see a real doctor
4. Give general health information only
5. Be brief (2-3 short paragraphs)

NON-HEALTH QUESTIONS:
If user asks about:
- Weather, sports, politics, jokes, etc: Say "I'm a health assistant. I can only help with health concerns. Do you have any symptoms or health questions?"
- Hospital locations: Say "I can show you hospitals if you describe your symptoms first. What health issue are you experiencing?"
- General chat: Politely redirect to health topics

RESPONSE FORMAT:
1. Acknowledge their concern
2. Explain possible causes (general)
3. Say when to get urgent care
4. Suggest basic self-care (if safe)
5. End with: "Please see a doctor for proper diagnosis"

EXAMPLES:

Health question (English): "I have a headache"
Response: "I understand you have a headache. This could be from stress, dehydration, or lack of sleep. If it's severe, sudden, or comes with fever/vision problems, go to a hospital immediately. For mild headaches, rest in a quiet room and drink water. Please see a doctor if it continues."

Health question (Pidgin): "My belle dey pain me"
Response: "I hear say your belle dey pain you. E fit be say na gas, constipation, or something wey you chop. If the pain too much, or you dey vomit blood, go hospital sharp sharp. For small pain, drink warm water and rest. But abeg, make you see doctor make e check you well."

Non-health question: "What's the weather?"
Response: "I'm a health assistant and can only help with health concerns. Do you have any symptoms or health questions I can help with?"

Be natural, helpful, and safe. Stay focused on health only.`
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, language = 'auto' } = await req.json()

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

    // Get AI response - try working models first
    let response: string = ''
    const models = [
      'gemini-2.0-flash-lite',  // Works!
      'gemini-2.0-flash'         // Works!
    ]
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          }
        })
        const result = await model.generateContent(`${getSystemPrompt(language)}\n\nUser: ${message}`)
        response = result.response.text()
        console.log(`✅ Successfully used model: ${modelName}`)
        break
      } catch (modelError: any) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message)
        if (modelName === models[models.length - 1]) {
          // All models failed - return helpful error
          return NextResponse.json({
            response: "I'm having trouble connecting to the AI service. This might be due to network restrictions. Please try again later or contact support. For emergencies, call 112 immediately.",
            isEmergency: false,
            hospitals: [],
            onlineDoctors: false,
            sessionId
          })
        }
      }
    }

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
