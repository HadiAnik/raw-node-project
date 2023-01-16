/*
 * Title : utilities handler
 * Description : this is sample handler path
 * Author : Hadiuzzaman
 * Date : 16/01/2023
 */
const crypto = require("crypto");
const utilities = {};

//parse JSON string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }
  return output;
};

// Hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", "HashSecrete")
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

// create random string
utilities.createRandomString = (stringLength) => {
  let length = stringLength;
  length =
    typeof stringLength === "number" && stringLength > 0 ? stringLength : false;
  if (length) {
    const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let output = "";
    for (let i = 0; i < length; i += 1) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

module.exports = utilities;
