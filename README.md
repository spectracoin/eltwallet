

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

# Run project on connected iPhone or iOS simulator
$ react-native run-ios

# Run project on connected Android device or running Android simulator
$ react-native run-android
```

Have fun!
