import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { AuthTab } from './AuthModal';
import UserIcon from './ui/icons/UserIcon';

interface HeaderProps {
  isAuthenticated: boolean;
  hasAccess: boolean;
  onAuthClick: (tab: AuthTab) => void;
  onLogout: () => void;
  onUpgradeClick: () => void;
  userEmail: string | null;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, hasAccess, onAuthClick, onLogout, onUpgradeClick, userEmail }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-base rounded-md transition-colors duration-300 relative ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`;

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl md:text-4xl font-heading tracking-wider text-white cursor-pointer">
          <span className="text-blue-400">VEO3</span> Mastery Hub
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden sm:flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass} end title="Home">
              {({ isActive }) => (
                <>
                  Home
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/journey" className={navLinkClass} title="Learning Journey">
              {({ isActive }) => (
                <>
                  Journey
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/generator" className={navLinkClass} title="Prompt Generator">
              {({ isActive }) => (
                <>
                  Generator
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/studio" className={navLinkClass} title="Video Studio">
              {({ isActive }) => (
                <>
                  Video Studio
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
            <NavLink to="/community" className={navLinkClass} title="Community Hub">
              {({ isActive }) => (
                <>
                  Community
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-blue-400 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {!hasAccess && (
            <Button onClick={onUpgradeClick} variant="primary" size="sm" className="hidden sm:block !ml-4">
              Upgrade to Pro
            </Button>
          )}

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                <UserIcon />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Signed in as</p>
                    <p className="font-medium text-white truncate">{userEmail}</p>
                  </div>
                  <button onClick={handleSettingsClick} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                    Account Settings
                  </button>
                  <button onClick={handleLogoutClick} className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button onClick={() => onAuthClick('login')} variant="secondary" size="md">
                Login
              </Button>
              <Button onClick={() => onAuthClick('signup')} variant="primary" size="md" className="hidden sm:block">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);