import { FaPhone, FaEye, FaUser } from "react-icons/fa";

const CourierInfo = ({ name, avatar, phone }) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <FaUser className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-foreground">{name}</h4>
            <p className="text-sm text-muted-foreground">Courier</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="h-8 w-8 p-0 border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center">
            <FaEye className="w-4 h-4" />
          </button>
          {phone && (
            <button className="h-8 w-8 p-0 border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center">
              <FaPhone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourierInfo;