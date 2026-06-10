import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { login } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (token) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#f8fafc] px-4 py-12 overflow-hidden">
      {/* Premium ambient light backgrounds */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-pink-200/30 to-violet-200/30 blur-[130px] pointer-events-none" />
      
      {/* Decorative floating grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.4] pointer-events-none" />

      <div className="relative w-full max-w-[440px] z-10 animate-slide-up">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-white shadow-xl shadow-indigo-100/50 rounded-2xl border border-slate-100 mb-4 transition-transform duration-300 hover:scale-105">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-extrabold text-xl tracking-tight">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Connect, engage and express yourself</p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/80 rounded-[32px] shadow-[0_24px_50px_-12px_rgba(79,70,229,0.08)] p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_24px_60px_-10px_rgba(79,70,229,0.12)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="login-email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                  <span>⚠️</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative group">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200/80 bg-white/50 text-sm text-slate-800
                             placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10
                             focus:border-indigo-500 focus:bg-white transition-all duration-300"
                  placeholder="••••••••"
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
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5 font-medium flex items-center gap-1">
                  <span>⚠️</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white font-semibold text-sm
                         hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] transition-all duration-300 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25
                         flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to SocialApp?{' '}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


