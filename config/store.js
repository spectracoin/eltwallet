import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import { defaultState, rootReducer } from './reducer';
import storage from './storage';

const config = {
  key: 'eltwallet',
  keyPrefix: 'persist-',
  version: 1,
  storage,
};

const store = createStore(
  persistReducer(config, rootReducer),
  defaultState,
  process.env.NODE_ENV === 'production'
    ? undefined
    : applyMiddleware(createLogger()),
);

const persistor = persistStore(store);

export { persistor, store };
