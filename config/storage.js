import { SecureStore } from 'expo';

const noop = () => null;

export default class ReduxPersistExpoSecureStoreStorage {
  static async getItem(key, callback = noop) {
    try {
      // getItem() returns `null` on Android and `undefined` on iOS;
      // explicitly return `null` here as `undefined` causes an exception
      // upstream.
      let result = await SecureStore.getItemAsync(key);

      if (typeof result === 'undefined') {
        result = null;
      }

      callback(null, result);

      return result;
    } catch (error) {
      callback(error);
      throw error;
    }
  }

  static async setItem(key, value, callback = noop) {
    try {
      await SecureStore.setItemAsync(key, value);
      callback(null);
    } catch (error) {
      callback(error);
      throw error;
    }
  }

  static async removeItem(key, callback = noop) {
    try {
      await SecureStore.deleteItemAsync(key);
      callback(null);
    } catch (error) {
      callback(error);
      throw error;
    }
  }
}
