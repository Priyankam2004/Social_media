import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiPencil, HiCalendar, HiMail, HiAtSymbol } from 'react-icons/hi';
import { fetchProfile } from '../features/user/userSlice';
import { fetchPosts } from '../features/post/postSlice';
import ProfileForm from '../components/ProfileForm';
import PostCard from '../components/PostCard';
import Loader, { PostSkeleton } from '../components/Loader';

const Profile = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();
  const { profile, isLoading: profileLoading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading: postsLoading } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchPosts());
  }, [dispatch]);

  const displayProfile = profile || user;
  const userPosts = posts.filter((p) => p.user?._id === user?._id);

  const getProfilePic = () => {
    if (displayProfile?.profilePic) return displayProfile.profilePic;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayProfile?.name || 'U')}&background=6366f1&color=fff&size=200`;
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', year: 'numeric',
    });
  };

  if (profileLoading && !displayProfile) {
    return (
      <div className="flex justify-center py-24">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-[24px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden mb-8 animate-fade-in">
        {/* Cover gradient */}
        <div className="h-36 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-90" />

        <div className="px-6 pb-6">
          {/* Avatar and Edit */}
          <div className="flex items-end justify-between -mt-16 mb-4">
            <img
              src={getProfilePic()}
              alt={displayProfile?.name}
              className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl shadow-slate-200/50"
            />
            <button
              onClick={() => setShowEditForm(true)}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-200/80
                         text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100
                         active:scale-[0.98] transition-all duration-300 cursor-pointer mt-16 shadow-sm"
            >
              <HiPencil className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              Edit Profile
            </button>
          </div>

          {/* Info */}
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{displayProfile?.name}</h1>
          <p className="text-xs font-bold text-indigo-500 flex items-center gap-1 mt-1">
            <HiAtSymbol className="w-3.5 h-3.5" />
            {displayProfile?.username}
          </p>

          {displayProfile?.bio && (
            <p className="text-sm font-medium text-slate-600 mt-4 leading-relaxed bg-slate-50/50 border border-slate-100/40 rounded-2xl p-4">{displayProfile.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-5 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <HiMail className="w-4 h-4 text-slate-400" />
              {displayProfile?.email}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <HiCalendar className="w-4 h-4 text-slate-400" />
              Joined {formatJoinDate(displayProfile?.createdAt)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-5 border-t border-slate-100/80">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-2.5">
              <span className="text-base font-extrabold text-slate-800">{userPosts.length}</span>
              <span className="text-xs font-bold text-slate-400 ml-1.5">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Your Activity</h2>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
          {userPosts.length}
        </span>
      </div>

      <div className="space-y-6">
        {postsLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-slate-100/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.03)] px-6">
            <p className="text-sm font-semibold text-slate-400">No posts shared yet</p>
            <p className="text-xs text-slate-400 mt-1">Start sharing photos on your feed to see them here.</p>
          </div>
        ) : (
          userPosts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <ProfileForm
          profile={displayProfile}
          onClose={() => {
            setShowEditForm(false);
            dispatch(fetchProfile());
          }}
        />
      )}
    </div>
  );
};

export default Profile;
