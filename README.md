Health & Wellness Companion App

A mobile health and wellness tracking application built with React Native and Expo. The app helps users manage medication schedules, receive medication reminders, track wellness through journaling, and view personal trends through an insights dashboard.

Features:
User Authentication
   Create an account and log in using Firebase Authentication
   User-specific data stored securely in Firestore
Medication Management
   Create and manage recurring medication schedules
   Set medication times, repeat days, and start/end dates
   Mark doses as taken, skipped, or missed
   Generate individual medication doses from recurring schedules
Medication Reminders
   Local notifications for scheduled medication doses using Expo Notifications
Wellness Journal
   Record mood, pain, energy, and anxiety levels
   Add personal notes and track medication side effects
   View and manage previous journal entries
Calendar
   View scheduled medication doses by date
   Browse medication activity using a calendar/agenda view
Insights
   View medication adherence trends
   Track wellness ratings over time
   Display data using charts
   
Technologies
   React Native
   Expo
   TypeScript
   Expo Router
   Firebase Authentication
   Firebase Firestore
   NativeWind / Tailwind CSS
   Expo Notifications
   React Native Calendars
   React Native Chart Kit# Welcome to your Expo app 

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

As of now, our app has only been tested on web and IOS simulator.
