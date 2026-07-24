"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Bell, MapPin, Package, Save, X, Plane, ChevronDown, Plus, Edit3, CheckCircle, Clock, ShieldCheck, Copy, LogOut, Menu } from "lucide-react";
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
      
      const updateData: Record<string, any> = {
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

  const [flights, setFlights] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [editingFlight, setEditingFlight] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  const handleCancelBooking = async () => {
    if (!selectedFlight || selectedFlight.status === "cancelled") return;
    
    if (confirmCancelId !== selectedFlight.id) {
      setConfirmCancelId(selectedFlight.id);
      return;
    }
    
    setIsCancelling(true);
    try {
      const flightRef = doc(db, "flights", selectedFlight.id);
      await updateDoc(flightRef, {
        status: "cancelled",
        updatedAt: Timestamp.now(),
        statusHistory: arrayUnion({
          status: "cancelled",
          timestamp: new Date().toISOString(),
          updatedBy: user?.email || "Admin Portal",
          note: "Booking cancelled by administrator."
        })
      });
      toast.success("Booking cancelled successfully.");
      setConfirmCancelId(null);
    } catch (error) {
      console.error("Error cancelling flight:", error);
      toast.error("Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    setConfirmCancelId(null);
  }, [selectedFlight?.id]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "flights"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFlights(data);
      if (data.length > 0 && !selectedFlight) setSelectedFlight(data[0]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (selectedFlight) {
      const updated = flights.find((f: any) => f.id === selectedFlight.id);
      if (updated) setSelectedFlight(updated);
    }
  }, [flights]);

  const filtered = flights.filter((f: any) => {
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 shrink-0">
            <div className="relative w-8 h-8 bg-white p-1 rounded-lg shadow-sm flex items-center justify-center">
              <Image src={logoImg} alt="Liberty Express Logo" fill style={{objectFit:"contain"}} />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">Liberty Express</span>
            </div>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 space-y-1 overflow-y-auto">
          <button
            onClick={() => { setActiveTab("overview"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "overview" ? "bg-[#8A5A44] text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Dashboard
          </button>
          
          <button
            onClick={() => { setActiveTab("live"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "live" ? "bg-[#8A5A44] text-white shadow-md" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <MapPin className="w-5 h-5" />
            Live Tracking
          </button>

          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</p>
          </div>

          <button
            onClick={() => { setShowBookingModal(true); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Booking
          </button>
          
          <Link
            href="/track"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <Plane className="w-5 h-5" />
            Public Tracker
          </Link>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8A5A44] text-white flex items-center justify-center font-bold text-sm uppercase shadow-inner flex-shrink-0">
                {user?.email?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{user?.displayName || "Admin User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-700 text-sm font-bold rounded-xl transition-all shadow-sm group"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-1.5 -ml-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Image src={logoImg} alt="Logo" width={24} height={24} />
              <span className="font-bold text-gray-900">Admin</span>
            </div>
          </div>
          {/* Active Tab Indicator for Mobile context */}
          <div className="flex items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
              {activeTab === "overview" ? "Dashboard" : "Live Info"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
      {activeTab === "overview" ? (
        <div className="p-6 max-w-7xl mx-auto space-y-8 w-full flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hello, Admin</h1>
              <p className="text-sm text-gray-500 font-medium mt-2">Overview of all booked flights and logistics</p>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              className="hidden sm:flex px-5 py-2.5 bg-[#8A5A44] text-white font-bold text-sm rounded-xl hover:bg-[#7a4e3b] transition-colors"
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
                          <div className="flex items-center gap-1 group">
                            <span className="font-mono text-xs font-bold text-gray-900">
                              {flight.trackingCode || flight.id.slice(0, 8).toUpperCase()}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(flight.trackingCode || flight.id.slice(0, 8).toUpperCase());
                                toast.success("Tracking ID copied!");
                              }}
                              className="text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
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
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white">
            {!selectedFlight ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-24">
                <Plane className="w-12 h-12 mb-3 text-gray-200" />
                <p className="text-sm font-medium">Select a booking from the list to view details</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Header matching booking.png */}
                <div className="mb-6 border-b border-gray-100 pb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {selectedFlight.firstName} {selectedFlight.lastName} <span className="text-gray-300 font-light text-xl">|</span> <span className="text-gray-500 font-medium">Flight Booking</span>
                      </h2>
                      <div className="text-sm font-semibold text-gray-400 flex items-center gap-1.5">
                        Booking ID: <span className="text-blue-500 font-mono tracking-wide">{selectedFlight.trackingCode}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedFlight.trackingCode);
                            toast.success("Tracking ID copied!");
                          }}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Left Column (Information) */}
                  <div className="flex-1 space-y-6">
                    {/* Client Information */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-200 font-bold text-gray-900">
                        Passenger Information
                      </div>
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Full Name</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.firstName} {selectedFlight.lastName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Email</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Date of Birth</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Sex</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.sex ? selectedFlight.sex.toUpperCase() : "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-200 font-bold text-gray-900">
                        Flight Details
                      </div>
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Departure Date</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.flightDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Arrival Date</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.arrivalDate}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Route Location</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.fromLocation || "—"} → {selectedFlight.toLocation || "—"}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Service Details */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-200 font-bold text-gray-900">
                        Service Details
                      </div>
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Flight Class</p>
                          <p className="text-sm font-bold text-gray-900">{classLabels[selectedFlight.flightType] || selectedFlight.flightType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Price Range</p>
                          <p className="text-sm font-bold text-gray-900">{selectedFlight.priceRange}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Tracking Updates */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-200 font-bold text-gray-900">
                        Live Tracking Log
                      </div>
                      <div className="p-5">
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                          <div
                            className="bg-[#8A5A44] h-2 rounded-full transition-all duration-700 shadow-sm"
                            style={{ width: `${StatusManager.getStatus(selectedFlight.status).progress}%` }}
                          />
                        </div>
                        
                        {selectedFlight.statusHistory && selectedFlight.statusHistory.length > 0 ? (
                          <div className="space-y-4 mt-2">
                            {[...selectedFlight.statusHistory].reverse().map((entry, i) => {
                              const s = StatusManager.getStatus(entry.status);
                              const dotClass = dotColors[entry.status] || "bg-gray-400";
                              return (
                                <div key={i} className="flex items-start gap-3 border-l-2 border-gray-100 pl-4 py-1">
                                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 -ml-[21px] ${dotClass}`} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-bold text-gray-900">{s.label}</span>
                                      <span className="text-xs font-semibold text-gray-400">
                                        {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"}
                                      </span>
                                    </div>
                                    {entry.note && (
                                      <p className="text-xs text-gray-700 mt-1.5 bg-gray-50 p-2 rounded-md border border-gray-200 font-medium">
                                        {entry.note}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                           <p className="text-sm text-gray-400">No tracking history yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Actions & Info) */}
                  <div className="w-full xl:w-[320px] space-y-6">
                    {/* Booking Information */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-200 font-bold text-gray-900">
                        Booking Information
                      </div>
                      <div className="p-5 space-y-4 text-sm">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                          <span className="text-gray-400 font-semibold">Status</span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${statusColors[selectedFlight.status] || "bg-gray-100 text-gray-700"}`}>
                            {StatusManager.getStatus(selectedFlight.status).label}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                          <span className="text-gray-400 font-semibold">Booking ID</span>
                          <span className="font-bold text-gray-900 tracking-tight">{selectedFlight.trackingCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-semibold">Created on</span>
                          <span className="font-bold text-gray-900">{selectedFlight.createdAt ? new Date(selectedFlight.createdAt.seconds * 1000).toLocaleDateString() : "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Action */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-200 font-bold text-gray-900">
                        Booking Action
                      </div>
                      <div className="p-5 flex flex-col gap-2.5">
                        <button 
                          onClick={() => setEditingFlight(selectedFlight)}
                          className="w-full py-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm text-sm"
                        >
                          Update Live Status
                        </button>
                        <button 
                          onClick={() => setEditingFlight(selectedFlight)}
                          className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm"
                        >
                          Edit Details
                        </button>
                        <div className="h-px w-full bg-gray-100 my-1"></div>
                        <button 
                          onClick={handleCancelBooking}
                          disabled={isCancelling || selectedFlight.status === "cancelled"}
                          onBlur={() => setConfirmCancelId(null)}
                          className={`w-full py-2.5 font-bold rounded-lg transition-colors shadow-sm text-sm flex items-center justify-center gap-2 ${
                            selectedFlight.status === "cancelled" || isCancelling
                              ? "bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed"
                              : confirmCancelId === selectedFlight.id
                              ? "bg-red-500 border border-red-600 text-white hover:bg-red-600 animate-pulse"
                              : "bg-white border border-gray-200 text-red-500 hover:bg-red-50"
                          }`}
                        >
                          {isCancelling ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : null}
                          {selectedFlight.status === "cancelled" 
                            ? "Booking Cancelled" 
                            : confirmCancelId === selectedFlight.id
                            ? "Are you sure? Click to confirm"
                            : "Cancel Booking"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal (Admin can book flights for individuals) */}
        </div>
      </main>
      
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
