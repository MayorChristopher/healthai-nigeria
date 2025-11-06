# Test Scenarios for Demo Practice 🧪

Practice these scenarios to ensure smooth demo delivery.

---

## 🚨 Emergency Scenarios (High Priority)

### Scenario 1: Chest Pain (Critical)
**Input:**
```
"I have chest pain and I'm sweating"
```

**Expected Response:**
- ✅ Red emergency badge appears
- ✅ AI warns this is serious
- ✅ Shows 3 nearest hospitals
- ✅ Call and directions buttons work
- ✅ Recommends calling 112

**Practice Points:**
- Type slowly and clearly during demo
- Point out the emergency badge
- Click a hospital's "Call Now" button
- Show the directions link

---

### Scenario 2: Difficulty Breathing (Critical)
**Input:**
```
"I can't breathe properly"
```

**Expected Response:**
- ✅ Emergency detection
- ✅ Immediate hospital recommendations
- ✅ Clear urgency in AI response

**Practice Points:**
- Emphasize speed of detection
- Show how fast hospitals appear

---

### Scenario 3: Severe Bleeding (Critical)
**Input:**
```
"I'm bleeding heavily and can't stop it"
```

**Expected Response:**
- ✅ Emergency alert
- ✅ First aid instructions
- ✅ Hospital list with emergency services

---

## 🌍 Pidgin Language Scenarios

### Scenario 4: Fever in Pidgin (Non-Emergency)
**Input:**
```
"Abeg I get fever and headache since yesterday"
```

**Expected Response:**
- ✅ AI responds in Pidgin
- ✅ Provides home care advice
- ✅ Suggests when to see doctor
- ✅ No emergency badge (green/normal)

**Practice Points:**
- Highlight language detection
- Show cultural sensitivity
- Explain accessibility for non-English speakers

---

### Scenario 5: Stomach Pain in Pidgin
**Input:**
```
"My belle dey pain me well well"
```

**Expected Response:**
- ✅ Understands "belle" = stomach
- ✅ Asks clarifying questions
- ✅ Provides relevant advice

---

## 🏥 Non-Emergency Scenarios

### Scenario 6: Common Cold
**Input:**
```
"I have a runny nose and cough"
```

**Expected Response:**
- ✅ No emergency badge
- ✅ Home remedies suggested
- ✅ When to see a doctor
- ✅ Online doctor suggestions

**Practice Points:**
- Show difference from emergency cases
- Highlight online consultation options

---

### Scenario 7: Headache
**Input:**
```
"I have a headache for 2 days"
```

**Expected Response:**
- ✅ Questions about severity
- ✅ Possible causes
- ✅ Self-care tips
- ✅ Red flags to watch for

---

### Scenario 8: Minor Injury
**Input:**
```
"I cut my finger while cooking"
```

**Expected Response:**
- ✅ First aid instructions
- ✅ When to seek medical care
- ✅ Infection prevention tips

---

## 🎯 Edge Cases to Test

### Scenario 9: Vague Symptoms
**Input:**
```
"I don't feel well"
```

**Expected Response:**
- ✅ AI asks clarifying questions
- ✅ Requests specific symptoms
- ✅ Guides conversation

---

### Scenario 10: Multiple Symptoms
**Input:**
```
"I have fever, cough, body pain, and I'm very tired"
```

**Expected Response:**
- ✅ Analyzes all symptoms together
- ✅ Suggests possible conditions
- ✅ Prioritizes most concerning symptoms

---

### Scenario 11: Child's Symptoms
**Input:**
```
"My 3-year-old has high fever and won't eat"
```

**Expected Response:**
- ✅ Recognizes pediatric case
- ✅ More cautious recommendations
- ✅ Emphasizes seeing a doctor

---

## 📱 Mobile Testing Scenarios

### Test on Different Devices
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)
- [ ] Desktop (Chrome, Firefox, Edge)

### Test Interactions
- [ ] Typing on mobile keyboard
- [ ] Scrolling through messages
- [ ] Clicking hospital call buttons
- [ ] Opening directions in maps
- [ ] Scroll-to-bottom button works

---

## 🔄 Conversation Flow Testing

### Scenario 12: Follow-up Questions
**Input 1:**
```
"I have stomach pain"
```

**AI Response:** (Asks clarifying questions)

**Input 2:**
```
"It's sharp pain on the right side"
```

**Expected:**
- ✅ AI remembers context
- ✅ Provides more specific advice
- ✅ May escalate to emergency if appendicitis suspected

---

### Scenario 13: Language Switching
**Input 1:**
```
"I get headache"
```

**Input 2:**
```
"Abeg wetin I go do?"
```

**Expected:**
- ✅ AI adapts to Pidgin
- ✅ Maintains conversation context

---

## ⚡ Performance Testing

### Speed Tests
- [ ] First message response time < 3 seconds
- [ ] Subsequent messages < 2 seconds
- [ ] Page loads in < 2 seconds
- [ ] Hospital cards render instantly

### Stress Tests
- [ ] Send 10 messages rapidly
- [ ] Open multiple chat sessions
- [ ] Test with slow internet (throttle in DevTools)

---

## 🎬 Demo Day Checklist

### Before Demo (30 mins before)
- [ ] Clear browser cache
- [ ] Test all emergency scenarios
- [ ] Test Pidgin scenarios
- [ ] Verify hospital links work
- [ ] Check mobile view
- [ ] Close unnecessary tabs/apps
- [ ] Charge laptop to 100%
- [ ] Connect to stable WiFi

### During Demo
- [ ] Use Scenario 1 (chest pain) for main demo
- [ ] Use Scenario 4 (Pidgin fever) for language demo
- [ ] Have Scenario 2 ready as backup
- [ ] Keep browser window clean (no other tabs visible)

### After Demo
- [ ] Note any bugs found
- [ ] Write down judge questions
- [ ] Document improvement ideas

---

## 🐛 Known Issues to Avoid

### Don't Demo These (If Broken)
- ❌ Features not yet implemented
- ❌ Slow API responses
- ❌ Broken hospital links
- ❌ UI glitches on specific browsers

### Have Backup Plan For
- 🔄 Internet failure → Use screenshots
- 🔄 API timeout → Explain what should happen
- 🔄 Browser crash → Have second browser ready

---

## 📊 Success Metrics

### What Judges Look For
- ✅ **Speed** - How fast does it respond?
- ✅ **Accuracy** - Does it detect emergencies correctly?
- ✅ **Usability** - Is it easy to use?
- ✅ **Impact** - Does it solve the problem?
- ✅ **Innovation** - What's unique about it?

### Your Talking Points
- "Responds in under 3 seconds"
- "Detects 15+ emergency symptoms"
- "Works in English and Pidgin"
- "Covers 6 major Nigerian hospitals"
- "Zero registration required"

---

## 🎯 Practice Schedule

### Week Before Hackathon
- **Day 1-2:** Test all scenarios, fix bugs
- **Day 3-4:** Practice demo script 5+ times
- **Day 5:** Record yourself, watch, improve
- **Day 6:** Practice with team, get feedback
- **Day 7:** Final run-through, rest well

### Day of Hackathon
- **Morning:** Quick test of all scenarios
- **1 hour before:** Final practice run
- **30 mins before:** Clear cache, close apps
- **15 mins before:** Deep breaths, you got this!

---

## 💡 Pro Tips

1. **Memorize 2-3 scenarios perfectly**
   - Don't try to remember all 13
   - Master the ones you'll actually demo

2. **Type naturally during demo**
   - Don't copy-paste (looks fake)
   - Type at normal speed (shows it's real)

3. **Narrate while AI responds**
   - Don't wait in silence
   - Explain what's happening

4. **Have a backup scenario**
   - If Scenario 1 fails, switch to Scenario 2
   - Stay calm and confident

5. **Practice the transitions**
   - Opening → Demo → Features → Closing
   - Smooth transitions impress judges

---

## 📝 Testing Log Template

Use this to track your practice sessions:

```
Date: ___________
Time: ___________

Scenarios Tested:
[ ] Scenario 1 - Chest Pain
[ ] Scenario 4 - Pidgin Fever
[ ] Scenario 6 - Common Cold

Issues Found:
- 
- 

Improvements Made:
- 
- 

Demo Time: _____ minutes

Notes:
```

---

**Practice makes perfect! Test everything, then test again! 🚀**
