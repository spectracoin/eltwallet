import {
  ADD_TOKEN,
  LOGOUT,
  SET_CALL_TO_ACTION_DISMISSED,
  SELECT_TOKEN,
  SET_PIN_CODE,
  SET_PRIVATE_KEY,
  SET_WALLET_ADDRESS,
} from './actionTypes';
import { defaultTokens } from '../utils/constants';
import AnalyticsUtils from '../utils/analytics';

const defaultState = {
  availableTokens: defaultTokens,
  callToActionDismissed: false,
  selectedToken: defaultTokens[0],
};

const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      AnalyticsUtils.trackEvent('Add custom token', {
        contractAddress: action.token.contractAddress,
        decimals: action.token.decimals,
        name: action.token.name,
        symbol: action.token.symbol,
      });

      return {
        ...state,
        availableTokens: state.availableTokens.concat([action.token]),
        selectedToken: action.token,
      };
    case SET_CALL_TO_ACTION_DISMISSED:
      return {
        ...state,
        callToActionDismissed: true,
      };
    case SELECT_TOKEN:
      return {
        ...state,
        selectedToken: action.token,
      };
    case SET_PIN_CODE:
      return {
        ...state,
        pinCode: action.pinCode,
      };
    case SET_PRIVATE_KEY:
      return {
        ...state,
        privateKey: action.privateKey,
      };
    case SET_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: action.walletAddress,
      };
    default:
      return state;
  }
};

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }

  return appReducer(state, action);
};

export { defaultState, rootReducer };
