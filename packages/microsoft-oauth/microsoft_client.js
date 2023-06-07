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

  // we need the email scope to get user id from google.
  const requiredScopes = {
    openid: 1,
    "https://graph.microsoft.com/.default": 1,
  };
  let scopes = options.requestPermissions || ["openid"];
  scopes.forEach((scope) => (requiredScopes[scope] = 1));
  scopes = Object.keys(requiredScopes);

  const loginUrlParameters = {};
  if (config.loginUrlParameters) {
    Object.assign(loginUrlParameters, config.loginUrlParameters);
  }
  if (options.loginUrlParameters) {
    Object.assign(loginUrlParameters, options.loginUrlParameters);
  }

  const loginStyle = OAuth._loginStyle("microsoft", config, options);

  Object.assign(loginUrlParameters, {
    response_type: "id_token+token",
    client_id: config.clientId,
    scope: scopes.join(" "), // space delimited
    redirect_uri: OAuth._redirectUri("microsoft", config),
    response_mode: "fragment",
    state: OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl),
    nonce: credentialToken,
  });
  const loginUrl =
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
    Object.keys(loginUrlParameters)
      .map(
        (param) =>
          `${encodeURIComponent(param)}=${encodeURIComponent(
            loginUrlParameters[param]
          )}`
      )
      .join("&");

  OAuth.launchLogin({
    loginService: "microsoft",
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
    popupOptions: { width: 900, height: 450 },
  });
};
