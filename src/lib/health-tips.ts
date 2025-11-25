// Health tips to show while AI is processing
export const HEALTH_TIPS = [
  "💡 Save 112 in your phone for emergencies",
  "💡 Malaria is preventable with mosquito nets",
  "💡 Drink clean, treated water to prevent typhoid",
  "💡 Wash hands regularly to prevent infections",
  "💡 Fever above 38°C (100.4°F) needs medical attention",
  "💡 Keep a basic first aid kit at home",
  "💡 Regular exercise improves overall health",
  "💡 Get 7-8 hours of sleep each night",
  "💡 Eat balanced meals with fruits and vegetables",
  "💡 Visit a doctor for regular check-ups"
]

export function getRandomHealthTip(): string {
  return HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)]
}
