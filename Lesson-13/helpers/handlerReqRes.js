/*
 * Title : handlerReqRes handler
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routers = require("../routers");
const {
  notFoundHandler,
} = require("../handlers/routersHandlers/notFoundHandlers");
const { parseJSON } = require("./../helpers/utilities");

const handler = {};

handler.handleReqRes = (req, res) => {
  // parse all property
  const pathUrl = url.parse(req.url, true);
  const path = pathUrl.pathname;
  const trimPath = path.replace(/\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = pathUrl.query;
  const headerObject = req.headers;

  //property request
  const propertyRequest = {
    pathUrl,
    path,
    trimPath,
    method,
    queryStringObject,
    headerObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const choseHandler = routers[trimPath] ? routers[trimPath] : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    propertyRequest.body = parseJSON(realData);

    choseHandler(propertyRequest, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadStringify = JSON.stringify(payload);

      //return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadStringify);
    });
  });
};

module.exports = handler;
