import { AsyncStorage, Platform } from 'react-native';
import SInfo from 'react-native-sensitive-info';
import { store } from '../config/store';
import {
  SET_WALLET_ADDRESS,
  ADD_TOKEN,
  SELECT_TOKEN,
  SET_PIN_CODE,
  SET_PRIVATE_KEY,
} from '../config/actionTypes';

export default class MigrationUtils {
  static async runMigrationFromAsyncStorage() {
    const keys = [
      '@ELTWALLET:address',
      '@ELTWALLET:availableTokens',
      '@ELTWALLET:defaultToken',
      '@ELTWALLET:pinCode',
      '@ELTWALLET:privateKey',
    ];

    const [
      walletAddress,
      availableTokens,
      selectedToken,
      pinCode,
      privateKey,
    ] = await AsyncStorage.multiGet(keys);

    if (availableTokens[1]) {
      JSON.parse(availableTokens[1])
        .slice(2)
        .forEach(token => {
          store.dispatch({
            type: ADD_TOKEN,
            token,
          });
        });
    }

    if (pinCode[1]) {
      store.dispatch({
        type: SET_PIN_CODE,
        pinCode: pinCode[1],
      });
    }

    if (privateKey[1]) {
      store.dispatch({
        type: SET_PRIVATE_KEY,
        privateKey: privateKey[1],
      });
    }

    if (selectedToken[1]) {
      store.dispatch({
        type: SELECT_TOKEN,
        token: JSON.parse(selectedToken[1]),
      });
    }

    if (walletAddress[1]) {
      store.dispatch({
        type: SET_WALLET_ADDRESS,
        walletAddress: walletAddress[1],
      });
    }

    return AsyncStorage.multiRemove(keys);
  }

  static async runMigrationFromReduxPersist() {
    const data = await SInfo.getAllItems({
      keychainService: 'eltwallet',
      sharedPreferencesName: 'eltwallet',
    });

    if (data['persist:eltwallet']) {
      const items = JSON.parse(data['persist:eltwallet']);

      if (items.availableTokens) {
        JSON.parse(items.availableTokens)
          .slice(2)
          .forEach(token => {
            store.dispatch({
              type: ADD_TOKEN,
              token,
            });
          });
      }

      if (items.pinCode) {
        store.dispatch({
          type: SET_PIN_CODE,
          pinCode: JSON.parse(items.pinCode),
        });
      }

      if (items.privateKey) {
        store.dispatch({
          type: SET_PRIVATE_KEY,
          privateKey: JSON.parse(items.privateKey),
        });
      }

      if (items.selectedToken) {
        store.dispatch({
          type: SELECT_TOKEN,
          token: JSON.parse(items.selectedToken),
        });
      }

      if (items.walletAddress) {
        store.dispatch({
          type: SET_WALLET_ADDRESS,
          walletAddress: JSON.parse(items.walletAddress),
        });
      }
    }

    return SInfo.deleteItem('persist:eltwallet', {
      keychainService: 'eltwallet',
      sharedPreferencesName: 'eltwallet',
    });
  }

  static async runMigration() {
    if (Platform.OS === 'ios') {
      return Promise.resolve();
    }

    await this.runMigrationFromAsyncStorage();
    await this.runMigrationFromReduxPersist();

    return Promise.resolve();
  }
}
