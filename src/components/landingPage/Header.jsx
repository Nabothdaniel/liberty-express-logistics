import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    let navigate = useNavigate()

    const routeToLogin = ()=> navigate('/login')

    return (
        <header className="bg-white text-black border-b md:border-0 md:rounded-md border-gray-200 fixed top-0 md:top-3   left-0 md:left-10 right-0 md:right-10  z-[999]">
            <div className=" md:max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex flex-row items-center justify-between">
                    {/* Logo */}
                    <a href="/" className="text-xl font-semibold text-gray-800">
                        Liberty Express
                    </a>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="inline-flex items-center p-2 text-sm cursor-pointer text-gray-500 rounded-lg md:hidden active:bg-gray-200 hover:bg-gray-200"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 5h14a1 1 0 010 2H3a1 1 0 110-2z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Nav Menu */}
                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden md:flex md:items-center ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        } md:max-h-full md:opacity-100`}
                    style={{ transitionProperty: "max-height, opacity" }}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-6 py-4 md:py-0 text-left">
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md hover:text-blue-600"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md hover:text-blue-600"
                            >
                                About Us
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md hover:text-blue-600"
                            >
                                Product & Solutions
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <button  onClick={routeToLogin} className="border-gray-500 border-2 text-gray-500 active:bg-gray-700 hover:text-gray-700 rounded-lg px-3 py-2 cursor-pointer font-bold">
                        Get Started
                    </button>
                    <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </header>
    );
}
