import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    businesses: [],
    loading: false,
    error: null
}

const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        addBusiness: (state, action) => {
            state.loading = false;
            state.error = null;
            state.businesses = [...state.businesses, action.payload];
        },
        getAllBusiness: (state, action) => {
            state.loading = false;
            state.error = null;
            // Make sure payload is an array and spread it into the businesses state
            state.businesses = Array.isArray(action.payload) ? action.payload : [];
        }
    }
})

export const { addBusiness, getAllBusiness } = businessSlice.actions;
export default businessSlice.reducer;