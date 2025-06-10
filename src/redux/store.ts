// src/redux/store.ts
import { createStore, combineReducers } from 'redux';

// Définir le type de l'état
interface RootState {
  placeholder: any;
}

// Reducer minimal
const rootReducer = (state: RootState = { placeholder: {} }, action: any): RootState => {
  return state;
};

// Créer le store
const store = createStore(rootReducer);

export default store;
export type AppStore = typeof store;