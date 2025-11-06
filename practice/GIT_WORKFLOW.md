# Git Workflow for Practice Mode 🔀

This guide shows you how to safely practice your demo without affecting the main codebase.

---

## 🎯 Quick Start

```bash
# Navigate to project
cd healthai-nigeria

# Create practice branch
git checkout -b practice-demo

# Start practicing!
npm run dev
```

---

## 📚 Complete Workflow

### 1. Create Practice Branch

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes (if working with team)
git pull origin main

# Create and switch to practice branch
git checkout -b practice-demo
```

**What this does:**
- Creates a new branch called `practice-demo`
- Switches to that branch automatically
- All changes now happen on this branch, not main

---

### 2. Make Changes & Experiment

```bash
# Start development server
npm run dev

# Open browser: http://localhost:3000
# Make changes, test features, practice demo
```

**Safe to do:**
- ✅ Edit any files
- ✅ Test different scenarios
- ✅ Break things (it's practice!)
- ✅ Add console.logs for debugging
- ✅ Change colors, text, anything

**Your main branch is safe!**

---

### 3. Save Your Practice Changes (Optional)

```bash
# See what you changed
git status

# Save changes to practice branch
git add .
git commit -m "Practice: testing demo scenarios"
```

**Note:** You don't have to commit practice changes. They're just for testing.

---

### 4. Switch Back to Main

```bash
# Go back to main branch
git checkout main

# Your practice changes are gone (safely stored in practice-demo branch)
```

---

### 5. Return to Practice Branch

```bash
# Switch back to practice branch
git checkout practice-demo

# All your practice changes are back!
```

---

### 6. Delete Practice Branch (When Done)

```bash
# Make sure you're on main
git checkout main

# Delete practice branch
git branch -D practice-demo
```

**Warning:** This permanently deletes the practice branch. Only do this when you're done practicing.

---

## 🎬 Demo Day Workflow

### Before Demo (1 hour before)

```bash
# Make sure main branch is clean
git checkout main
git status  # Should say "nothing to commit, working tree clean"

# Pull latest changes
git pull origin main

# Start server
npm run dev

# Test in browser
# Open http://localhost:3000
```

---

### During Demo

**DON'T:**
- ❌ Make any code changes
- ❌ Switch branches
- ❌ Commit anything
- ❌ Push to GitHub

**DO:**
- ✅ Just run the app
- ✅ Follow your demo script
- ✅ Show the features
- ✅ Answer questions confidently

---

### After Demo

```bash
# If you made any improvements during practice
git checkout -b post-demo-improvements

# Make improvements
# Test them

# Commit and push
git add .
git commit -m "Post-demo improvements"
git push origin post-demo-improvements

# Create pull request on GitHub to merge into main
```

---

## 🔧 Useful Git Commands

### Check Current Branch
```bash
git branch
# * indicates current branch
```

### See All Branches
```bash
git branch -a
```

### Discard All Changes (Nuclear Option)
```bash
# WARNING: This deletes ALL uncommitted changes
git reset --hard HEAD
git clean -fd
```

### Create Branch from Specific Commit
```bash
# If you want to practice from an earlier version
git checkout -b practice-old-version <commit-hash>
```

### Stash Changes (Save for Later)
```bash
# Save changes without committing
git stash

# Get them back later
git stash pop
```

---

## 🚨 Emergency Fixes

### "I Broke Everything!"
```bash
# Go back to main (safe version)
git checkout main

# Delete broken practice branch
git branch -D practice-demo

# Start fresh
git checkout -b practice-demo
```

---

### "I Accidentally Committed to Main!"
```bash
# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Create practice branch
git checkout -b practice-demo

# Commit there instead
git add .
git commit -m "Practice changes"
```

---

### "I Can't Switch Branches!"
```bash
# You have uncommitted changes
# Option 1: Commit them
git add .
git commit -m "WIP: practice changes"

# Option 2: Stash them
git stash

# Option 3: Discard them
git reset --hard HEAD
```

---

## 📋 Practice Checklist

### Before Each Practice Session
- [ ] `git checkout main` - Start from clean slate
- [ ] `git pull origin main` - Get latest changes
- [ ] `git checkout -b practice-demo` - Create practice branch
- [ ] `npm run dev` - Start server
- [ ] Open browser to http://localhost:3000

### After Each Practice Session
- [ ] `git checkout main` - Return to main
- [ ] `git branch -D practice-demo` - Delete practice branch (optional)
- [ ] Close terminal/server

### Demo Day
- [ ] `git checkout main` - Use main branch
- [ ] `git status` - Verify clean state
- [ ] `npm run dev` - Start server
- [ ] Test all demo scenarios
- [ ] Close unnecessary apps
- [ ] Charge laptop fully

---

## 💡 Pro Tips

1. **Name branches descriptively**
   ```bash
   git checkout -b practice-emergency-demo
   git checkout -b practice-pidgin-test
   git checkout -b practice-mobile-view
   ```

2. **Keep main branch clean**
   - Never commit directly to main during practice
   - Always use practice branches

3. **Practice the full flow**
   - Start from `git checkout main`
   - Create branch
   - Make changes
   - Test
   - Delete branch
   - Repeat

4. **Use multiple practice branches**
   ```bash
   git checkout -b practice-scenario-1
   # Test emergency detection
   
   git checkout main
   git checkout -b practice-scenario-2
   # Test Pidgin support
   ```

5. **Backup before demo**
   ```bash
   # Create backup branch
   git checkout -b demo-day-backup
   git checkout main
   ```

---

## 🎯 Quick Reference

| Command | What It Does |
|---------|-------------|
| `git checkout main` | Switch to main branch |
| `git checkout -b practice-demo` | Create and switch to practice branch |
| `git branch` | Show all branches |
| `git branch -D practice-demo` | Delete practice branch |
| `git status` | Check current state |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Save changes |
| `git stash` | Temporarily save changes |
| `git reset --hard HEAD` | Discard all changes |

---

**Remember: Practice branches are safe spaces. Experiment freely! 🚀**
