/*
 * Title : Token handler
 * Description : Handler to handle token
 * Author : Hadiuzzaman
 * Date : 16/01/2023
 */
//Dependencies
const data = require("./../../lib/data");
const { hash, createRandomString } = require("./../../helpers/utilities");
const { parseJSON } = require("./../../helpers/utilities");

const handler = {};

// data.read("test", "test", (err, data) => {
//   console.log("inside user Handler", err, data);
// });

handler.tokenHandler = (propertyRequest, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(propertyRequest.method) > -1) {
    handler._token[propertyRequest.method](propertyRequest, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (propertyRequest, callback) => {
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

  if (phone && password) {
    data.read("users", phone, (err, uData) => {
      if (!err) {
        let hashPassword = hash(password);
        const userData = { ...parseJSON(uData) };
        if (hashPassword === userData.password) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            phone,
            expires,
            id: tokenId,
          };
          //store the token
          data.create("token", tokenId, tokenObject, (err2) => {
            if (!err2) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There was a problem in server side!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Your password is Invalid!",
          });
        }
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

handler._token.get = (propertyRequest, callback) => {
  //check the phone number is valid
  const id =
    typeof propertyRequest.queryStringObject.id === "string" &&
    propertyRequest.queryStringObject.id.trim().length === 20
      ? propertyRequest.queryStringObject.id
      : false;

  if (id) {
    data.read("token", id, (err, tokenData) => {
      if (!err && tokenData) {
        const token = { ...parseJSON(tokenData) };
        callback(200, token);
      } else {
        callback(404, {
          error: "Request token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Request token was not found!",
    });
  }
};

handler._token.put = (propertyRequest, callback) => {
  //check the phone number is valid
  const id =
    typeof propertyRequest.body.id === "string" &&
    propertyRequest.body.id.trim().length === 20
      ? propertyRequest.body.id
      : false;

  const extend =
    typeof propertyRequest.body.extend === "boolean" &&
    propertyRequest.body.extend === true
      ? true
      : false;

  console.log(id, extend);
  if (id && extend) {
    data.read("token", id, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const token = { ...parseJSON(tokenData) };
        if (token.expires > Date.now()) {
          token.expires = Date.now() + 60 * 60 * 1000;
          console.log(token);
          //store the update token
          data.update("token", id, token, (err2) => {
            if (!err2) {
              callback(200, token);
            } else {
              callback(500, {
                error: "There was a server side Error!!",
              });
            }
          });
        } else {
          callback(400, {
            error: "Token already expire!",
          });
        }
      } else {
        callback(404, {
          error: "Request token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "There was a problem in your request!",
    });
  }
};

handler._token.delete = (propertyRequest, callback) => {
  //check the phone number validation
  const id =
    typeof propertyRequest.queryStringObject.id === "string" &&
    propertyRequest.queryStringObject.id.trim().length === 20
      ? propertyRequest.queryStringObject.id
      : false;

  if (id) {
    data.read("token", id, (err, userData) => {
      if (!err && userData) {
        data.delete("token", id, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Token was successfully deleted!.",
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
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("token", id, (err, tData) => {
    const tokenData = { ...parseJSON(tData) };
    if (!err && tData) {
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = handler;
