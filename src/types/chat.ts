// Enhanced chat types with threading and follow-up support

export type Hospital = {
  name: string
  phone: string
  address: string
  coords: string
  distance?: string
}

export type FollowUpQuestion = {
  type: 'location' | 'severity' | 'duration'
  question: string
  questionPidgin: string
  context: string
  requiresLocation?: boolean
}

export type Message = {
  id: string
  role: 'user' | 'ai'
  content: string
  isEmergency?: boolean
  hospitals?: Hospital[]
  onlineDoctors?: boolean
  timestamp: Date
  feedback?: 'helpful' | 'not-helpful' | null
  followUp?: FollowUpQuestion
  replyToId?: string // For threading
  thread?: Message[] // Nested replies
  isFollowUpResponse?: boolean
  locationData?: {
    lat?: number
    lon?: number
    city?: string
  }
}

export type ChatState = {
  messages: Message[]
  pendingFollowUp?: FollowUpQuestion
  awaitingLocation: boolean
  userLocation?: {
    lat: number
    lon: number
    city?: string
  }
}