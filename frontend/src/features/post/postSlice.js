import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postAPI from './postAPI';

export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async (_, thunkAPI) => {
    try {
      return await postAPI.getAllPosts();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch posts';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createNewPost = createAsyncThunk(
  'post/createNewPost',
  async (formData, thunkAPI) => {
    try {
      return await postAPI.createPost(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to create post';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removePost = createAsyncThunk(
  'post/removePost',
  async (id, thunkAPI) => {
    try {
      await postAPI.deletePost(id);
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to delete post';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'post/toggleLike',
  async (id, thunkAPI) => {
    try {
      const data = await postAPI.likePost(id);
      return data; // { likes, postId }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to like post';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const postComment = createAsyncThunk(
  'post/postComment',
  async ({ postId, text }, thunkAPI) => {
    try {
      const comments = await postAPI.addComment(postId, text);
      return { postId, comments };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to add comment';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeComment = createAsyncThunk(
  'post/removeComment',
  async ({ postId, commentId }, thunkAPI) => {
    try {
      const comments = await postAPI.deleteComment(postId, commentId);
      return { postId, comments };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to delete comment';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  message: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    resetPost: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Post
      .addCase(createNewPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Post
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload
        );
      })
      .addCase(removePost.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Like/Unlike
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.likes = likes;
        }
      })
      // Add Comment
      .addCase(postComment.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.comments = comments;
        }
      })
      // Delete Comment
      .addCase(removeComment.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          post.comments = comments;
        }
      });
  },
});

export const { resetPost } = postSlice.actions;
export default postSlice.reducer;
