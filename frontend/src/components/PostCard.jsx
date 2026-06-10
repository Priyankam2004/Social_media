import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiHeart, HiOutlineHeart, HiOutlineChatAlt2, HiOutlineTrash } from 'react-icons/hi';
import { toggleLike, removePost } from '../features/post/postSlice';
import CommentModal from './CommentModal';
import ConfirmModal from './ConfirmModal';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isOwner = user?._id === post.user?._id;
  const isLiked = post.likes?.includes(user?._id);

  const getProfilePic = () => {
    if (post.user?.profilePic) return post.user.profilePic;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'U')}&background=6366f1&color=fff`;
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleLike = async () => {
    setLiked(true);
    try {
      await dispatch(toggleLike(post._id)).unwrap();
    } catch (error) {
      toast.error('Failed to update like');
    }
    setTimeout(() => setLiked(false), 600);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(removePost(post._id)).unwrap();
      toast.success('Post deleted');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <article className="bg-white rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] border border-slate-100/80 overflow-hidden animate-fade-in
                          hover:shadow-[0_16px_48px_-10px_rgba(0,0,0,0.06)] hover:border-slate-200/50 transition-all duration-300 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <img
              src={getProfilePic()}
              alt={post.user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
            />
            <div>
              <h3 className="text-sm font-bold text-slate-800 leading-snug">
                {post.user?.name}
              </h3>
              <p className="text-xs font-medium text-slate-400">
                @{post.user?.username} · {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400
                         hover:text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all duration-200 cursor-pointer"
              title="Delete post"
            >
              <HiOutlineTrash className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {/* Caption */}
        {post.caption && (
          <div className="px-5 pb-3">
            <p className="text-[14px] text-slate-600 font-medium leading-relaxed">{post.caption}</p>
          </div>
        )}

        {/* Image */}
        <div className="relative border-y border-slate-50 bg-slate-50 overflow-hidden flex items-center justify-center">
          <img
            src={post.image}
            alt="Post content"
            className="w-full object-cover max-h-[520px] transition-transform duration-500 hover:scale-[1.01]"
            loading="lazy"
          />
        </div>

        {/* Action Panel */}
        <div className="px-5 py-4 bg-slate-50/30 border-t border-slate-50">
          <div className="flex items-center gap-5">
            {/* Like Action */}
            <button
              onClick={handleLike}
              className="flex items-center gap-2 group cursor-pointer px-3.5 py-2 rounded-xl bg-white border border-slate-100 hover:border-red-100 hover:bg-red-50/30 transition-all duration-300"
            >
              {isLiked ? (
                <HiHeart
                  className={`w-5 h-5 text-red-500 ${liked ? 'animate-heart' : ''}`}
                />
              ) : (
                <HiOutlineHeart className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors duration-200" />
              )}
              <span className={`text-xs font-bold ${isLiked ? 'text-red-500' : 'text-slate-500 group-hover:text-slate-800'}`}>
                {post.likes?.length || 0}
              </span>
            </button>

            {/* Comment Action */}
            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 group cursor-pointer px-3.5 py-2 rounded-xl bg-white border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300"
            >
              <HiOutlineChatAlt2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors duration-200">
                {post.comments?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </article>

      {/* Comment Modal */}
      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        post={post}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message="This post will be permanently deleted. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
      />
    </>
  );
};

export default PostCard;
