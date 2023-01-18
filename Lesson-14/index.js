/*
 * Title : URL checker up or down URL
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

//Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handlerReqRes");
const environmentToExport = require("./helpers/environment"); //environmentToExport
const { sendTwilioSms } = require("./helpers/notification");
// const data = require("./lib/data");

//module scaffolding
const app = {};

// @TODO remove later
sendTwilioSms("01315789253", "Hello World! Khalid", (err) => {
  console.log(`This is the error`, err);
});

// module config
app.config = {
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
app.server = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environmentToExport.port, () => {
    console.log("Listening on port: ", environmentToExport.port);
  });
};

// handle req res
app.handleReqRes = handleReqRes;

// run server
app.server();
