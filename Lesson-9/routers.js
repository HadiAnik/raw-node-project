/*
 * Title : router handler
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */
const { simpleHandler } = require("./handlers/routersHandlers/simpleHandlers");
const { userHandler } = require("./handlers/routersHandlers/userHandler");
const { tokenHandler } = require("./handlers/routersHandlers/tokenHandler");

const routers = {
  simple: simpleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routers;
