import CourierInfo from "../../components/courier/courier-info"
import { Search,Filter,MapPin,Copy } from "lucide-react"
const MainContent = ({setSearchQuery,selectedTracking,setSelectedTracking,timelineEvents,trackingItems,searchQuery,mapContainer,courierData,setChatOpen}) => {
return (
        <div className="flex-1 flex flex-col">
            <div className="lg:hidden bg-white border-b border-gray-200 p-4">
                <div className="mb-4">
                    <h1 className="text-xl font-semibold text-gray-900 mb-4">Tracking</h1>

                    {/* Mobile Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tracking ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                        <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Mobile Tracking Items - Horizontal scroll */}
                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {trackingItems.map((item) => (
                        <div
                            key={item.id}
                            className={`flex-shrink-0 w-64 p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${selectedTracking === item.id ? "ring-2 ring-gray-800 border-gray-800" : "border-gray-200"
                                }`}
                            onClick={() => setSelectedTracking(item.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                    <span className="font-medium text-gray-900">{item.id}</span>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === "Delivered"
                                        ? "bg-green-100 text-green-800"
                                        : item.status === "In transit"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </div>
                            {item.date && (
                                <>
                                    <div className="text-sm text-gray-600 mb-1">Package arrived on: {item.date}</div>
                                    <div className="text-sm text-gray-600">Time: {item.time}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div className="flex-1">
                <div ref={mapContainer} className="w-full h-64 lg:h-96" />
            </div>

            {/* Main tracking info below map */}
            <div className="bg-white border-t border-gray-200 p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium text-gray-900">Live shipment tracking</span>
                        </div>
                        <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Tracking ID:</div>
                            <div className="font-medium text-blue-600">#C024</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Shipping Status:</div>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                On going
                            </span>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Distance:</div>
                            <div className="font-medium">153 km</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Est. delivery time:</div>
                            <div className="font-medium">2 hours 22 minutes</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">From:</div>
                            <div className="font-medium">Jakarta, Indonesia</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">To:</div>
                            <div className="font-medium">Bandung, Indonesia</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Total weight:</div>
                            <div className="font-medium">29.86 kg</div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Package shipped</span>
                            <span className="text-sm text-gray-600">Est. package arrival</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">February 19, 2025 • 18:49 PM</span>
                            <span className="text-sm font-medium">February 19, 2025 • 22:12 PM</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                    </div>

                    <div className="lg:hidden mt-6">
                        {selectedTracking === "#C024" && (
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-4">Package Timeline</h3>
                                <div className="space-y-4">
                                    {timelineEvents.map((event, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div
                                                className={`w-3 h-3 rounded-full mt-1 ${event.completed ? "bg-blue-500" : "bg-gray-300"}`}
                                            ></div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">{event.status}</div>
                                                <div className="text-xs text-gray-500">
                                                    {event.date} • {event.time}
                                                </div>
                                                <div className="text-xs text-gray-500">{event.location}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Courier Info Section */}
                    <div className="mt-6">
                        <CourierInfo courier={courierData} onChatOpen={() => setChatOpen(true)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainContent
