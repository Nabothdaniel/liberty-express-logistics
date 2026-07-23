"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Bell, MapPin, Package, Save, X, Plane, ChevronDown, Plus, Edit3, CheckCircle, Clock, ShieldCheck } from "lucide-react";
import { db } from "../../firebase/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../auth/useAuth";
import { StatusManager } from "../../utils/status-manager";
import { toast } from "react-toastify";
import CreateShipmentModal from "../../components/dashboardpage/CreateShipmentModal";
import StatsCards from "../../components/dashboardpage/StatsCard";
import AnalyticsSection from "../../components/dashboardpage/Analytics";
import Shipments from "../../components/dashboardpage/shipments-section";
import Image from "next/image";
import logoImg from "../../assets/images/logo.png";

const statusColors = {
  booked: "bg-blue-100 text-blue-800 border-blue-200",
  check_in: "bg-indigo-100 text-indigo-800 border-indigo-200",
  boarding: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_flight: "bg-orange-100 text-orange-800 border-orange-200",
  landed: "bg-teal-100 text-teal-800 border-teal-200",
  arrived: "bg-green-100 text-green-800 border-green-200",
  delayed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const dotColors = {
  booked: "bg-blue-500",
  check_in: "bg-indigo-500",
  boarding: "bg-yellow-500",
  in_flight: "bg-orange-500",
  landed: "bg-teal-500",
  arrived: "bg-green-500",
  delayed: "bg-red-500",
  cancelled: "bg-gray-400",
};

const classLabels = {
  economy: "Economy",
  business: "Business",
  first_class: "First Class",
};

// ── Admin Edit Modal Panel ──────────────────────────────────────────────────
function EditPanel({ flight, onClose, onSave, user }) {
  const [formData, setFormData] = useState({
    status: flight.status || "booked",
    note: "",
    fromLocation: flight.fromLocation || "",
    toLocation: flight.toLocation || "",
    currentLocation: flight.currentLocation || "",
    flightDate: flight.flightDate || "",
    arrivalDate: flight.arrivalDate || "",
    flightType: flight.flightType || "economy"
  });
  const [loading, setLoading] = useState(false);

  const allStatuses = StatusManager.getAllStatuses();

  const handleSave = async () => {
    setLoading(true);
    try {
      const flightRef = doc(db, "flights", flight.id);
      
      const updateData = {
        status: formData.status,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        currentLocation: formData.currentLocation,
        flightDate: formData.flightDate,
        arrivalDate: formData.arrivalDate,
        flightType: formData.flightType,
        updatedAt: Timestamp.now(),
      };
      
      if (formData.status !== flight.status || formData.note) {
        updateData.statusHistory = arrayUnion({
          status: formData.status,
          timestamp: new Date().toISOString(),
          updatedBy: user?.email || "Admin Portal",
          note: formData.note.trim() || null,
        });
      }

      await updateDoc(flightRef, updateData);
      toast.success(`Flight ${flight.trackingCode} updated successfully!`);
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Failed to update flight:", err);
      toast.error("Failed to update flight details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto pt-20 pb-20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-gray-100 overflow-hidden my-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-lg">Edit Flight Details</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Flight Summary */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm flex justify-between items-center">
            <span className="font-mono font-bold text-base text-gray-900">{flight.trackingCode}</span>
            <span className="font-medium text-gray-700">{flight.firstName} {flight.lastName}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">From Location</label>
              <input type="text" value={formData.fromLocation} onChange={e => setFormData({...formData, fromLocation: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">To Location</label>
              <input type="text" value={formData.toLocation} onChange={e => setFormData({...formData, toLocation: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                Current Stop / Live Location 
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">New</span>
              </label>
              <input type="text" placeholder="e.g., Paris, CDG Airport" value={formData.currentLocation} onChange={e => setFormData({...formData, currentLocation: e.target.value})} className="w-full px-3 py-2 border border-blue-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 bg-blue-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Flight Date</label>
              <input type="date" value={formData.flightDate} onChange={e => setFormData({...formData, flightDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Arrival Date</label>
              <input type="date" value={formData.arrivalDate} onChange={e => setFormData({...formData, arrivalDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-900" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Flight Type</label>
              <select value={formData.flightType} onChange={e => setFormData({...formData, flightType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 bg-white">
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first_class">First Class</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Select New Flight Status</label>
            <div className="grid grid-cols-2 gap-2">
              {allStatuses.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setFormData({...formData, status: s.key})}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                    formData.status === s.key ? "border-gray-900 bg-gray-900 text-white shadow-sm" : "border-gray-200 hover:border-gray-400 text-gray-700 bg-white"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${formData.status === s.key ? "bg-white" : dotColors[s.key]}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Admin Update Note (Optional)</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              placeholder="e.g. Flight departed gate. Estimated arrival on schedule."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-5 py-2 text-sm font-bold bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 shadow-md">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Special Admin Portal Page ─────────────────────────────────────────────
export default function SpecialAdminPortal() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setAuthLoading(false);
    }
  };

  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [editingFlight, setEditingFlight] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "flights"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFlights(data);
      if (data.length > 0 && !selectedFlight) setSelectedFlight(data[0]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (selectedFlight) {
      const updated = flights.find((f) => f.id === selectedFlight.id);
      if (updated) setSelectedFlight(updated);
    }
  }, [flights]);

  const filtered = flights.filter((f) => {
    const matchesSearch =
      !searchQuery ||
      `${f.firstName} ${f.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.trackingCode || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.fromLocation || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.toLocation || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allStatuses = StatusManager.getAllStatuses();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
              <Image src={logoImg} alt="Liberty Express Logo" fill style={{objectFit:"contain"}} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Portal Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500" />
            </div>
            <button type="submit" disabled={authLoading} className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors mt-2">
              {authLoading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white border-b border-gray-800 px-4 lg:px-8 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 bg-white p-1 rounded-xl shadow-md flex items-center justify-center">
                <Image src={logoImg} alt="Liberty Express Logo" fill style={{objectFit:"contain"}} />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight">Special Admin Portal</span>
                <span className="block text-[10px] text-orange-400 uppercase tracking-widest font-semibold">
                  Flight Logistics Management
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("live")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "live" ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Live Tracking & Edit
              </button>
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "overview" ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Dashboard Overview & Stats
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Book Flight for Individual
            </button>
            <Link
              href="/track"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white rounded-xl border border-gray-700 transition-colors"
            >
              <Plane className="w-3.5 h-3.5" /> Public Tracker
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-900/50 text-red-300 hover:text-white rounded-xl border border-red-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      {activeTab === "overview" ? (
        <div className="p-6 max-w-7xl mx-auto space-y-8 w-full flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Flight Operations</h1>
              <p className="text-sm text-gray-500">Overview of all booked flights, status analytics, and records.</p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-5 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800"
            >
              + Create Flight Booking
            </button>
          </div>

          <StatsCards />
          <AnalyticsSection />
          <Shipments />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left Sidebar — Flight List */}
          <div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-600" />
                  All Flight Bookings ({filtered.length})
                </h2>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search passenger, code, city…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white appearance-none"
                >
                  <option value="all">All Flight Statuses</option>
                  {allStatuses.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Flight Card Items */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                  Loading flight records…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Plane className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">No flight bookings found</p>
                </div>
              ) : (
                filtered.map((flight) => {
                  const statusConfig = StatusManager.getStatus(flight.status);
                  const colorClass = statusColors[flight.status] || "bg-gray-100 text-gray-700";
                  const dotClass = dotColors[flight.status] || "bg-gray-400";
                  const isSelected = selectedFlight?.id === flight.id;

                  return (
                    <div
                      key={flight.id}
                      onClick={() => setSelectedFlight(flight)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                        isSelected ? "bg-orange-50/70 border-l-4 border-l-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
                          <span className="font-mono text-xs font-bold text-gray-900">
                            {flight.trackingCode || flight.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-semibold ${colorClass}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {flight.firstName} {flight.lastName}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                        <Plane className="w-3 h-3 text-gray-400" />
                        {flight.fromLocation} → {flight.toLocation}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                        <span>{flight.flightDate}</span>
                        <span className="capitalize">{classLabels[flight.flightType] || flight.flightType}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right — Admin Flight Detail & Live Edit Action Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {!selectedFlight ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-24">
                <Plane className="w-12 h-12 mb-3" />
                <p className="text-sm">Select a flight from the left list to view or edit</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Admin Header & Edit Action Trigger */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl font-mono font-extrabold text-gray-900">
                        {selectedFlight.trackingCode}
                      </span>
                      <span
                        className={`px-3.5 py-1 text-xs rounded-full border font-bold ${
                          statusColors[selectedFlight.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {StatusManager.getStatus(selectedFlight.status).label}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Passenger: <span className="font-bold text-gray-900">{selectedFlight.firstName} {selectedFlight.lastName}</span> ({selectedFlight.email})
                    </p>
                  </div>

                  <button
                    onClick={() => setEditingFlight(selectedFlight)}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-orange-400" /> Edit Tracking Status Live
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="font-bold text-gray-700">Flight Status Progress</span>
                    <span className="font-black text-gray-900">{StatusManager.getStatus(selectedFlight.status).progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${StatusManager.getStatus(selectedFlight.status).progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    {["booked", "check_in", "boarding", "in_flight", "arrived"].map((step) => {
                      const s = StatusManager.getStatus(step);
                      const currentProgress = StatusManager.getStatus(selectedFlight.status).progress;
                      const isReached = currentProgress >= s.progress;
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-3.5 h-3.5 rounded-full mb-1 ${
                              isReached ? "bg-orange-500 ring-2 ring-orange-200" : "bg-gray-300"
                            }`}
                          />
                          <span className={`text-xs ${isReached ? "text-gray-900 font-bold" : "text-gray-400"}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* All 10 Required Fields Detailed Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Traveller Info */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="w-5 h-5 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs">1</span>
                      Passenger & Traveller Details
                    </h3>
                    <Row label="1. First Name" value={selectedFlight.firstName} />
                    <Row label="2. Last Name" value={selectedFlight.lastName} />
                    <Row label="3. Date of Birth" value={selectedFlight.dateOfBirth} />
                    <Row label="10. Sex" value={selectedFlight.sex ? selectedFlight.sex.toUpperCase() : "—"} />
                    <Row label="7. Email of Traveller" value={selectedFlight.email} />
                  </div>

                  {/* Flight Info */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <span className="w-5 h-5 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs">2</span>
                      Flight & Booking Specifications
                    </h3>
                    <Row label="4. Flight Destination" value={`${selectedFlight.fromLocation || "—"} ✈ ${selectedFlight.toLocation || "—"}`} />
                    <Row label="5. Date of Flight" value={selectedFlight.flightDate} />
                    <Row label="6. Arrival Date" value={selectedFlight.arrivalDate} />
                    <Row label="8. Flight Type (Class)" value={classLabels[selectedFlight.flightType] || selectedFlight.flightType} />
                    <Row label="9. Price Range Needed" value={selectedFlight.priceRange} />
                  </div>
                </div>

                {/* Live Tracking History & Audit Log */}
                {selectedFlight.statusHistory && selectedFlight.statusHistory.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                      Status Audit Trail & Tracking Updates
                    </h3>
                    <div className="space-y-4">
                      {[...selectedFlight.statusHistory].reverse().map((entry, i) => {
                        const s = StatusManager.getStatus(entry.status);
                        const dotClass = dotColors[entry.status] || "bg-gray-400";
                        return (
                          <div key={i} className="flex items-start gap-3 border-l-2 border-gray-100 pl-4 py-1">
                            <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 -ml-[23px] ${dotClass}`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900">{s.label}</span>
                                <span className="text-xs text-gray-400">
                                  {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"}
                                </span>
                              </div>
                              {entry.note && (
                                <p className="text-xs text-gray-700 mt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200 font-medium">
                                  Note: {entry.note}
                                </p>
                              )}
                              <p className="text-[11px] text-gray-400 mt-0.5">Updated by: {entry.updatedBy}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal (Admin can book flights for individuals) */}
      {showBookingModal && (
        <CreateShipmentModal onClose={() => setShowBookingModal(false)} />
      )}

      {/* Status Editing Modal */}
      {editingFlight && (
        <EditPanel
          flight={editingFlight}
          user={user}
          onClose={() => setEditingFlight(null)}
          onSave={() => setEditingFlight(null)}
        />
      )}
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-50 pb-2">
    <span className="text-gray-500 text-xs font-semibold shrink-0">{label}</span>
    <span className="text-gray-900 font-bold text-xs text-right">{value || "—"}</span>
  </div>
);
