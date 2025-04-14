// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add `.db` to supported assets (e.g., if you ship a SQLite DB)
config.resolver.assetExts.push('db');

// Apply NativeWind plugin
const finalConfig = withNativeWind(config, {
  input: "./global.css", // Adjust path if needed
});

module.exports = finalConfig;
