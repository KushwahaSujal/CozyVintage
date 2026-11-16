# Cozy Vintage 🌿
> **Build your life. One day at a time.**  
> *(Offline-first) • (Gamified) • (Cozy fantasy) • (AI-powered PWA)*

---

## 🌟 Vision & Key Highlights
**Cozy Vintage** is a Progressive Web Application (PWA) designed to turn daily discipline and personal growth into a serene, engaging, and cozy sanctuary.

- 🌿 **Warm Vintage Aesthetics:** Muted Parchment (`#E7DDCA`), Sage Green (`#78927A`), Antique Gold (`#B68B58`), and Forest Dark mode.
- 🦊 **Emotion-Reactive Mascot:** Responsive companion with custom expressions for hydration, focus, celebrations, streaks, and nighttime.
- 💧 **Hydration Garden:** 10 glasses × 300 ml (3,000 ml daily target) with interactive filling animations, water splash particles, and synthesized ripple audio.
- 📖 **4-Hour Study Room:** Structured into Mathematics, English, Logical Reasoning, and GK/GS (1 hr each). Features live interactive focus stopwatch, manual adjustments, and glowing brass desk bulb illumination upon completion.
- ✨ **Custom Daily Habits:** Prayer, Gym, Family time, Book reading, Phone discipline, and controlled recreation.
- 🪙 **Effort-Based XP & Claim Mechanism:** Earn XP into pending balance, manually claim with audio chimes & confetti, and progress from Bronze to Grandmaster.
- 🍗 **Real-Life Reward Vault:** Celebrate consistency streaks with guilt-free food & personal treats (₹10 KitKat, Puchka, Chicken Biryani, Papdi Chaat, Ghugni, or custom treats).
- 📊 **Growth & 120-Day Transformation Report:** Interactive performance pie chart, study duration breakdown, habit consistency matrix, and printable 120-day personal growth report.
- 🤖 **AI Study Mentor & Visual Search:** Dual provider support (Google Gemini & OpenAI BYOK) plus built-in offline mentor with Fast, Balanced, and Deep Thinking modes. High-resolution educational diagrams and scientific image discovery.
- 📜 **Daily Wisdom & Audio Player:** Quotes across 5 daily slots (Morning, 12PM Gita philosophy, 3PM Anime wisdom, Evening mythology, and Night peace) with built-in text-to-speech audio reader.
- 🔒 **Privacy & Offline First:** Dexie.js (IndexedDB) local database, optional WebAuthn platform biometric lock, JSON backup export/import.

---

## 📱 Only Five Primary Sections
1. **Home:** Today's greeting, reactive mascot, progress ring, hydration garden, study room, daily habits, quote player, and XP claim.
2. **My Journey:** 30/60/120-day challenge overview, calendar matrix, rank ladder (Bronze to Grandmaster), and real-life reward vault.
3. **Growth:** Daily performance pie chart (completed, partial, missed), study analytics, habit trends, and official 120-day report.
4. **AI Companion:** Structured step-by-step chat mentor, fast/balanced/deep thinking, and natural language diagram & image discovery.
5. **Profile:** Personal profile sigils, warm/dark forest theme toggle, synthesized audio & vibration toggles, device lock, and JSON backup export/import.

---

## 🚀 Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build production PWA bundle
npm run build
```

---

## 🌐 Deploying to Vercel (Step-by-Step)
You can deploy Cozy Vintage to **Vercel** completely free:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Cozy Vintage PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. **Go to Vercel (vercel.com)**:
   - Click **"Add New..."** -> **"Project"**.
   - Select your GitHub repository.
   - Framework Preset will automatically detect **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**!
3. Your PWA is live with automatic HTTPS and service worker offline caching!

---

## 📲 Installing as a PWA on Your Phone
- **On Android (Google Chrome)**:
  1. Open your Vercel URL in Chrome.
  2. Tap the `⋮` three-dot menu in the upper right.
  3. Tap **"Add to Home screen"** or **"Install App"**.
  4. Cozy Vintage will appear on your phone screen with its custom vintage companion icon and launch in full-screen standalone mode.
- **On iOS (Safari)**:
  1. Open the URL in Safari.
  2. Tap the **Share** button (box with upward arrow).
  3. Scroll down and tap **"Add to Home Screen"**.
