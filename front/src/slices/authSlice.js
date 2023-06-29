import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '../services/getData';

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (values, thunkAPI) => {
  try {
    const { data } = await getData.request('/auth/login', 'POST', values);
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  try {
    const { data } = await getData.request('/auth/profile/me');
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
});

export const fetchReg = createAsyncThunk('auth/register', async (values) => {
  try {
    const { data } = await getData.request('/auth/registration', 'POST', values);
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
});

const initialState = {
  data: null,
  status: 'loading',
  errorMessage: null,
  errorRegMessage: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = 'idle';
    },
  },
  extraReducers: {
    // Login
    [fetchAuth.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
      state.errorMessage = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'idle';
      state.errorMessage = null;
    },
    [fetchAuth.rejected]: (state, action) => {
      state.data = action.payload;
      state.errorMessage = action.error.message;
      state.status = 'error';
    },
    // Auth profile
    [fetchAuthMe.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
      state.errorMessage = null;
    },
    [fetchAuthMe.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'idle';
      state.errorMessage = null;
    },
    [fetchAuthMe.rejected]: (state) => {},
    // Registration
    [fetchReg.pending]: (state) => {
      state.data = null;
      state.status = 'loading';
      state.errorRegMessage = null;
    },
    [fetchReg.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.status = 'idle';
      state.errorRegMessage = null;
    },
    [fetchReg.rejected]: (state, action) => {
      state.data = action.payload;
      state.status = 'error';
      if (action.error.message !== 'Ошибка при валидации') {
        state.errorRegMessage = action.error.message;
      }
    },
  },
});

export const { logout } = authSlice.actions;
