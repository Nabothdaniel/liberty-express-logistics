import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "../auth/useAuth";

export const metadata = {
  title: "Liberty Express Logistics | Flight Booking & Live Tracking",
  description: "Seamless flight booking and real-time live flight tracking solutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" autoClose={4000} />
        </AuthProvider>
      </body>
    </html>
  );
}
