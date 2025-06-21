const express = require('express');
const bodyParser = require('body-parser');
const { dialogflow } = require('actions-on-google');
const admin = require('firebase-admin');

const serviceAccount = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
  );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://home-automation-6f6e0-default-rtdb.firebaseio.com/"
});


const db = admin.database();
const app = dialogflow({ debug: true });

// Intent 1: override_toggle
app.intent('override_toggle', (conv, { state }) => {
  const val = (state === 'on');
  return db.ref('/override').set(val).then(() => {
    conv.close(`Override turned ${state}`);
  });
});

// Intent 2: alarm_toggle
app.intent('alarm_toggle', (conv, { state }) => {
  const val = (state === 'on');
  return db.ref('/alarm').set(val).then(() => {
    conv.close(`Alarm turned ${state}`);
  });
});

// Express setup
const server = express().use(bodyParser.json());
server.post('/', app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
