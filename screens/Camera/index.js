import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform, Vibration } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import { Header, GradientBackground } from '../../components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    marginTop: 15,
  },
});

export default class Home extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    onBarCodeRead: PropTypes.func.isRequired,
  };

  state = {
    hasCameraPermission: null,
    scannedText: '',
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  onBarCodeRead = e => {
    if (!this.state.scannedText) {
      this.setState(
        {
          scannedText: e.data,
        },
        () => {
          if (Platform.OS === 'ios') {
            Vibration.vibrate(500, false);
          } else {
            Vibration.vibrate([0, 500], false);
          }
          this.props.onBarCodeRead(this.state.scannedText);
          this.props.navigation.goBack();
        },
      );
    }
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            title="Scan QR code"
            onBackPress={() => this.props.navigation.goBack()}
          />
          {this.state.hasCameraPermission && (
            <BarCodeScanner
              onBarCodeRead={this.onBarCodeRead}
              style={styles.preview}
            />
          )}
        </View>
      </GradientBackground>
    );
  }
}
