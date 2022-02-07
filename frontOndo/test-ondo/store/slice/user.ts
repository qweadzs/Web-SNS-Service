import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../interfaces/User.interface";

const initialState: User = {
  nickname: "카리나",
  email: "base@base.com",
  count: 0,
  data: "",
  error: null,
  ondo: 30,
  image: "https://cdn.entermedia.co.kr/news/photo/202112/28096_52173_2023.jpg",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    profileEdit: (state) => {},
    getUser: (state) => {},
    setnickname: (state, { payload }) => {
      state.nickname = payload;
    },
    setEmail: (state, { payload }) => {
      state.email = payload;
    },
    getKakaoKey: (state) => {},
    getKakaoKeySuccess: (state, { payload }) => {
      state.data = payload;
      localStorage.setItem("Token", payload);
    },
    getKakaoKeyError: (state, { payload }) => {
      state.error = payload;
    },

    getToken: (state) => {
      const token = localStorage.getItem("Token");
      state.data = token;
    },
  },
});

const { actions, reducer } = userSlice;
export const userActions = actions;
export default reducer;
