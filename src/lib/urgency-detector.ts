// Urgency level detection for medical triage
export type UrgencyLevel = 'emergency' | 'high' | 'medium'

export interface UrgencyInfo {
  level: UrgencyLevel
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
  action: string
}

export function detectUrgencyLevel(message: string, isEmergency: boolean): UrgencyInfo | null {
  const lower = message.toLowerCase()
  
  // Check if it's a general health question (not symptoms)
  const generalQuestions = [
    'what is', 'what are', 'how to', 'how can', 'tell me about',
    'explain', 'define', 'meaning of', 'information about',
    'hospital', 'find hospital', 'nearest hospital', 'doctor near'
  ]
  
  const isGeneralQuestion = generalQuestions.some(q => lower.includes(q))
  if (isGeneralQuestion && !isEmergency) {
    return null // Don't show urgency for general questions
  }
  
  // EMERGENCY - Life threatening
  if (isEmergency || 
      lower.includes('chest pain') || 
      lower.includes('can\'t breathe') ||
      lower.includes('difficulty breathing') ||
      lower.includes('unconscious') ||
      lower.includes('severe bleeding') ||
      lower.includes('stroke') ||
      lower.includes('heart attack')) {
    return {
      level: 'emergency',
      label: 'EMERGENCY',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: '🚨',
      action: 'Call 112 immediately'
    }
  }
  
  // HIGH - Needs hospital today
  if (lower.includes('severe') ||
      lower.includes('high fever') ||
      lower.includes('vomiting blood') ||
      lower.includes('can\'t eat') ||
      lower.includes('dehydrated') ||
      lower.includes('convulsion')) {
    return {
      level: 'high',
      label: 'HIGH URGENCY',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      icon: '🔴',
      action: 'Go to hospital today'
    }
  }
  
  // MEDIUM - See doctor within 24-48 hours
  if (lower.includes('fever') ||
      lower.includes('pain') ||
      lower.includes('cough') ||
      lower.includes('diarrhea') ||
      lower.includes('rash') ||
      lower.includes('headache') ||
      lower.includes('feel') ||
      lower.includes('sick') ||
      lower.includes('hurt')) {
    return {
      level: 'medium',
      label: 'MEDIUM',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      icon: '🟡',
      action: 'See doctor within 24-48 hours'
    }
  }
  
  // No urgency indicator for non-symptom questions
  return null
}
