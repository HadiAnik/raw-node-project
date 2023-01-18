/*
 * Title : not found handler
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const handler = {};

handler.simpleHandler = (propertyRequest, callback) => {
  callback(200, {
    message: "This is simple URL.",
  });
};

module.exports = handler;
