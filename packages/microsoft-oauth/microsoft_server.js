Microsoft = {};

OAuth.registerService("microsoft", 2, null, async (query) => {
  const accessToken = await getAccessToken(query);
  const identity = await getIdentity(accessToken);
  const emails = await getEmails(accessToken);
  const primaryEmail = emails.find((email) => email.primary);

  return {
    serviceData: {
      id: identity.id,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity.email || (primaryEmail && primaryEmail.email) || "",
      username: identity.login,
      name: identity.name,
      avatar: identity.avatar_url,
      company: identity.company,
      blog: identity.blog,
      location: identity.location,
      bio: identity.bio,
      emails,
    },
    options: { profile: { name: identity.name } },
  };
});

let userAgent = "Meteor";
if (Meteor.release) userAgent += `/${Meteor.release}`;

const getAccessToken = async (query) => {
  const config = ServiceConfiguration.configurations.findOne({
    service: "microsoft",
  });
  if (!config) throw new ServiceConfiguration.ConfigError();

  let response;
  try {
    const tenant = config.tenantId; // common, organizations, consumers
    const content = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.secret,
      scope: `https://graph.microsoft.com/.default`,
      grant_type: `client_credentials`,
    });
    console.log("post content", content.toString());
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
    console.log("response:", response);
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
    const request = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": userAgent,
        Authorization: `token ${accessToken}`,
      }, // http://developer.github.com/v3/#user-agent-required
    });
    return await request.json();
  } catch (err) {
    throw Object.assign(
      new Error(`Failed to fetch identity from Microsoft. ${err.message}`),
      { response: err.response }
    );
  }
};

const getEmails = async (accessToken) => {
  try {
    const request = await fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        Accept: "application/json",
        Authorization: `token ${accessToken}`,
      }, // http://developer.github.com/v3/#user-agent-required
    });
    return await request.json();
  } catch (err) {
    return [];
  }
};

Microsoft.retrieveCredential = (credentialToken, credentialSecret) =>
  OAuth.retrieveCredential(credentialToken, credentialSecret);
