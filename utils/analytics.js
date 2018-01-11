import { AsyncStorage } from 'react-native';
import { Segment } from 'expo';
import { store } from '../config/store';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export default class AnalyticsUtils {
  static async getAnalyticsUserId() {
    const userId = store.getState().walletAddress;

    if (userId) {
      return userId;
    }

    let anonymousId = await AsyncStorage.getItem('@ELTWALLET:anonymousId');

    if (anonymousId) {
      return anonymousId;
    }

    anonymousId = guid();

    await AsyncStorage.setItem('@ELTWALLET:anonymousId', anonymousId);

    return anonymousId;
  }

  static initialize() {
    Segment.initialize({
      androidWriteKey: 'RFVONRbwMfe12Asdr0hgywhxsqgxyaaO',
      iosWriteKey: 'RFVONRbwMfe12Asdr0hgywhxsqgxyaaO',
    });

    this.identify();
  }

  static async identify() {
    const userId = await this.getAnalyticsUserId();

    Segment.identify(userId);
  }

  static async trackEvent(event, properties) {
    if (properties) {
      Segment.trackWithProperties(event, properties);
    } else {
      Segment.track(event);
    }
  }

  static trackScreen(screenName) {
    Segment.screen(screenName);
  }
}
