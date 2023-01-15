/*
 * Title : Uptime Monitoring Application
 * Description : A RESTFul API to monitor up or down time of user defined Links
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */
const http = require("http");
const { handlerReqRes } = require("./helpers/handleReqRes");

const app = {};

app.config = {
  port: 5000,
};

app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log("listening to port: ", app.config.port);
  });
};

app.handleReqRes = handlerReqRes;

app.createServer();
