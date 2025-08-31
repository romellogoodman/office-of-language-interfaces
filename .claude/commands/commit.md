---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*)
argument-hint: [optional custom message]
description: Commit all changes with Gitmoji format
---

## Context

- Current git status: !`git status --porcelain`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits for context: !`git log --oneline -5`

## Your task

Based on the above git changes, create a single commit with a Gitmoji-style commit message.

**Gitmoji Guidelines:**
- ✨ `:sparkles:` - New features
- 🐛 `:bug:` - Bug fixes
- 📚 `:books:` - Documentation
- 🎨 `:art:` - Improving code structure/format
- ⚡ `:zap:` - Performance improvements
- 🔒 `:lock:` - Security fixes
- 🔧 `:wrench:` - Configuration changes
- ✅ `:white_check_mark:` - Tests
- 🚀 `:rocket:` - Deployment
- 💄 `:lipstick:` - UI/styling
- 🔥 `:fire:` - Removing code/files
- ♻️ `:recycle:` - Refactoring
- 📦 `:package:` - Dependencies
- 🏗️ `:building_construction:` - Architectural changes

**Instructions:**
1. Stage all changes with `git add .`
2. Analyze the changes and choose the most appropriate Gitmoji
3. Create a commit message in format: `emoji description`
4. If custom message provided as $ARGUMENTS, incorporate it: `emoji $ARGUMENTS`
5. Commit the changes

Example formats:
- `✨ add user authentication system`
- `🐛 fix memory leak in data processing`
- `📚 update API documentation`