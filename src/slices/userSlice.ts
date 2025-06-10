import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    name: string;
    preferences: string[];
    allergies: string[];
    favoriteDishes: string[];
}

const initialState: UserState = {
    name: '',
    preferences: [],
    allergies: [],
    favoriteDishes: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setPreferences: (state, action: PayloadAction<string[]>) => {
            state.preferences = action.payload;
        },
        setAllergies: (state, action: PayloadAction<string[]>) => {
            state.allergies = action.payload;
        },
        setFavoriteDishes: (state, action: PayloadAction<string[]>) => {
            state.favoriteDishes = action.payload;
        },
    },
});

export const { setUserName, setPreferences, setAllergies, setFavoriteDishes } = userSlice.actions;
export default userSlice.reducer;
