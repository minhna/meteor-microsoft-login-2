import { fetch } from "meteor/fetch";

const hasOwn = Object.prototype.hasOwnProperty;

Microsoft = {};

Microsoft.whitelistedFields = [
  "email",
  "name",
  "family_name",
  "given_name",
  "middle_name",
  "nickname",
  "preferred_username",
  "profile",
  "picture",
  "website",
  "gender",
  "birthdate",
  "zoneinfo",
  "locale",
];

OAuth.registerService("microsoft", 2, null, async (query) => {
  const accessToken = await getAccessToken(query);
  const identity = await getIdentity(accessToken);

  const fields = {};
  Microsoft.whitelistedFields.forEach(function (name) {
    if (hasOwn.call(identity, name)) {
      fields[name] = identity[name];
    }
  });

  return {
    serviceData: {
      ...fields,
      id: identity.email,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email,
    },
    options: identity.name ? { profile: { name: identity.name } } : undefined,
  };
});

let userAgent = "Meteor";
if (Meteor.release) userAgent += `/${Meteor.release}`;

const getAccessToken = async (query) => {
  console.log("getAccessToken, query", query);

  const config = ServiceConfiguration.configurations.findOne({
    service: "microsoft",
  });
  if (!config) throw new ServiceConfiguration.ConfigError();

  let response;
  try {
    const tenant = "common"; // common, organizations, consumers
    const scopes = ["openid", "email", "profile"];
    const content = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.secret,
      scope: scopes.join(" "),
      grant_type: `authorization_code`,
      code: query.code,
      redirect_uri: OAuth._redirectUri("microsoft", config),
      state: query.state,
    });
    console.log("getAccessToken, post content", content.toString());
    const request = await fetch(
      `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "User-Agent": userAgent,
        },
        body: content,
      }
    );
    response = await request.json();
    console.log("getAccessToken, response:", response);
  } catch (err) {
    throw Object.assign(
      new Error(
        `Failed to complete OAuth handshake with Microsoft. ${err.message}`
      ),
      { response: err.response }
    );
  }
  if (response.error) {
    // if the http response was a json object with an error attribute
    throw new Error(
      `Failed to complete OAuth handshake with Microsoft. ${response.error}`
    );
  } else {
    return response.access_token;
  }
};

const getIdentity = async (accessToken) => {
  try {
    console.log("getIdentity request", { accessToken });
    const request = await fetch("https://graph.microsoft.com/oidc/userinfo", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": userAgent,
        Authorization: `Bearer ${accessToken}`,
      }, // https://learn.microsoft.com/en-us/azure/active-directory/develop/userinfo#calling-the-api
    });
    const response = await request.json();
    console.log("getIdentity response", response);
    return response;
  } catch (err) {
    throw Object.assign(
      new Error(`Failed to fetch identity from Microsoft. ${err.message}`),
      { response: err.response }
    );
  }
};

Microsoft.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);
