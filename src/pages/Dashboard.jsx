
import DashboardHeader from '../components/dashboardpage/Header';
import StatsCards from '../components/dashboardpage/StatsCard';
import TrackingSection from '../components/dashboardpage/Tracking';
import AnalyticsSection from '../components/dashboardpage/Analytics';
import Shipments from '../components/dashboardpage/shipments-section';
import TrackingOrdersHeader from '../components/dashboardpage/TrackingHeader';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />
            <div className="px-3 py-6 space-y-6">
                <TrackingOrdersHeader />
                <StatsCards />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                        <AnalyticsSection />
                        <Shipments />
                    </div>
                    <div>
                        <TrackingSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
