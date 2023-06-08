import React from "react";
import Blaze from "meteor/gadicc:blaze-react-component";
import "./accounts-template";

export const AccountsUI = () => {
  return (
    <div>
      <h2>Accounts UI!</h2>
      <Blaze template='accounts-template' />
    </div>
  );
};
