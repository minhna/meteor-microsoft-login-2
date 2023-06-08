import { WebApp } from "meteor/webapp";

WebApp.connectHandlers.use("/", async (req, res, next) => {
  console.log("req", req);
  next();
});
