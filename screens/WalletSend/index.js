import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GradientBackground, Header, SecondaryButton } from '../../components';
import Form from './components/Form';
import AnalyticsUtils from '../../utils/analytics';
import WalletUtils from '../../utils/wallet';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 40,
  },
});

class WalletSend extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    selectedToken: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
    }).isRequired,
  };

  state = {
    address: '',
    amount: '',
    isLoading: false,
  };

  onBarCodeRead = address => {
    AnalyticsUtils.trackEvent('Read send address QR code');

    this.setState({
      address,
    });
  };

  onCameraPress = () => {
    this.props.navigation.navigate('Camera', {
      onBarCodeRead: this.onBarCodeRead,
    });
  };

  addressIsValid = () => /^0x([A-Fa-f0-9]{40})$/.test(this.state.address);

  amountIsValid = () => parseFloat(this.state.amount, 10) > 0;

  sendTransaction = async () => {
    try {
      this.setState({
        isLoading: true,
      });

      await WalletUtils.sendTransaction(
        this.props.selectedToken,
        this.state.address,
        this.state.amount,
      );

      this.setState(
        {
          isLoading: false,
        },
        () => {
          Alert.alert(
            `Sending ${this.props.selectedToken.symbol}`,
            `You've successfully sent ${this.state.amount} ${
              this.props.selectedToken.symbol
            } to ${this.state.address}`,
          );
        },
      );

      this.props.navigation.goBack();
    } catch (error) {
      this.setState(
        {
          isLoading: false,
        },
        () => {
          Alert.alert(
            `Sending ${this.props.selectedToken.symbol}`,
            `An error happened during the transaction, please try again later`,
          );
        },
      );
    }
  };

  render() {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Header
            onBackPress={() => this.props.navigation.goBack()}
            title="Send"
          />
          <Form
            address={this.state.address}
            amount={this.state.amount}
            onAddNewToken={() => this.props.navigation.navigate('AddToken')}
            onAddressChange={address => this.setState({ address })}
            onAmountChange={amount => this.setState({ amount })}
            onCameraPress={this.onCameraPress}
            selectedToken={this.props.selectedToken}
          />
          <View style={styles.buttonContainer}>
            <SecondaryButton
              disabled={!this.addressIsValid() || !this.amountIsValid()}
              isLoading={this.state.isLoading}
              onPress={this.sendTransaction}
              text="Send"
            />
          </View>
        </View>
      </GradientBackground>
    );
  }
}

const mapStateToProps = state => ({
  selectedToken: state.selectedToken,
});

export default connect(mapStateToProps)(WalletSend);
