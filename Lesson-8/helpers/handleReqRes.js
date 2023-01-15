/*
 * Title : Uptime Monitoring Application
 * Description : A RESTFul API to monitor up or down time of user defined Links
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routs");
const {
  notFoundHandler,
} = require("../handlers/routesHandlers/notFountHandler");

//model scaffolding
const handler = {};

handler.handlerReqRes = (req, res) => {
  // request handling
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimPath = path.replace(/\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headersObject = req.headers;
  const data = req.body;

  const requestProperty = {
    parseUrl,
    path,
    trimPath,
    method,
    queryStringObject,
    headersObject,
    data,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimPath] ? routes[trimPath] : notFoundHandler;

  chosenHandler(requestProperty, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};

    const payloadString = JSON.stringify(payload);

    //return the final response
    res.writeHead(statusCode);
    res.end(payloadString);
  });

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    console.log(realData);
    //response handle
    res.end("Hello World!");
  });
};

module.exports = handler;
