import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import {
  GradientBackground,
  PrimaryButton,
  SecondaryButton,
} from '../../components';
import logo from './images/logo.png';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: '65%',
  },
  buttonsContainer: {
    width: '100%',
  },
});

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    walletAddress: PropTypes.string,
  };

  static defaultProps = {
    walletAddress: '',
  };

  componentDidMount() {
    if (this.props.walletAddress) {
      this.props.navigation.dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'PinCode' })],
        }),
      );
    }
  }

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              onPress={() => this.props.navigation.navigate('CreateWallet')}
              text="Create wallet"
            />
            <SecondaryButton
              onPress={() =>
                this.props.navigation.navigate('CreateWallet', {
                  recoverMode: true,
                })
              }
              text="Recover wallet"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  walletAddress: state.walletAddress,
});

export default connect(mapStateToProps)(Home);
