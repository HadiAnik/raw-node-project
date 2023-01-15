/*
 * Title : Uptime Monitoring Application
 * Description : A RESTFul API to monitor up or down time of user defined Links
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const handler = {};

handler.sampleHandlers = (requestProperty, callback) => {
  console.log(requestProperty);
  callback(200, {
    message: "This is a sample url",
  });
};

module.exports = handler;
