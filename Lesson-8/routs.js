/*
 * Title : Routs
 * Description : Application Routes
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

// Dependencies
const { sampleHandlers } = require("./handlers/routesHandlers/sampleHandlers");

const routes = {
  sample: sampleHandlers,
};

module.exports = routes;
