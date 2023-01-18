/*
 * Title : check handler
 * Description : Handler to handle check user define
 * Author : Hadiuzzaman
 * Date : 16/01/2023
 */
//Dependencies
const data = require("./../../lib/data");
const { createRandomString } = require("./../../helpers/utilities");
const { parseJSON } = require("./../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

const handler = {};

// data.read("test", "test", (err, data) => {
//   console.log("inside user Handler", err, data);
// });

handler.checkHandler = (propertyRequest, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(propertyRequest.method) > -1) {
    handler._check[propertyRequest.method](propertyRequest, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.post = (propertyRequest, callback) => {
  //validate inputs
  let protocol =
    typeof propertyRequest.body.protocol === "string" &&
    ["http", "https"].indexOf(propertyRequest.body.protocol) > -1
      ? propertyRequest.body.protocol
      : false;

  let url =
    typeof propertyRequest.body.url === "string" &&
    propertyRequest.body.url.trim().length > 0
      ? propertyRequest.body.url
      : false;

  let method =
    typeof propertyRequest.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(propertyRequest.body.method) > -1
      ? propertyRequest.body.method
      : false;

  let successCode =
    typeof propertyRequest.body.successCode === "object" &&
    propertyRequest.body.successCode instanceof Array
      ? propertyRequest.body.successCode
      : false;

  let timeOutSecond =
    typeof propertyRequest.body.timeOutSecond === "number" &&
    propertyRequest.body.timeOutSecond % 1 === 0 &&
    propertyRequest.body.timeOutSecond >= 1 &&
    propertyRequest.body.timeOutSecond <= 5
      ? propertyRequest.body.timeOutSecond
      : false;

  if (protocol && url && method && successCode && timeOutSecond) {
    // lookup the user phone by reading the token
    let token =
      typeof propertyRequest.headerObject.token === "string"
        ? propertyRequest.headerObject.token
        : false;

    data.read("token", token, (err1, tData) => {
      if (!err1 && tData) {
        const userPhone = parseJSON(tData).phone;
        //lookup the user data
        data.read("users", userPhone, (err2, uData) => {
          if (!err2 && uData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = parseJSON(uData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < 5) {
                  const checkId = createRandomString(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCode,
                    timeOutSecond,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "Users already reached max check limit!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication Problem",
                });
              }
            });
          } else {
            callback(404, {
              error: "Request user was not found",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication failed",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handler._check.get = (propertyRequest, callback) => {
  //check the phone number is valid
  const id =
    typeof propertyRequest.queryStringObject.id === "string" &&
    propertyRequest.queryStringObject.id.trim().length === 20
      ? propertyRequest.queryStringObject.id
      : false;

  if (id) {
    //lookup the check
    data.read("checks", id, (err1, checkData) => {
      const phone = parseJSON(checkData).userPhone;
      if (!err1 && checkData) {
        // lookup the user phone by reading the token
        let token =
          typeof propertyRequest.headerObject.token === "string"
            ? propertyRequest.headerObject.token
            : false;

        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
          if (tokenIsValid) {
            callback(200, parseJSON(checkData));
          } else {
            callback(403, {
              error: "Authentication failure!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in your request!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handler._check.put = (propertyRequest, callback) => {
  const id =
    typeof propertyRequest.body.id === "string" &&
    propertyRequest.body.id.trim().length === 20
      ? propertyRequest.body.id
      : false;

  //validate inputs
  let protocol =
    typeof propertyRequest.body.protocol === "string" &&
    ["http", "https"].indexOf(propertyRequest.body.protocol) > -1
      ? propertyRequest.body.protocol
      : false;

  let url =
    typeof propertyRequest.body.url === "string" &&
    propertyRequest.body.url.trim().length > 0
      ? propertyRequest.body.url
      : false;

  let method =
    typeof propertyRequest.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(propertyRequest.body.method) > -1
      ? propertyRequest.body.method
      : false;

  let successCode =
    typeof propertyRequest.body.successCode === "object" &&
    propertyRequest.body.successCode instanceof Array
      ? propertyRequest.body.successCode
      : false;

  let timeOutSecond =
    typeof propertyRequest.body.timeOutSecond === "number" &&
    propertyRequest.body.timeOutSecond % 1 === 0 &&
    propertyRequest.body.timeOutSecond >= 1 &&
    propertyRequest.body.timeOutSecond <= 5
      ? propertyRequest.body.timeOutSecond
      : false;

  if (id) {
    if (protocol || url || method || successCode || timeOutSecond) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObject = parseJSON(checkData);
          // lookup the user phone by reading the token
          let token =
            typeof propertyRequest.headerObject.token === "string"
              ? propertyRequest.headerObject.token
              : false;

          tokenHandler._token.verify(
            token,
            checkObject.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCode) {
                  checkObject.successCode = successCode;
                }
                if (timeOutSecond) {
                  checkObject.timeOutSecond = timeOutSecond;
                }
                //store the checkObject
                data.update("checks", id, checkObject, (err2) => {
                  if (!err2) {
                    callback(200, checkObject);
                  } else {
                    callback(400, {
                      error: "There was a problem in server side error!",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: "Authentication failure!",
                });
              }
            }
          );
        } else {
          callback(400, {
            error: "There was a problem in server side!",
          });
        }
      });
    } else {
      callback(400, {
        error: "You must provide at least one field to update!",
      });
    }
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handler._check.delete = (propertyRequest, callback) => {
  //check the phone number is valid
  const id =
    typeof propertyRequest.queryStringObject.id === "string" &&
    propertyRequest.queryStringObject.id.trim().length === 20
      ? propertyRequest.queryStringObject.id
      : false;

  if (id) {
    //lookup the check
    data.read("checks", id, (err1, checkData) => {
      const phone = parseJSON(checkData).userPhone;
      if (!err1 && checkData) {
        // lookup the user phone by reading the token
        let token =
          typeof propertyRequest.headerObject.token === "string"
            ? propertyRequest.headerObject.token
            : false;

        tokenHandler._token.verify(token, phone, (tokenIsValid) => {
          if (tokenIsValid) {
            // delete the check data
            data.delete("checks", id, (err2) => {
              if (!err2) {
                data.read("users", phone, (err3, userData) => {
                  let userObject = parseJSON(userData);
                  if (!err3 && userData) {
                    let userChecks =
                      typeof userObject.checks === "object" &&
                      userObject.checks instanceof Array
                        ? userObject.checks
                        : false;
                    let checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      //re save the user data
                      userObject.checks = userChecks;
                      data.update("users", phone, userObject, (err4) => {
                        if (!err4) {
                          callback(200);
                        } else {
                          callback(500, {
                            error: "There is a server side problem!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error:
                          "The check id that you are trying to remove is not found in user!",
                      });
                    }
                  } else {
                    callback(500, {
                      error: "There is a server side error!",
                    });
                  }
                });
              } else {
                callback(500, {
                  error: "There is a server side error!",
                });
              }
            });
          } else {
            callback(403, {
              error: "Authentication failure!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in your request!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

module.exports = handler;
