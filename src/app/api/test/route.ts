import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  
  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash'
  ]
  
  const results = []
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent('Say hello')
      const response = result.response.text()
      results.push({ model: modelName, status: 'SUCCESS', response: response.substring(0, 50) })
    } catch (error: any) {
      results.push({ model: modelName, status: 'FAILED', error: error.message })
    }
  }
  
  return NextResponse.json({ results })
}
