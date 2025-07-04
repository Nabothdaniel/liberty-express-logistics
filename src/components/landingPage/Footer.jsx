const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white px-6 md:px-20 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-20">
                {/* Brand and Navigation */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">Liberty Express</h1>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-blue-400 transition-colors">Products & Solutions</a>
                        </li>
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Legal</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-blue-400 transition-colors">User Data Policy</a>
                        </li>
                    </ul>
                </div>

                {/* Footer bottom section */}
                <div className="flex flex-col justify-between">
                    <p className="text-sm md:text-base text-gray-400 mt-6 md:mt-0">
                        &copy; {new Date().getFullYear()} Liberty Express. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
