import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { HiCamera, HiX } from 'react-icons/hi';
import { editProfile } from '../features/user/userSlice';
import { updateUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const ProfileForm = ({ profile, onClose }) => {
  const [preview, setPreview] = useState(profile?.profilePic || null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: profile?.name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getDisplayPic = () => {
    if (preview) return preview;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'U')}&background=6366f1&color=fff&size=200`;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('bio', data.bio);
      if (imageFile) {
        formData.append('profilePic', imageFile);
      }

      const updatedProfile = await dispatch(editProfile(formData)).unwrap();
      dispatch(updateUser(updatedProfile));
      toast.success('Profile updated successfully!');
      onClose?.();
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" />

      <div
        className="relative bg-white rounded-[24px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)] border border-slate-100 max-w-md w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center justify-center
                       text-slate-400 hover:text-slate-600 transition-all duration-200 cursor-pointer"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <img
              src={getDisplayPic()}
              alt="Profile avatar"
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-100 shadow-md transition-all duration-300 group-hover:scale-102"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl
                         flex items-center justify-center text-white transition-all duration-200
                         cursor-pointer shadow-md hover:scale-105 active:scale-95"
            >
              <HiCamera className="w-4.5 h-4.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input
              {...register('name', {
                required: 'Name is required',
                maxLength: { value: 50, message: 'Max 50 characters' },
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 font-semibold
                         focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white
                         transition-all duration-200"
              placeholder="e.g. John Doe"
            />
            {errors.name && (
              <p className="text-xs font-semibold text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Username</label>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Min 3 characters' },
                maxLength: { value: 30, message: 'Max 30 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Only letters, numbers, and underscores',
                },
              })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 font-semibold
                         focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white
                         transition-all duration-200"
              placeholder="e.g. johndoe"
            />
            {errors.username && (
              <p className="text-xs font-semibold text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Bio</label>
            <textarea
              {...register('bio', {
                maxLength: { value: 200, message: 'Max 200 characters' },
              })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 font-semibold
                         focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white
                         transition-all duration-200 resize-none"
              placeholder="A few words about you..."
            />
            {errors.bio && (
              <p className="text-xs font-semibold text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs
                         hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-xs
                         hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] shadow-md shadow-indigo-500/10 transition-all duration-200 cursor-pointer
                         disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
