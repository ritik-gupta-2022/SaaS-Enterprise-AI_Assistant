import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businesses : [],
    loading : false,
    error : null
}

const businessSlice = createSlice({
    name:'business',
    initialState,
    reducers:{
        addBusinessSucess: (state , action)=>{
            state.loading=false;
            state.error=null;
            state.businesses = [...state.businesses, action.payload]
        },
        
    }
})

export const {addBusinessSucess} = businessSlice.actions;
export default businessSlice.reducer;