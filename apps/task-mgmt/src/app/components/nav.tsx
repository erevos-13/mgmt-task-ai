import { FC, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

const Nav: FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleTheme = () => {
    toggleProfile();
    const element = document.documentElement;
    if (element.classList.contains('dark')) {
      element.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      element.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  const navigatePage = (path: string) => {
    toggleProfile();
    navigate(path);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              TaskMgmt
            </Link>
          </div>

          {/* Profile Section */}
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.email.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {user?.email}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={() => navigatePage('/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={() => navigatePage('/settings')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Settings
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Toggle Theme
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
