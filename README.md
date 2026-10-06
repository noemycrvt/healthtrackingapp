# Health & Wellness Companion App

A mobile health and wellness tracking application built with React Native and Expo. The app helps users manage medication schedules, receive medication reminders, track wellness through journaling, and view personal trends through an insights dashboard.

## Features

- **User Authentication**
  - Create an account and log in using Firebase Authentication
  - User-specific data stored securely in Firestore
- **Medication Management**
  - Create and manage recurring medication schedules
  - Set medication times, repeat days, and start/end dates
  - Mark doses as taken, skipped, or missed
  - Generate individual medication doses from recurring schedules
  - Edit or delete a medication (and its future doses)
- **Medication Reminders**
  - Local notifications for scheduled medication doses using Expo Notifications
- **Wellness Journal**
  - Record mood, pain, energy, and anxiety levels
  - Add personal notes and track medication side effects
  - View, edit, and delete previous journal entries
- **Calendar**
  - View scheduled medication doses by date
  - Browse medication activity using a calendar/agenda view
- **Insights**
  - View medication adherence trends
  - Track wellness ratings over time
  - Display data using charts

## How it works

- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) with file-based routes under `app/` — `(auth)` for login/signup, `(tabs)` for the main Home/Calendar/Insights/Journal tabs.
- **Backend**: Firebase Authentication (email/password) + Firestore. All data is scoped per user under `users/{uid}/...`:
  - `users/{uid}` — profile (name, email)
  - `users/{uid}/medicationGroups/{groupId}` — a recurring medication schedule (name, dosage, times, repeat days, start/end date)
  - `users/{uid}/medicationGroups/{groupId}/doses/{doseId}` — individual scheduled doses generated from the group, each with its own date/time and status (`pending`/`taken`/`skipped`/`missed`)
  - `users/{uid}/journalEntries/{entryId}` — wellness journal entries
  - Access is enforced by [`firestore.rules`](./firestore.rules): a user can only read/write their own data.
- **Config**: Firebase credentials are read from environment variables (`EXPO_PUBLIC_FIREBASE_*` in `.env`), not hardcoded — see [Environment setup](#2-set-up-environment-variables) below.
- **Local backend option**: a Dockerized Firebase emulator (Auth + Firestore) is included, so the app can run fully locally without any real Firebase project — see [Option B](#option-b-run-a-local-firebase-backend-recommended-for-quick-setup) below.

## Tech stack

- React Native + Expo (SDK 52)
- TypeScript
- Expo Router
- Firebase Authentication & Firestore
- NativeWind / Tailwind CSS
- Expo Notifications
- React Native Calendars
- React Native Chart Kit
- Docker (local Firebase emulator)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- For native testing: Xcode (iOS Simulator) or Android Studio — optional, the app also runs on web
- [Docker](https://www.docker.com/) — optional, only needed if you want to run the local Firebase emulator instead of a real project

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Then choose one of the two options below and fill in `.env` accordingly.

#### Option A: Use your own Firebase project

1. Create a project at the [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore Database**, then paste the contents of [`firestore.rules`](./firestore.rules) into the **Rules** tab and publish.
4. In **Project Settings → Your apps**, add a Web app and copy the config values into `.env` (`EXPO_PUBLIC_FIREBASE_*`).
5. Leave `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=false`.

#### Option B: Run a local Firebase backend (recommended for quick setup)

No real Firebase account needed — runs Auth + Firestore emulators in Docker, using the included `firestore.rules`.

```bash
docker compose up
```

In `.env`, set:

```
EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true
```

The other `EXPO_PUBLIC_FIREBASE_*` values can be left as placeholder strings in this mode. Once running:

- Firestore emulator: `localhost:8080`
- Auth emulator: `localhost:9099`
- Emulator UI (inspect/edit data in the browser): [http://localhost:4000](http://localhost:4000)

Data persists across restarts in `./emulator-data`; delete that folder for a clean slate.

### 3. Start the app

```bash
npx expo start
```

From the terminal output, you can:

- Press `w` to open in a web browser
- Press `i` to open in the iOS Simulator (requires Xcode)
- Press `a` to open in an Android emulator (requires Android Studio)
- Scan the QR code to open in [Expo Go](https://expo.dev/go) on a physical device

> As of now, the app has only been tested on **web** and the **iOS Simulator**.
