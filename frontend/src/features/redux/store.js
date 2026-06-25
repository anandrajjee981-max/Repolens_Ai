import { configureStore } from "@reduxjs/toolkit";
import authreducer from '../auth/auth.slice.js'
import reporeducer from '../pages/repo.slice.js'

export const store = configureStore({
  reducer: {
    auth : authreducer,
    repo : reporeducer
  }
});