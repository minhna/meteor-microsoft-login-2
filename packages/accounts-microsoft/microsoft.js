Accounts.oauth.registerService("microsoft");

if (Meteor.isClient) {
  const loginWithMicrosoft = (options, callback) => {
    // support a callback without options
    if (!callback && typeof options === "function") {
      callback = options;
      options = null;
    }

    const credentialRequestCompleteCallback =
      Accounts.oauth.credentialRequestCompleteHandler(callback);
    Microsoft.requestCredential(options, credentialRequestCompleteCallback);
  };
  Accounts.registerClientLoginFunction("microsoft", loginWithMicrosoft);
  Meteor.loginWithMicrosoft = (...args) =>
    Accounts.applyLoginFunction("microsoft", args);
} else {
  Accounts.addAutopublishFields({
    // not sure whether the microsoft api can be used from the browser,
    // thus not sure if we should be sending access tokens; but we do it
    // for all other oauth2 providers, and it may come in handy.
    forLoggedInUser: ["services.microsoft"],
    forOtherUsers: ["services.microsoft.email"],
  });
}
