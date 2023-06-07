Template.configureLoginServiceDialogForMicrosoft.helpers({
  siteUrl: () => Meteor.absoluteUrl(),
});

Template.configureLoginServiceDialogForMicrosoft.fields = () => [
  { property: "tenantId", label: "Tenant ID" },
  { property: "clientId", label: "Client ID" },
  { property: "secret", label: "Client Secret" },
];
