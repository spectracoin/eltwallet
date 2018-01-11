<div align="center">
  <p>
    <img src="assets/logo.png" width="250" />
  </p>
  <p>
    ✨ Ethereum and ERC20 tokens wallet built by ELTCOIN ✨
  </p>
  <p>
  <a href="https://play.google.com/store/apps/details?id=tech.eltcoin.eltwallet">
    <img src="assets/google-play.png" width="110"/>
  </a>
  </p>
</div>

## Features

* 🔩 <strong>Simple: </strong>Bootstrapped with
  [react-native-cli](https://github.com/facebook/react-native)

* 💯 <strong>State of the art: </strong> Wallet generation using
  [react-native-randombytes](https://github.com/mvayngrib/react-native-randombytes)
  using native code

## Demo

<div align="center">
  <img src="assets/demo.gif" height="300" />
</div>

## Local development

Make sure you have `react-native-cli` installed.

```bash
# Install dependencies
$ npm install

# Hack for NodeJS dependencies
$ ./node_modules/.bin/rn-nodeify --hack --install "assert, crypto, stream, events, vm"

# Install dependencies for iOS
$ cd ios
$ pod install

# Run the project in XCode or Android Studio
```

Have fun!
