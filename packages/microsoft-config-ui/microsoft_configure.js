Template.configureLoginServiceDialogForMicrosoft.helpers({
  siteUrl: () => Meteor.absoluteUrl(),
});

Template.configureLoginServiceDialogForMicrosoft.fields = () => [
  { property: "clientId", label: "Client ID" },
  { property: "secret", label: "Client Secret" },
];
