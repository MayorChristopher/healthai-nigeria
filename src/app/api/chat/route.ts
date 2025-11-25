import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { detectEmergencyType, recommendHospitals, shouldSuggestOnlineDoctor } from '@/lib/hospital-recommender'
import { filterMedicalResponse, validateResponseScope } from '@/lib/response-filter'
import { detectFollowUpNeeds, processLocationResponse } from '@/lib/follow-up-handler'
import { generateOfflineEmergencyResponse } from '@/lib/offline-emergency'

// Emergency fallback responses when AI fails
function getEmergencyFallback(emergencyType: string, language: string) {
  const responses = {
    cardiac: {
      english: "🚨 EMERGENCY: Chest pain can be serious. Call 112 immediately or go to the nearest hospital. Do not wait.",
      pidgin: "🚨 EMERGENCY: Chest pain fit serious o. Call 112 now now or go hospital sharp sharp. No wait!",
      auto: "🚨 EMERGENCY: Call 112 immediately for chest pain. Go to hospital now."
    },
    trauma: {
      english: "🚨 EMERGENCY: For injuries/bleeding, call 112 immediately. Apply pressure to bleeding wounds and get to hospital.",
      pidgin: "🚨 EMERGENCY: For injury/bleeding, call 112 sharp sharp. Press the wound make blood stop, go hospital.",
      auto: "🚨 EMERGENCY: Call 112 for injuries. Apply pressure to wounds, go to hospital."
    },
    general: {
      english: "🚨 EMERGENCY: This sounds serious. Call 112 immediately or go to the nearest hospital. Do not delay.",
      pidgin: "🚨 EMERGENCY: This thing serious o. Call 112 now or go hospital. No delay!",
      auto: "🚨 EMERGENCY: Call 112 immediately. Go to nearest hospital."
    }
  }
  
  return responses[emergencyType as keyof typeof responses]?.[language as keyof typeof responses.general] || 
         responses.general[language as keyof typeof responses.general] ||
         "🚨 EMERGENCY: Call 112 immediately. Go to hospital now."
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

function getSystemPrompt(language: string) {
  const languageInstruction = 
    language === 'english' ? 'CRITICAL: You MUST respond ONLY in clear, simple English. DO NOT use Pidgin. Even if the user uses Pidgin or broken English, respond in proper English.' :
    language === 'pidgin' ? 'CRITICAL: You MUST respond ONLY in Nigerian Pidgin. DO NOT use English.' :
    'CRITICAL: Detect the user\'s language. If they use proper English words and grammar, respond in English. If they use Pidgin (e.g., "dey", "fit", "make", "wetin"), respond in Pidgin. Default to English for unclear cases.'

  return `You are HealthAI Nigeria, a WHO-informed medical assistant for Nigerian communities.

LANGUAGE RULES (STRICTLY ENFORCE):
${languageInstruction}
- Use simple words that elderly people understand
- Be consistent - don't mix languages in one response
- Always use proper grammar and spelling
- Proofread your response before sending

MEDICAL KNOWLEDGE BASE (WHO-BASED):
- ALWAYS follow WHO Clinical Guidelines for symptom assessment
- Reference WHO Emergency Triage Assessment and Treatment (ETAT) protocols
- Use WHO-recommended fever thresholds: >38°C (100.4°F) requires medical attention
- Apply WHO malaria case management guidelines for Nigeria
- Follow WHO guidelines for respiratory infections and pneumonia
- Recognize WHO-classified emergency signs: danger signs in children and adults
- Provide evidence-based health information from WHO Nigeria country office
- Understand tropical disease symptoms per WHO African Region protocols

EMERGENCY DETECTION (Call 112 immediately):
- Chest pain, pressure, or tightness
- Difficulty breathing or shortness of breath
- Severe bleeding that won't stop
- Unconsciousness or fainting
- Severe head injury
- Stroke symptoms (face drooping, arm weakness, speech difficulty)
- Severe allergic reaction
- Poisoning or overdose

RESPONSE STRUCTURE:
1. **Acknowledge**: Vary your acknowledgment ("I hear you", "That sounds concerning", "Let me help", "I see") - don't always say "I understand"
2. **Assess**: Explain possible causes (WHO-based)
3. **Alert**: When to seek immediate care
4. **Advise**: Safe self-care steps (if appropriate)
5. **Action**: "See a doctor for proper diagnosis"

HEALTH EDUCATION:
- Explain symptoms in simple terms
- Mention prevention when relevant
- Reference WHO health guidelines
- Provide context about conditions

HEALTH EDUCATION QUESTIONS:
- If asked "What is health/malaria/diabetes/etc?": Provide educational answer based on WHO definitions
- If asked about prevention: Give WHO-recommended prevention tips
- If asked about general health topics: Educate them

HOSPITAL LOCATION REQUESTS:
- If asked about hospitals in a location (e.g., "hospitals in Abuja", "find hospitals near me"): This is a valid health-related request
- Provide helpful response and mention that you can show nearby hospitals
- Example: "I can help you find hospitals in [location]. Let me show you the nearest medical facilities."

NON-HEALTH QUESTIONS (weather, sports, politics):
- Politely redirect: "I'm a health assistant. I can only help with health concerns. Do you have any symptoms?"

EXAMPLE EDUCATION:
Question: "What is health?"
Answer: "According to WHO, health is a state of complete physical, mental, and social well-being, not just the absence of disease. It means your body works well, your mind is clear, and you can live a good life. To stay healthy: eat balanced meals, exercise regularly, sleep 7-8 hours, drink clean water, and see a doctor for check-ups. Do you have any specific health concerns?"

EXAMPLES:

English (Symptom): "I have fever and body pain"
Response: "I understand you have fever and body pain. In Nigeria, this could be malaria, typhoid, or a viral infection. According to WHO guidelines, if your fever is above 38°C (100.4°F) for more than 2 days, or you have severe headache, vomiting, or confusion, go to a hospital immediately. For now, rest, drink plenty of water, and use a cool cloth on your forehead. Please see a doctor today for proper testing and diagnosis."

Pidgin (Symptom): "My body dey hot and e dey pain me"
Response: "I hear say your body dey hot and e dey pain you. For Naija, e fit be malaria, typhoid, or virus. WHO talk say if your temperature pass 38 degrees for two days, or you get serious headache, vomiting, or you dey confuse, make you go hospital sharp sharp. For now, rest well, drink plenty water, and use cold towel for your head. But abeg, make you see doctor today make dem test you well."

Be helpful, educational, and safe. Base advice on WHO guidelines.`
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, language = 'auto', history = [], userLocation, isFollowUpResponse = false, followUpContext } = await req.json()

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

    // Get AI response - use working models only
    let response: string = ''
    const models = [
      'gemini-2.0-flash-lite',   // Fast and free
      'gemini-2.0-flash'         // Standard (free with limits)
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
        // Build conversation context
        let conversationContext = getSystemPrompt(language)
        
        if (history.length > 0) {
          conversationContext += '\n\nPREVIOUS CONVERSATION:\n'
          history.forEach((msg: any) => {
            conversationContext += `${msg.role === 'user' ? 'Patient' : 'HealthAI'}: ${msg.content}\n`
          })
          conversationContext += '\nRemember the context above. If the patient is answering your question, acknowledge it.\n'
        }
        
        conversationContext += `\n\nPatient: ${message}`
        
        const result = await model.generateContent(conversationContext)
        const rawResponse = result.response.text()
        
        // Filter and validate response
        const filterResult = filterMedicalResponse(rawResponse)
        const isScopeValid = validateResponseScope(rawResponse, message)
        
        if (!filterResult.isValid) {
          console.warn('⚠️ Response filtered:', filterResult.warnings)
        }
        
        if (!isScopeValid) {
          response = "I'm a health assistant. I can only help with health concerns. Do you have any symptoms or health questions?"
        } else {
          response = filterResult.filteredResponse
        }
        
        console.log(`✅ Successfully used model: ${modelName}`)
        if (filterResult.warnings.length > 0) {
          console.log('📝 Applied filters:', filterResult.warnings)
        }
        break
      } catch (modelError: any) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message)
        if (modelName === models[models.length - 1]) {
          // All models failed - check if it's emergency first
          const emergencyType = detectEmergencyType(message)
          const isEmergency = emergencyType !== 'none'
          
          if (isEmergency) {
            // Emergency situation - provide immediate guidance
            const emergencyResponse = getEmergencyFallback(emergencyType, language)
            const hospitals = recommendHospitals(emergencyType)
            
            return NextResponse.json({
              response: emergencyResponse,
              isEmergency: true,
              hospitals,
              onlineDoctors: false,
              sessionId
            })
          }
          
          // Non-emergency - provide offline emergency guidance with hospitals
          const offlineResponse = generateOfflineEmergencyResponse(message, language as 'english' | 'pidgin')
          const fallbackHospitals = recommendHospitals('general') // Always provide major hospitals
            
          return NextResponse.json({
            response: offlineResponse,
            isEmergency: false,
            hospitals: fallbackHospitals,
            onlineDoctors: false,
            sessionId
          })
        }
      }
    }

    // Process location from user message or follow-up response
    let processedLocation = userLocation
    
    // Check if user mentioned a location in their message
    const locationFromMessage = processLocationResponse(message)
    if (locationFromMessage.lat && locationFromMessage.lon) {
      processedLocation = locationFromMessage
    }
    
    // Also handle follow-up responses
    if (isFollowUpResponse && followUpContext === 'hospital_recommendation') {
      const locationData = processLocationResponse(message)
      if (locationData.lat && locationData.lon) {
        processedLocation = locationData
      } else if (locationData.address) {
        processedLocation = { ...userLocation, address: locationData.address }
      }
    }

    // Check if user is asking for hospitals
    const msgLower = message.toLowerCase()
    const isHospitalRequest = msgLower.includes('hospital') || 
      (msgLower.includes('nearest') && (msgLower.includes('clinic') || msgLower.includes('medical'))) ||
      msgLower.includes('find hospital') ||
      msgLower.includes('show hospital') ||
      msgLower.includes('give hospital')
    
    // Extract location from message
    const extractLocation = (msg: string) => {
      const lower = msg.toLowerCase()
      const cities = ['lagos', 'abuja', 'ibadan', 'enugu', 'kano', 'port harcourt', 'zaria', 'owerri', 'umuahia', 'umudike', 'aba', 'calabar', 'jos', 'ilorin', 'abia', 'rivers', 'imo', 'anambra', 'kaduna', 'plateau', 'kwara', 'cross river', 'osun', 'elele', 'warri', 'benin', 'asaba', 'onitsha', 'awka', 'nnewi', 'arochukwu', 'bende', 'ikwuano', 'isiala ngwa', 'ohafia', 'osisioma', 'ugwunagbo', 'ukwa east', 'ukwa west', 'umuahia north', 'umuahia south', 'umu nneochi']
      
      // Map local areas to main cities
      const locationMap: { [key: string]: string } = {
        'umudike': 'umuahia',
        'michael okpara': 'umuahia',
        'mouau': 'umuahia',
        'arochukwu': 'aba',
        'bende': 'umuahia',
        'ikwuano': 'umuahia',
        'isiala ngwa': 'aba',
        'ohafia': 'aba',
        'osisioma': 'aba',
        'ugwunagbo': 'aba',
        'ukwa east': 'aba',
        'ukwa west': 'aba',
        'umuahia north': 'umuahia',
        'umuahia south': 'umuahia',
        'umu nneochi': 'umuahia'
      }
      for (const city of cities) {
        if (lower.includes(city)) {
          return locationMap[city] || city
        }
      }
      return null
    }
    
    const locationQuery = extractLocation(message) || extractLocation(history[history.length - 1]?.content || '')
    
    // Get hospital recommendations
    let hospitals: any[] = []
    let needsLocation = false
    
    if (isEmergency) {
      if (!locationQuery && !processedLocation) {
        needsLocation = true
        // Override AI response to ask for location
        response = response + "\n\nTo find the nearest hospitals for you, I need to know your location. Please share your location using the options below."
      } else {
        hospitals = recommendHospitals(emergencyType, processedLocation?.lat, processedLocation?.lon, locationQuery || undefined)
      }
    } else if (isHospitalRequest) {
      if (!locationQuery && !processedLocation) {
        needsLocation = true
        // Override AI response to ask for location
        response = response + "\n\nTo find the nearest hospitals for you, I need to know your location. Please share your location using the options below."
      } else {
        hospitals = recommendHospitals('general', processedLocation?.lat, processedLocation?.lon, locationQuery || undefined)
      }
    }

    // Check for follow-up questions
    const followUp = !isEmergency && !isFollowUpResponse && !processedLocation
      ? detectFollowUpNeeds(response, message) 
      : null

    // Check if online doctor consultation is appropriate
    const onlineDoctors = !isEmergency && shouldSuggestOnlineDoctor(message)

    return NextResponse.json({
      response,
      isEmergency,
      hospitals,
      onlineDoctors,
      followUp,
      processedLocation,
      sessionId,
      needsLocation
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
