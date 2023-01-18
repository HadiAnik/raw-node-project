/*
 * Title : UInitial Project
 * Description : Initial file to start the node server and workers
 * Author : Hadiuzzaman
 * Date : 18/01/2023
 */

//Dependencies
const server = require("./lib/server");
const workers = require("./lib/worker");

//module scaffolding
const app = {};

app.init = () => {
  //start the server
  server.init();

  // start the worker
  workers.init();
};

app.init();

//export the app
module.exports = app;
