Package.describe({
  summary: "Login service for Microsoft accounts",
  version: "0.0.1",
});

Package.onUse((api) => {
  api.use("ecmascript");
  api.use("accounts-base", ["client", "server"]);
  // Export Accounts (etc) to packages using this one.
  api.imply("accounts-base", ["client", "server"]);

  api.use("accounts-oauth", ["client", "server"]);
  api.use("microsoft-oauth");
  api.imply("microsoft-oauth");

  api.use(["accounts-ui", "microsoft-config-ui"], ["client", "server"], {
    weak: true,
  });
  api.addFiles("notice.js");
  api.addFiles("microsoft.js");
});
