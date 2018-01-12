import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import PropTypes from 'prop-types';
import { Text } from '../../../../components';
import { SELECT_TOKEN } from '../../../../config/actionTypes';
import switchIcon from './images/switch.png';
import settingsIcon from './images/settings.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
  },
  balanceContainer: {
    flexDirection: 'row',
  },
  balance: {
    color: '#fff',
    fontSize: 30,
    letterSpacing: 3,
    paddingRight: 5,
  },
  coinSymbol: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 15,
    letterSpacing: 3,
    paddingBottom: 4,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  switchIcon: {
    height: 24,
    marginRight: 20,
    marginTop: 1,
    width: 24,
  },
  tokenPicker: {
    position: 'absolute',
    top: 0,
    width: 1000,
    height: 1000,
  },
  settingsIcon: {
    height: 24,
    width: 24,
  },
});

class BalanceRow extends Component {
  static propTypes = {
    availableTokens: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
      }),
    ).isRequired,
    currentBalance: PropTypes.number.isRequired,
    onAddNewToken: PropTypes.func.isRequired,
    onTokenChange: PropTypes.func.isRequired,
    onSettingsIconPress: PropTypes.func.isRequired,
    selectedToken: PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired,
    showActionSheetWithOptions: PropTypes.func.isRequired,
  };

  onTokenChange = index => {
    if (index === this.props.availableTokens.length) {
      this.props.onAddNewToken();
      return;
    }

    const selectedToken = this.props.availableTokens[index];

    this.props.onTokenChange(selectedToken);
  };

  showActionSheet = () => {
    this.props.showActionSheetWithOptions(
      {
        options: this.props.availableTokens
          .map(token => token.name)
          .concat(['Add new token']),
      },
      this.onTokenChange,
    );
  };

  render() {
    const { currentBalance, selectedToken, onSettingsIconPress } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balance} letterSpacing={1}>
            {currentBalance.toFixed(2)}
          </Text>
          <Text style={styles.coinSymbol} letterSpacing={2}>
            {selectedToken.symbol}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity
            onPress={this.showActionSheet}
            style={{ borderWidth: 0 }}
          >
            <Image source={switchIcon} style={styles.switchIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsIconPress}>
            <Image source={settingsIcon} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  availableTokens: state.availableTokens,
  selectedToken: state.selectedToken,
});

const mapDispatchToProps = dispatch => ({
  onTokenChange: token => dispatch({ type: SELECT_TOKEN, token }),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  connectActionSheet(BalanceRow),
);
