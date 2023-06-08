import React from "react";

import { Hello } from "./Hello.jsx";
import { Info } from "./Info.jsx";
import { AccountsUI } from "./accounts.jsx";

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <Hello />
    <Info />
    <AccountsUI />
  </div>
);
