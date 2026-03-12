# 🔴 Sentinel AI — Criminal Face Detection System

**Real-time AI-powered facial recognition security system using Google Gemini Vision.**

Sentinel is a live surveillance application that monitors a camera feed, cross-references detected faces against a criminal database, and triggers instant alerts with alarm sounds when a match is found — all running in the browser with no backend required.

---

## 🎥 Demo

> Engage Sentinel → Point camera → Automatic AI scanning → Instant alert on match

![Sentinel AI Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

---

## ✨ Features

- **Live Camera Surveillance** — Real-time webcam feed with AI scanning at 2 requests/minute
- **Gemini Vision AI** — Google Gemini multimodal model performs facial recognition on every captured frame
- **Criminal Database** — Add, view, and manage suspect profiles with photos and descriptions
- **Instant Alert System** — Visual alert banner + audio alarm triggers automatically on criminal match
- **Confidence Scoring** — Only triggers alerts when match confidence ≥ 50%
- **Detection History Log** — Scrollable log of last 50 scan results with timestamps and screenshots
- **Quota Protection** — Automatic 90-second cooldown on API rate limit with live countdown UI
- **One-click Control** — Single button to engage or stop surveillance mode

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| AI / Vision | Google Gemini API (`@google/genai`) |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite 6 |
| Camera | WebRTC / `getUserMedia` API |
| Audio | Web Audio API |

---

## 📁 Project Structure

```
sentinel-ai/
│
├── index.html              # App shell with Tailwind CDN
├── index.tsx               # React DOM entry point
├── App.tsx                 # Main app — state, monitoring loop, alert logic
├── types.ts                # TypeScript interfaces (Criminal, DetectionResult)
├── constants.tsx           # Initial data, alarm URL, UI icons
├── vite.config.ts          # Vite config with Gemini API key injection
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
├── .env.local              # API key (not committed to git)
│
└── components/
    ├── Layout.tsx           # App shell layout
    ├── CameraFeed.tsx       # Webcam stream + frame capture
    ├── CriminalGallery.tsx  # Suspect database UI + add form
    ├── AlertBanner.tsx      # Full-screen alert overlay
    └── HistoryLog.tsx       # Detection log list
│
└── services/
    └── geminiService.ts     # Gemini API calls + facial recognition logic
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sentinel-ai.git
cd sentinel-ai

# Install dependencies
npm install

# Add your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎮 How to Use

1. **Add Suspects** — Use the Criminal Gallery panel to add suspect profiles with a photo URL, name, and description
2. **Engage Sentinel** — Click the **ENGAGE SENTINEL** button to start live monitoring
3. **AI Scanning** — The system captures frames every 30 seconds and sends them to Gemini for analysis
4. **Alert** — If a criminal is detected with ≥50% confidence, an alert banner appears and the alarm sounds
5. **Dismiss** — Click dismiss to stop the alarm and reset monitoring
6. **Review Logs** — Check the History Log panel for a full timeline of all scan results

---

## 🤖 How the AI Works

### Frame Capture
The `CameraFeed` component captures a frame from the webcam stream as a base64-encoded image every ~30 seconds while monitoring is active.

### Gemini Vision Analysis
Each frame is sent to the **Google Gemini multimodal model** via the `geminiService` along with the current criminal database. Gemini analyzes the image and returns:
- Whether a criminal face is detected
- The confidence percentage (0–100%)
- Which suspect was matched (if any)
- An `errorType` field for quota/rate limit handling

### Alert Logic
```
Confidence ≥ 50% AND isCriminal = true → Trigger Alert + Play Alarm
```

### Rate Limit Protection
The app implements smart quota management:
- Max **2 API requests per minute** enforced in UI
- On `QUOTA_EXHAUSTED` error → **90-second cooldown** activates
- Live progress bar counts down with cooldown timer
- System auto-resumes after cooldown completes

---

## ⚙️ Configuration

| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | `.env.local` | Your Google Gemini API key |
| `ALARM_SOUND_URL` | `constants.tsx` | URL to the alarm audio file |
| `INITIAL_CRIMINALS` | `constants.tsx` | Default suspects loaded on startup |
| Confidence Threshold | `App.tsx` line ~45 | Change `>= 50` to adjust sensitivity |
| Cooldown Duration | `App.tsx` line ~36 | Change `90` to adjust API cooldown |

---

## 🔒 Privacy & Security

- All video processing happens **locally in the browser**
- Camera frames are sent to Google Gemini API for analysis only — no data is stored
- No backend server required — purely client-side
- API key is injected at build time via Vite environment variables
- `.env.local` is excluded from version control via `.gitignore`

---

## 🌐 Browser Compatibility

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Firefox 90+ | ✅ Full |
| Safari 15+ | ⚠️ Camera permissions may vary |

---

## 🛣️ Roadmap

- [ ] Upload local photos for criminal database instead of URL
- [ ] Export detection history as PDF report
- [ ] Multiple camera support
- [ ] WebSocket-based multi-user monitoring dashboard
- [ ] Persistent criminal database with local storage
- [ ] Mobile / tablet responsive layout

---

## ⚠️ Disclaimer

This project is built for **educational and demonstration purposes only**. Facial recognition technology must be used responsibly and in compliance with applicable privacy laws and regulations in your region.

---

## 🙏 Acknowledgements

- [Google Gemini](https://deepmind.google/technologies/gemini/) — Multimodal AI vision
- [React](https://react.dev) — UI framework
- [Vite](https://vitejs.dev) — Frontend build tool
- [Tailwind CSS](https://tailwindcss.com) — Styling

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

> Built with ❤️ using AI-powered development tools | View on [Google AI Studio](https://ai.studio/apps/drive/1P4N7u-ex8EFAg0bqBPpQPtgUd0WPRp_Y)
