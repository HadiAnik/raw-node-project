/*
 * Title : sample handler
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

const handle = {};

handle.notFoundHandler = (propertyRequest, callback) => {
  callback(404, {
    message: "This URL not found!",
  });
};

module.exports = handle;
