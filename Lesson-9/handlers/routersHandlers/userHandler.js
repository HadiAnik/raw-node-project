/*
 * Title : User handler
 * Description : Handler to handle user
 * Author : Hadiuzzaman
 * Date : 16/01/2023
 */
//Dependencies
const data = require("./../../lib/data");
const { hash } = require("./../../helpers/utilities");
const { parseJSON } = require("./../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

const handler = {};

// data.read("test", "test", (err, data) => {
//   console.log("inside user Handler", err, data);
// });

handler.userHandler = (propertyRequest, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(propertyRequest.method) > -1) {
    handler._users[propertyRequest.method](propertyRequest, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

handler._users.post = (propertyRequest, callback) => {
  const firstName =
    typeof propertyRequest.body.firstName === "string" &&
    propertyRequest.body.firstName.trim().length > 0
      ? propertyRequest.body.firstName
      : false;
  const lastName =
    typeof propertyRequest.body.lastName === "string" &&
    propertyRequest.body.lastName.trim().length > 0
      ? propertyRequest.body.lastName
      : false;
  const phone =
    typeof propertyRequest.body.phone === "string" &&
    propertyRequest.body.phone.trim().length === 11
      ? propertyRequest.body.phone
      : false;
  const password =
    typeof propertyRequest.body.password === "string" &&
    propertyRequest.body.password.trim().length > 0
      ? propertyRequest.body.password
      : false;
  const tosAgreement =
    typeof propertyRequest.body.tosAgreement === "boolean" &&
    propertyRequest.body.tosAgreement
      ? propertyRequest.body.tosAgreement
      : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err1) => {
      if (err1) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        //store the user to DB
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was created successfully.",
            });
          } else {
            callback(500, {
              error: "Could not create User!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in server side!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

handler._users.get = (propertyRequest, callback) => {
  //check the phone number is valid
  const phone =
    typeof propertyRequest.queryStringObject.phone === "string" &&
    propertyRequest.queryStringObject.phone.trim().length === 11
      ? propertyRequest.queryStringObject.phone
      : false;

  if (phone) {
    //verify token
    let token =
      typeof propertyRequest.headerObject.token === "string"
        ? propertyRequest.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        //loopUp the user
        data.read("users", phone, (err, u) => {
          if (!err && u) {
            const user = { ...parseJSON(u) };
            delete user.password;
            callback(200, user);
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
    callback(404, {
      error: "Request user was not found",
    });
  }
};

handler._users.put = (propertyRequest, callback) => {
  const phone =
    typeof propertyRequest.body.phone === "string" &&
    propertyRequest.body.phone.trim().length === 11
      ? propertyRequest.body.phone
      : false;
  const firstName =
    typeof propertyRequest.body.firstName === "string" &&
    propertyRequest.body.firstName.trim().length > 0
      ? propertyRequest.body.firstName
      : false;
  const lastName =
    typeof propertyRequest.body.lastName === "string" &&
    propertyRequest.body.lastName.trim().length > 0
      ? propertyRequest.body.lastName
      : false;
  const password =
    typeof propertyRequest.body.password === "string" &&
    propertyRequest.body.password.trim().length > 0
      ? propertyRequest.body.password
      : false;

  if (phone) {
    if (firstName || lastName || password) {
      //verify token
      let token =
        typeof propertyRequest.headerObject.token === "string"
          ? propertyRequest.headerObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          //lookup the user
          data.read("users", phone, (err, uData) => {
            const userData = { ...parseJSON(uData) };
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }

              //update to database
              data.update("users", phone, userData, (err2) => {
                if (!err2) {
                  console.log(userData);
                  callback(200, {
                    message: "User was update successfully.",
                  });
                } else {
                  callback(500, {
                    error: "There was a problem in the server side!",
                  });
                }
              });
            } else {
              callback(400, {
                error: "You have a problem in your request!",
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
        error: "You have a problem in your request!",
      });
    }
  } else {
    callback(400, {
      error: "Invalid phone number. Please try again",
    });
  }
};

handler._users.delete = (propertyRequest, callback) => {
  //check the phone number validation
  const phone =
    typeof propertyRequest.queryStringObject.phone === "string" &&
    propertyRequest.queryStringObject.phone.trim().length === 11
      ? propertyRequest.queryStringObject.phone
      : false;

  if (phone) {
    //verify token
    let token =
      typeof propertyRequest.headerObject.token === "string"
        ? propertyRequest.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      console.log(tokenId);
      if (tokenId) {
        //loopUp the user
        data.read("users", phone, (err, userData) => {
          if (!err && userData) {
            data.delete("users", phone, (err2) => {
              if (!err2) {
                callback(200, {
                  message: "Successfully delete this user.",
                });
              } else {
                callback(500, {
                  error: "There was a server side error!",
                });
              }
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
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

module.exports = handler;
