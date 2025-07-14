import { FaChartBar,FaComment,FaBox,FaBoxes,FaCog } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const TrackingHeader = () => {
  const navItems = [
    { label: "Dashboard", icon: FaChartBar, active: false },
    { label: "Message", icon: FaComment, active: false },
    { label: "Track", icon: FaBox, active: true },
    { label: "Orders", icon: FaBoxes, active: false },
    { label: "Setting", icon: FaCog, active: false },
  ];

  return (
    <header className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FaBox className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Gosako</span>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  item.active 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-sm">
            <div className="font-medium">Du</div>
            <div className="text-muted-foreground text-xs">du...</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TrackingHeader;