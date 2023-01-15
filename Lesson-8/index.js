/*
 * Title : Uptime Monitoring Application
 * Description : A RESTFul API to monitor up or down time of user defined Links
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

//Dependencies
const http = require("http");
const { handlerReqRes } = require("./helpers/handleReqRes");

// app object - module scaffolding
const app = {};

//configuration
app.config = {
  port: 5000,
};

// create server
app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(app.config.port, () => {
    console.log("listening to port: ", app.config.port);
  });
};

//handle Request Response
app.handleRequest = handlerReqRes;

// start the server
app.createServer();
