import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Youtube, Twitter, CheckSquare, BookOpen, MoreHorizontal, Home, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout, user, stats } = useAuthStore();
  const navigate = useNavigate();
  const Calllogout = () => {
    logout();
    navigate('/auth/login');
  };
  
  const mainNavItems = [
    { 
      name: 'All Notes', 
      path: '/', 
      icon: <Home size={20} />,
      count: stats.reduce((acc, stat) => acc + stat.count, 0)
    },
    { 
      name: 'YouTube', 
      path: '/youtube', 
      icon: <Youtube size={20} className="text-red-600" />,
      count: stats.find(s => s._id === 'youtube')?.count || 0
    },
    { 
      name: 'Twitter', 
      path: '/twitter', 
      icon: <Twitter size={20} className="text-blue-500" />,
      count: stats.find(s => s._id === 'twitter')?.count || 0
    },
    { 
      name: 'Tasks', 
      path: '/tasks', 
      icon: <CheckSquare size={20} className="text-green-600" />,
      count: stats.find(s => s._id === 'task')?.count || 0
    },
    { 
      name: 'Blog Posts', 
      path: '/blogs', 
      icon: <BookOpen size={20} className="text-purple-600" />,
      count: stats.find(s => s._id === 'blog')?.count || 0
    },
    { 
      name: 'Other', 
      path: '/other', 
      icon: <MoreHorizontal size={20} className="text-gray-600" />,
      count: stats.find(s => s._id === 'other')?.count || 0
    },
  ];
  
  const secondaryNavItems = [
   // { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Second Brain</h1>
        <p className="text-sm text-gray-500">Organize your thoughts</p>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <nav className="mt-4 px-2">
          <div className="mb-6">
            <p className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Notes
            </p>
            <ul>
              {mainNavItems.map((item) => (
                <li key={item.path} className="mb-1">
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium 
                      ${isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <p className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </p>
            <ul>
              {secondaryNavItems.map((item) => (
                <li key={item.path} className="mb-1">
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm font-medium 
                      ${isActive(item.path)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user.username}</p>
          </div>
          <button
            onClick={Calllogout}
            className="ml-auto flex items-center text-gray-500 hover:text-red-600"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;