import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUser, HiOutlineLogout, HiMenu, HiX } from 'react-icons/hi';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getProfilePic = () => {
    if (user?.profilePic) return user.profilePic;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-100/80 shadow-sm shadow-slate-100/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center
                            shadow-md shadow-indigo-500/20 group-hover:scale-105 group-hover:shadow-indigo-500/30 transition-all duration-300">
              <span className="text-white font-extrabold text-lg tracking-tight">S</span>
            </div>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-300 hidden sm:block">
              Social<span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">App</span>
            </span>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="hidden sm:flex items-center gap-4">
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                Feed
              </Link>
            )}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100/80
                           transition-all duration-300 cursor-pointer group"
              >
                <img
                  src={getProfilePic()}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-indigo-500/20 transition-all duration-300"
                />
                <span className="text-sm font-semibold text-slate-700 max-w-[120px] truncate group-hover:text-slate-900 transition-colors duration-200">
                  {user?.name}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 py-2 animate-fade-in origin-top-right">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700
                               hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200"
                  >
                    <HiOutlineUser className="w-4.5 h-4.5 text-slate-400 group-hover:text-indigo-500" />
                    My Profile
                  </Link>
                  <hr className="my-1.5 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-500
                               hover:bg-red-50 hover:text-red-600 transition-colors duration-200 w-full cursor-pointer"
                  >
                    <HiOutlineLogout className="w-4.5 h-4.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-slate-100/80
                       hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-5 h-5 text-slate-600" />
            ) : (
              <HiMenu className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-100/60 py-3.5 space-y-2.5 animate-fade-in">
            <div className="flex items-center gap-3 px-3 py-2">
              <img
                src={getProfilePic()}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/10"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400">@{user?.username}</p>
              </div>
            </div>
            
            <div className="space-y-1 px-1">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-600
                           hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all duration-200"
              >
                <HiOutlineUser className="w-4.5 h-4.5" />
                My Profile
              </Link>
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-500
                           hover:bg-red-50 rounded-xl transition-all duration-200 w-full cursor-pointer"
              >
                <HiOutlineLogout className="w-4.5 h-4.5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
