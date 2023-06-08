import React from "react";
import Blaze from "meteor/gadicc:blaze-react-component";
// require("./accounts-template");

export const AccountsUI = () => {
  return (
    <div>
      <h2>Accounts UI!</h2>
      <Blaze template='loginButtons' />
    </div>
  );
};
