import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const data = await axios.get("/posts");
  return data;
});

export const fetchSortPosts = createAsyncThunk("posts/fetchSortPosts", async () => {
  const data = await axios.get("/posts/sort");
  return data;
});

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const data = await axios.get("/tags");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => axios.delete(`/posts/${id}`)
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    // Получення постів
    [fetchPosts.pending]: (state) => {
      state.posts.status = "loading";
      state.posts.items = [];
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.status = "loaded";
      state.posts.items = action.payload;
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.status = "error";
      state.posts.items = [];
    },
    // Получення тегів
    [fetchTags.pending]: (state) => {
      state.tags.status = "loading";
      state.tags.items = [];
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.status = "loaded";
      state.tags.items = action.payload;
    },
    [fetchTags.rejected]: (state) => {
      state.tags.status = "error";
      state.tags.items = [];
    },
    // получення відсортованих статій
    [fetchSortPosts.pending]: (state) => {
      state.posts.status = "loading";
      state.posts.items = [];
    },
    [fetchSortPosts.fulfilled]: (state, action) => {
      state.posts.status = "loaded";
      state.posts.items = action.payload;
    },
    [fetchSortPosts.rejected]: (state) => {
      state.posts.status = "error";
      state.posts.items = [];
    },
    // Видалення посту
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items.data = state.posts.items.data.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const postsReducer = postSlice.reducer;
