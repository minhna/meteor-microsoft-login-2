if (
  Package["accounts-ui"] &&
  !Package["service-configuration"] &&
  !Object.prototype.hasOwnProperty.call(Package, "microsoft-config-ui")
) {
  console.warn(
    "Note: You're using accounts-ui and accounts-microsoft,\n" +
      "but didn't install the configuration UI for the Microsoft\n" +
      "OAuth. You can install it with:\n" +
      "\n" +
      "    meteor add microsoft-config-ui" +
      "\n"
  );
}
