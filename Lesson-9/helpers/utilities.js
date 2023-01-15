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

module.exports = utilities;
