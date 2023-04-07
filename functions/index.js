const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addCurrency = functions.https.onCall((data, context) => {
  const {email, currency} = data;
  try {
    return admin.auth().getUserByEmail(email).then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        currency: currency,
      }).then(() => {
        return "Success!. Currency added";
      }).catch((error) => {
        return error;
      });
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getCurrency = functions.https.onCall((data, context) => {
  const {email} = data;
  return admin.auth().getUserByEmail(email).then((user) => {
    const currency = user.customClaims.currency;
    return currency;
  }).catch((error) => {
    console.log(error);
    return null;
  });
});

exports.changeCurrency = functions.https.onCall((data, context) => {
  const {email, currency} = data;
  if (!context.auth) {
    throw new functions.https.HttpsError("permission-denied", "Only admins can update custom claims");
  }
  return admin.auth().getUserByEmail(email).then((user) => {
    const currentClaims = user.customClaims || {};
    currentClaims.currency = currency;
    return admin.auth().setCustomUserClaims(user.uid, currentClaims)
        .then(() => "Success! Currency changed").catch((error) => error);
  });
});

exports.test = functions.https.onCall((data, context) => {
  const email = data.email;
  return `test ${email}`;
});


