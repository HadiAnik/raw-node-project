/*
 * Title : workers library
 * Description : worker related file
 * Author : Hadiuzzaman
 * Date : 12/01/2023
 */

//Dependencies
const url = require("url");
const http = require("http");
const https = require("https");
const data = require("./data");
const { parseJSON } = require("./../helpers/utilities");
const { sendTwilioSms } = require("./../helpers/notification");

// workers object - module scaffolding
const worker = {};

// loopUp all the checks
worker.gatherAllChecks = () => {
  // get all the checks
  data.list("checks", (err1, checks) => {
    if (!err1 && checks && checks.length > 0) {
      checks.forEach((check) => {
        //read the checkData
        data.read("checks", check, (err2, originalCheckData) => {
          if (!err2 && originalCheckData) {
            // pass the data to the check validator
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log("Reading one of the checks data!");
          }
        });
      });
    } else {
      console.log("Could not find any checks to process!");
    }
  });
};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
  let originalData = originalCheckData;
  if (originalCheckData && originalCheckData.id) {
    originalData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";

    originalData.lastChecked =
      typeof originalCheckData.lastChecked === "number" &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    // pass to the next process
    worker.performCheck(originalData);
  } else {
    console.log("Check was invalid or not properly formate!");
  }
};

// perform check
worker.performCheck = (originalCheckData) => {
  //prepare the initial check outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };
  // mark the outCome has not been sent yet
  let outComeSent = false;
  // parse the hostname form original data
  let parseUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );
  const hostName = parseUrl.hostname;
  const path = parseUrl.path;

  // construct the request
  const requestDetails = {
    protocol: `${originalCheckData.protocol}:`,
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeOutSecond * 1000,
  };

  const protocolToUse = originalCheckData.protocol === "http" ? http : https;
  let req = protocolToUse.request(requestDetails, (res) => {
    // grad the status of the response
    const status = res.statusCode;

    // update the check out come and pass to the next process
    checkOutCome.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("error", (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };
    // update the check out come and pass to the next process
    if (!outComeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  req.on("timeout", (e) => {
    checkOutCome = {
      error: true,
      value: "timeout",
    };
    // update the check out come and pass to the next process
    if (!outComeSent) {
      worker.processCheckOutCome(originalCheckData, checkOutCome);
      outComeSent = true;
    }
  });

  // request send
  req.end();
};

// save check outCome to database and send to next process
worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
  //check if checK outCome is up or down
  const state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originalCheckData.successCode.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";

  // decide wether we should alert the user or not
  const alertWanted = !!(
    originalCheckData.lastChecked && originalCheckData.state !== state
  );

  // update the check data
  let newCheckData = originalCheckData;

  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  //update the check to date
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWanted) {
        // send the checkData to next process
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("Alert is not needed as there is no state change!");
      }
    } else {
      console.log("Error trying to save check data of one of the checks!");
    }
  });
};

// send notification sms to user if state change
worker.alertUserToStatusChange = (newCheckData) => {
  const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;
  // sjdfhsfs durglnslgae;lgrmaegoilnrekageq;lmrga egmeagreaingrrglawmlfrwlialfmewf;wamfepfomw;we
  console.log(newCheckData.userPhone);

  sendTwilioSms(newCheckData.userPhone, msg, (err) => {
    if (!err) {
      console.log(`User was alert ed to a status change vai SMS: ${msg}`);
    } else {
      console.log("There was a problem sending sms to one of the user!");
    }
  });
};

//timer to execute the worker process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 8000);
};

// start the worker
worker.init = () => {
  // execute all the check
  worker.gatherAllChecks();

  //call the loop so that checks continue
  worker.loop();
};

module.exports = worker;
