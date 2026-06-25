import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: false,
  repoUrl : "",
  cards: [],
  currentAnalysis: null,
  currentpath : null ,
  error: null
}

const reposlice = createSlice({
name : "repo" ,
initialState,
reducers :{
setRepoUrl (state, action) {
  state.repoUrl = action.payload;
},
reposucess(state, action) {
  state.loading = false;
  state.cards.push(action.payload);
},
setcontent(state, action) {
  state.loading = false;
  state.currentAnalysis = action.payload;
},
setpath(state , action){
state.loading = false ,
state.currentpath = action.payload
},
setLoading(state, action){
  state.loading = action.payload
},
setError(state, action){
  state.error = action.payload
}

}

})
export const {
  setRepoUrl,
  reposucess,  
  setcontent,
  setpath
} = reposlice.actions;
export default reposlice.reducer 





