/*
 * Title : not found handler
 * Description : this is 404 not found handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const handler = {};

handler.notFoundHandler = (requestProperty, callback) => {
  callback(404, {
    message: "Your request URL was not found!",
  });
};

module.exports = handler;
