import React from 'react';
import { StatusBar, View } from 'react-native';
import { Font } from 'expo';
import Sentry from 'sentry-expo';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import './shim';
import { persistor, store } from './config/store';
import AnalyticsUtils from './utils/analytics';
import VarelaRound from './assets/fonts/varela-round.otf';

import {
  AddToken,
  Camera,
  CreateWallet,
  Home,
  PinCode,
  PrivateKey,
  RecoverWallet,
  Settings,
  WalletHome,
  WalletReceive,
  WalletSend,
} from './screens';
import MigrationUtils from './utils/migration';

Sentry.config(
  'https://0c7d72d067e34a6bb432bdc9a91c58a5:f84ff22cb0224a428aaee5937f7c435b@sentry.io/265240',
).install();

AnalyticsUtils.initialize();

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }

  const route = navigationState.routes[navigationState.index];

  return route.routeName;
}

const Navigator = StackNavigator(
  {
    AddToken: {
      screen: AddToken,
    },
    Camera: {
      screen: withMappedNavigationProps(Camera),
    },
    CreateWallet: {
      screen: withMappedNavigationProps(CreateWallet),
    },
    Home: {
      screen: Home,
    },
    PinCode: {
      screen: PinCode,
    },
    PrivateKey: {
      screen: PrivateKey,
    },
    RecoverWallet: {
      screen: RecoverWallet,
    },
    Settings: {
      screen: Settings,
    },
    WalletHome: {
      screen: WalletHome,
    },
    WalletReceive: {
      screen: WalletReceive,
    },
    WalletSend: {
      screen: withMappedNavigationProps(WalletSend),
    },
  },
  {
    cardStyle: {
      opacity: 1,
    },
    headerMode: 'none',
    initialRouteName: 'Home',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: getSlideFromRightTransition,
  },
);

const styles = {
  container: {
    flex: 1,
  },
};

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    dataMigrated: false,
  };

  async componentDidMount() {
    this.loadFont();
    this.runMigrations();
  }

  loadFont = async () => {
    await Font.loadAsync({
      'Varela Round': VarelaRound,
    });

    this.setState({
      fontLoaded: true,
    });
  };

  runMigrations = async () => {
    await MigrationUtils.runMigration();

    this.setState({
      dataMigrated: true,
    });
  };

  render() {
    if (!this.state.fontLoaded || !this.state.dataMigrated) {
      return null;
    }

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="light-content" />
            <Navigator
              onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getCurrentRouteName(currentState);
                const prevScreen = getCurrentRouteName(prevState);

                if (prevScreen !== currentScreen) {
                  AnalyticsUtils.trackScreen(currentScreen);
                }
              }}
            />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}
