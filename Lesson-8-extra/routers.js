/*
 * Title : routers handler
 * Description : this is routers handler
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const handler = {};

handler.sampleHandler = () => {
  console.log("This is sample handler");
};

module.exports = handler;

const { sampleHandler } = require("./handlers/routersHandlers/sampleHandler");

const routers = {
  sample: sampleHandler,
};

module.exports = routers;
