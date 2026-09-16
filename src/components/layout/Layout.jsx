import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Settings } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAddPage = location.pathname === '/add';

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/add', icon: PlusCircle, label: 'Add' },
    { path: '/insights', icon: BarChart3, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      
      {/* Bottom Navigation - Hidden on Add page */}
      {!isAddPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center py-2 px-4 rounded-xl transition ${
                    isActive
                      ? 'text-emerald-500'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-xs mt-1 ${isActive ? 'font-medium' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
