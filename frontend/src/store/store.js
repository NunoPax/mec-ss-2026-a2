import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import booksReducer from "./booksSlice";
import messagesReducer from "./messagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    messages: messagesReducer,
  },
});
