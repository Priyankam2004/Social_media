import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
  HiCamera,
} from 'react-icons/hi';
import { HiOutlineAtSymbol } from 'react-icons/hi';
import { register as registerUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (profileFile) {
      formData.append('profilePic', profileFile);
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f8fafc] px-4 py-12 overflow-hidden">
      {/* Premium ambient light backgrounds */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-pink-200/30 to-violet-200/30 blur-[130px] pointer-events-none" />
      
      {/* Decorative floating grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.4] pointer-events-none" />

      <div className="relative w-full max-w-[460px] z-10 animate-slide-up">
        {/* Logo and Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3.5 bg-white shadow-xl shadow-indigo-100/50 rounded-2xl border border-slate-100 mb-3 transition-transform duration-300 hover:scale-105">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-extrabold text-lg tracking-tight">S</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">Join us and start sharing your moments</p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/80 rounded-[32px] shadow-[0_24px_50px_-12px_rgba(79,70,229,0.08)] p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_24px_60px_-10px_rgba(79,70,229,0.12)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative group">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-full bg-slate-100/80 border-2 border-white shadow-md flex items-center justify-center
                             cursor-pointer overflow-hidden ring-4 ring-indigo-500/5 hover:ring-indigo-500/20
                             transition-all duration-300"
                >
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors duration-200">
                      <HiCamera className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                    </div>
                  )}
                </div>
                {profilePreview && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer pointer-events-none">
                    <HiCamera className="w-6 h-6 text-white" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="register-name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    maxLength: { value: 50, message: 'Max 50 characters' },
                  })}
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {errors.name.message}</p>}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="register-username" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative group">
                <HiOutlineAtSymbol className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="register-username"
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Min 3 characters' },
                    maxLength: { value: 30, message: 'Max 30 characters' },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Letters, numbers, underscores only',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="johndoe"
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="register-email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className="w-full pl-12 pr-12 py-2.5 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600
                             transition-colors duration-200 cursor-pointer"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  className="w-full pl-12 pr-12 py-2.5 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600
                             transition-colors duration-200 cursor-pointer"
                >
                  {showConfirm ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">⚠️ {errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white font-semibold text-sm
                         hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] transition-all duration-300 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25
                         flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
