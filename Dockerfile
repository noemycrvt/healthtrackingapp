FROM node:20-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends default-jdk-headless curl \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g firebase-tools@13

WORKDIR /emulator

COPY firebase.json .firebaserc firestore.rules firestore.indexes.json ./

EXPOSE 4000 8080 9099

CMD ["firebase", "emulators:start", "--project", "demo-healthtrackingapp", "--import=./export/data", "--export-on-exit=./export/data"]
