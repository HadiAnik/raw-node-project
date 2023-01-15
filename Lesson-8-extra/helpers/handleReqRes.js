/*
 * Title : Uptime Monitoring Application
 * Description : A RESTFul API to monitor up or down time of user defined Links
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const url = require("url");
const { StringDecoder } = require("string_decoder");
const routers = require("../routers");
const {
  notFoundHandler,
} = require("../handlers/routersHandlers/notFoundHandler");

const handler = {};

handler.handlerReqRes = (req, res) => {
  // request handling
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimPath = path.replace(/\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headersObject = req.headers;
  // const data = req.body;

  const requestProperty = {
    parseUrl,
    path,
    trimPath,
    method,
    queryStringObject,
    headersObject,
    // data,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routers[trimPath] ? routers[trimPath] : notFoundHandler;
  chosenHandler(requestProperty, (statusCode, payload) => {
    statusCode = typeof statusCode === "number" ? statusCode : 500;
    payload = typeof payload === "object" ? payload : {};

    const payloadStringify = JSON.stringify(payload);

    res.writeHead(statusCode);
    res.end(payloadStringify);
  });

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    console.log(realData);
    res.end("Hello World!");
  });
};

module.exports = handler;
