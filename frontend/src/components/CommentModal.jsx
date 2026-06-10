import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiX, HiOutlineTrash, HiPaperAirplane } from 'react-icons/hi';
import { postComment, removeComment } from '../features/post/postSlice';
import { getImageUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';

const CommentModal = ({ isOpen, onClose, post }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const commentsEndRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [post?.comments?.length]);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(postComment({ postId: post._id, text: text.trim() })).unwrap();
      setText('');
    } catch (error) {
      toast.error(error || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(removeComment({ postId: post._id, commentId })).unwrap();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error(error || 'Failed to delete comment');
    }
  };

  const getProfilePic = (commentUser) => {
    if (commentUser?.profilePic) return getImageUrl(commentUser.profilePic);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(commentUser?.name || 'U')}&background=6366f1&color=fff&size=80`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-t-[32px] sm:rounded-[24px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 w-full sm:max-w-lg max-h-[85vh] flex flex-col animate-slide-up origin-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Comments
            </h3>
            {post.comments?.length > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                {post.comments.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center justify-center
                       text-slate-400 hover:text-slate-600 transition-all duration-200 cursor-pointer"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-[220px]">
          {post.comments?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm font-semibold text-slate-500">No comments yet</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3.5 group animate-fade-in">
                <img
                  src={getProfilePic(comment.user)}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-100 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50/80 border border-slate-100/50 rounded-[20px] px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {comment.user?.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
                {/* Delete comment */}
                {(comment.user?._id === user?._id || post.user?._id === user?._id) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400
                               hover:text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all duration-200
                               opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0 mt-2"
                    title="Delete comment"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input Footer */}
        <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-slate-100 bg-white rounded-b-[24px]">
          <div className="flex items-center gap-3">
            <img
              src={getImageUrl(user?.profilePic) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=80`}
              alt="You"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-100"
            />
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-100/80 hover:border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white rounded-2xl px-4 py-2.5 transition-all duration-300">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add to the discussion..."
                className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 font-semibold"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!text.trim() || isSubmitting}
                className="ml-2 text-indigo-600 hover:text-indigo-700 disabled:text-slate-300
                           transition-colors duration-250 cursor-pointer disabled:cursor-not-allowed"
              >
                <HiPaperAirplane className="w-4.5 h-4.5 rotate-90" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
