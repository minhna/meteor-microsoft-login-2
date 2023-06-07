Microsoft = {};

// Request Microsoft credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Microsoft.requestCredential = (options, credentialRequestCompleteCallback) => {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === "function") {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({
    service: "microsoft",
  });
  if (!config) {
    credentialRequestCompleteCallback &&
      credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }
  const credentialToken = Random.secret();

  const loginStyle = OAuth._loginStyle("microsoft", config, options);

  const loginUrl =
    `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token` +
    `?client_id=${config.clientId}` +
    `?client_secret=${config.secret}` +
    `&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default` +
    `&grant_type=client_credentials`;

  OAuth.launchLogin({
    loginService: "microsoft",
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
    popupOptions: { width: 900, height: 450 },
  });
};
