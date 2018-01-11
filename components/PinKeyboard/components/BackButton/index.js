import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Fingerprint } from 'expo';
import Text from '../../../Text';
import arrowIcon from './images/arrow.png';
import touchIdIcon from './images/touchid.png';

const styles = StyleSheet.create({
  keyboardKey: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 20,
  },
  textPlaceholder: {
    color: 'transparent',
    fontSize: 40,
  },
  arrowKey: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    height: 24,
    width: 24,
  },
  touchIdIcon: {
    height: 40,
    width: 40,
  },
});

export default class PinKeyboard extends Component {
  static propTypes = {
    onBackPress: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func,
    showBackButton: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onAuthSuccess: null,
  };

  state = {
    isTouchIdSupported: false,
  };

  componentDidMount() {
    if (this.props.onAuthSuccess) {
      this.checkTouchIdSupport();
    }
  }

  onTouchIdClick = async () => {
    try {
      await Fingerprint.authenticateAsync('Wallet access');

      this.props.onAuthSuccess();
    } catch (error) {
      // An error happened during biometric auth
    }
  };

  checkTouchIdSupport = async () => {
    try {
      const hasHardware = await Fingerprint.hasHardwareAsync();

      if (!hasHardware) {
        this.setState({
          isTouchIdSupported: false,
        });
        return;
      }

      const isEnrolled = await Fingerprint.isEnrolledAsync();

      if (isEnrolled) {
        this.setState({
          isTouchIdSupported: true,
        });
        this.onTouchIdClick();
        return;
      }

      this.setState({
        isTouchIdSupported: false,
      });
    } catch (error) {
      // Biometric auth is not supported
    }
  };

  render() {
    if (this.props.showBackButton) {
      return (
        <TouchableOpacity
          style={[styles.keyboardKey, styles.arrowKey]}
          onPress={() => {
            this.props.onBackPress();
          }}
        >
          <Image source={arrowIcon} style={styles.arrowIcon} />
        </TouchableOpacity>
      );
    } else if (this.state.isTouchIdSupported) {
      return (
        <TouchableOpacity
          style={[styles.keyboardKey, styles.arrowKey]}
          onPress={() => {
            this.onTouchIdClick();
          }}
        >
          <Image source={touchIdIcon} style={styles.touchIdIcon} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.keyboardKey}>
        <Text style={styles.textPlaceholder}>0</Text>
      </TouchableOpacity>
    );
  }
}
