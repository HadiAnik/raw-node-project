/*
 * Title : sample handler
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const handler = {};

handler.sampleHandler = (requestProperty, callback) => {
  console.log(requestProperty);
  callback(200, {
    message: "This is sample data url!",
  });
};

module.exports = handler;
