import { useState, useRef, useMemo, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiDollarSign, FiLogOut } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const getInitial = (name) => (name ? name[0].toUpperCase() : 'U');
const gradientOptions = [
    'linear-gradient(135deg, #4f46e5, #3b82f6)', // Indigo to Blue
    'linear-gradient(135deg, #16a34a, #22c55e)', // Green
    'linear-gradient(135deg, #db2777, #ec4899)', // Pink
    'linear-gradient(135deg, #f97316, #fb923c)', // Orange
    'linear-gradient(135deg, #e11d48, #f43f5e)', // Rose
    'linear-gradient(135deg, #0ea5e9, #38bdf8)', // Sky Blue
    'linear-gradient(135deg, #9333ea, #a855f7)', // Purple
    'linear-gradient(135deg, #059669, #10b981)', // Emerald
];





const DashboardUserBox = ({ user, loading }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    const getRandomGradient = () =>
        gradientOptions[Math.floor(Math.random() * gradientOptions.length)];

    const gradient = useMemo(() => getRandomGradient(), []);

    const initial = getInitial(user?.username);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login'); // adjust route if needed
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Avatar Button */}
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
                style={{ background: gradient }}
                onClick={() => setOpen((prev) => !prev)}
            >
                {initial}
            </div>

            {/* Dropdown Card */}
            {open && (
                <div className="absolute right-0 top-12 w-60 bg-white shadow-xl rounded-xl p-4 z-50">
                    <div className="mb-3">
                        <div className="text-sm font-semibold text-gray-900 mb-2">Name: {user?.username}</div>
                        <div className="text-xs text-gray-500">Email: {user?.email}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                            <FiDollarSign className="text-gray-500" />
                            Balance
                        </span>
                        <span>
                            ${loading ? '...' : (user?.balance || 0).toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-2 flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded transition"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            )}


        </div>
    );
};

export default DashboardUserBox;
