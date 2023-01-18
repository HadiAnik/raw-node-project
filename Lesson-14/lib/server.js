/*
 * Title : Server library
 * Description : server related file
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

//Dependencies
const http = require("http");
const { handleReqRes } = require("./../helpers/handlerReqRes");
const environmentToExport = require("./../helpers/environment");
// const data = require("./lib/data");

//module scaffolding
const server = {};

// module config
server.config = {
  port: 3000,
};

// const data1 = {
//   name: "India",
//   language: ["Bangla", "Hindi", "Urdhu", "Telegu", "English", "Telegu"],
// };

// data.create("test", "test", data1, (err) => {
//   console.log(err);
// });

// data.read("test", "test", (err, data) => {
//   console.log(err, data);
// });

// data.update("test", "test", data1, (err) => {
//   console.log(err);
// });

// data.delete("test", "test", (err) => {
//   console.log(err);
// });

//create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleReqRes);
  createServerVariable.listen(environmentToExport.port, () => {
    console.log("Listening on port: ", environmentToExport.port);
  });
};

// handle req res
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
  server.createServer();
};

module.exports = server;
