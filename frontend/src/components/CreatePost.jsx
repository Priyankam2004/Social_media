import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePhotograph, HiX } from 'react-icons/hi';
import { createNewPost } from '../features/post/postSlice';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      await dispatch(createNewPost(formData)).unwrap();
      toast.success('Post created successfully!');
      setCaption('');
      removeImage();
    } catch (error) {
      toast.error(error || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProfilePic = () => {
    if (user?.profilePic) return user.profilePic;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`;
  };

  return (
    <div className="bg-white rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] border border-slate-100 p-5 mb-6 animate-fade-in transition-all duration-300 hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.06)]">
      <div className="flex items-start gap-4">
        <img
          src={getProfilePic()}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-slate-100 shadow-sm"
        />
        <div className="flex-1">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share what's on your mind..."
            className="w-full resize-none border-0 outline-none text-slate-800 placeholder-slate-400 text-sm font-medium leading-relaxed min-h-[72px] focus:ring-0 pt-1"
            rows={2}
            maxLength={1000}
          />
        </div>
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="relative mt-4 rounded-2xl overflow-hidden border border-slate-100 group shadow-sm bg-slate-50">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-96 object-contain rounded-2xl mx-auto"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full
                       flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100/80">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold
                     transition-all duration-300 cursor-pointer px-4 py-2 rounded-xl border border-transparent hover:border-indigo-100/50"
        >
          <HiOutlinePhotograph className="w-5 h-5 text-indigo-500" />
          <span>Add Photo</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !image}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold rounded-xl
                     hover:from-indigo-600 hover:to-violet-700 active:scale-[0.98] transition-all duration-300 cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25
                     flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <span>Share Post</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
