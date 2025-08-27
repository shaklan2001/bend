const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Configure for expo-router
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: './global.css' })
