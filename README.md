# 🏷️ Auction Assist – Frontend

Auction Assist is a web-based platform that streamlines the auction experience for users by enabling real-time bidding, live auction monitoring, and call tracking using modern frontend technologies.

This is the **frontend** of the Auction Assist app, built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **ShadCN UI**.

---

## 🚀 Live Demo

🌐 [Visit Auction Assist](https://auction-assistant.vercel.app/)

---

## 📸 Preview

_Add a preview image in `public/preview.png` to show off the UI here._

---

## 🛠️ Tech Stack

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧱 ShadCN UI
- 🔁 Fetch for API requests
- 🔧 Hosted on Vercel

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Main route components
├── backend-api/      # API service and config files
├── hooks/            # Custom React hooks
├── utils/            # Helper functions and constants
├── assets/           # Images and static assets
└── App.tsx           # App entry
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/auction-assist-frontend.git
cd auction-assist-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the root with the following:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Update the URL based on your backend deployment.

---

## 🧠 Features

- 🔄 Real-time bid updates and live auction status
- ⏰ Auction timer with automatic status update (Upcoming, Active, Completed)
- 📞 Call log tracking with backend logging
- 🖼️ Modern UI with responsive design using Tailwind and ShadCN
- 💬 AI-powered web chatbot integration

---

## 📦 Deployment

This app is ready for Vercel:

```bash
npm run build
```

Deploy the `dist/` folder or connect the repo to [Vercel](https://vercel.com) for auto-deployment.

---

## 🤖 Web Bot Integration

To enable the AI chatbot widget, add the following before `</body>` in `index.html`:

```html
<script id="omnidimension-web-widget" async src="https://backend.omnidim.io/web_widget.js?secret_key=de45cca90eeaa16dbd86aacc16ea1537"></script>
```

---

## 🧩 Related Projects

- 🔧 [Auction Assist Backend](https://github.com/AchyutTiwari21/Auction-API) – Express + Prisma + PostgreSQL

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

---


Made with ❤️ for Hackathons & Real-world Auctioning 🚀
