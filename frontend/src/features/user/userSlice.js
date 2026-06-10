import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userAPI from './userAPI';

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, thunkAPI) => {
    try {
      return await userAPI.getProfile();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to fetch profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editProfile = createAsyncThunk(
  'user/editProfile',
  async (formData, thunkAPI) => {
    try {
      return await userAPI.updateProfile(formData);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Failed to update profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  profile: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Edit Profile
      .addCase(editProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
