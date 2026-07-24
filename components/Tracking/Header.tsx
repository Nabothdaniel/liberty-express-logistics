import Link from "next/link"
import { Home} from "lucide-react"
import { MapPin } from "lucide-react"

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <Link href={'/'} className="text-lg font-bold text-gray-900">Liberty Express</Link>
                    </div>

                    <nav className="flex items-center space-x-6">
                        <Link href='/' className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                        <Link href="/track" className="flex items-center px-3 py-2 text-gray-900 bg-gray-100 rounded-md">
                            <MapPin className="w-4 h-4 mr-2" />
                            Tracking
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
