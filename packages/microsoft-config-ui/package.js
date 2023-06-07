Package.describe({
  summary: "Blaze configuration templates for Microsoft OAuth.",
  version: "0.0.1",
});

Package.onUse((api) => {
  api.use("ecmascript", "client");
  api.use("templating@1.4.0", "client");
  api.addFiles("microsoft_login_button.css", "client");
  api.addFiles(
    ["microsoft_configure.html", "microsoft_configure.js"],
    "client"
  );
});
