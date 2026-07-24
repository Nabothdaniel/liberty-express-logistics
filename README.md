# 🗽 Liberty Express Logistics

![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.5-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-11.6.1-FFCA28?style=for-the-badge&logo=firebase)
![Zustand](https://img.shields.io/badge/Zustand-5.0.0-orange?style=for-the-badge)

Liberty Express Logistics is a modern, full-featured **Logistics Tracking and Administration Portal**. Built with Next.js and Firebase, it provides a seamless experience for customers to track their shipments and for administrators to manage logistics operations, couriers, and real-time updates.

---

## 🚀 Features

### Customer Features
- **🛰️ Live Shipment Tracking** — Customers can track their packages in real-time using a tracking ID.
- **🗺️ Interactive Maps & Weather** — OpenStreetMap / Leaflet integration with live mapping and weather updates for delivery routes.
- **📱 Responsive UI** — Beautiful and smooth responsive interface across all devices via Tailwind CSS and Framer Motion.

### Administrator Features
- **🛡️ Secure Admin Portal** — Behind a secure login system for administrators.
- **📊 Analytics Dashboard** — Visualize cargo data, shipment statuses, and logistics metrics using interactive charts.
- **👨‍✈️ Courier & Status Management** — Manage shipping statuses, assign couriers, and interact with the status pipeline.
- **💬 Admin Chat Support** — Integrated chat functionalities for administrative operations.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15.2.0](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend & Database:** [Firebase](https://firebase.google.com/)
- **Maps:** [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Form Validation:** [Zod](https://zod.dev/)

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Firebase project setup

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
   *(Update these with your actual Firebase project settings)*

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build and Deployment

To run code quality checks (linting):
```bash
npm run lint
```

To build the application for production:
```bash
npm run build
```

To start the production server:
```bash
npm run start
```