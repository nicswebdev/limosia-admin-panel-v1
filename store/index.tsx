import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import { createWrapper } from 'next-redux-wrapper';

import themeConfigSlice from './themeConfigSlice';
import { userReducer } from './userSlice';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    user: userReducer,
});

const persistedReducer = persistReducer<IRootState>(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    // middleware: [thunk],
});

const persistor = persistStore(store, {}, function () {
    persistor.persist();
});
const makeStore = () => store;
const wrapper = createWrapper(makeStore, { debug: true });

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store, wrapper };
