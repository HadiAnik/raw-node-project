const environment = {};

environment.staging = {
  port: 6000,
  envName: "staging",
  secretKey: "sjhvfsfghmsfvsmef",
  maxChecks: 5,
  twilio: {
    fromPhone: "+18179619092",
    accountSid: "ACb2ae9861f334988c22b651b0e6404911",
    authToken: "040f38cd19c4a3484b000cc61cf576a2",
  },
};

environment.production = {
  port: 5000,
  envName: "production",
  secretKey: "jhsrskfeskshvsme",
  maxChecks: 5,
  twilio: {
    fromPhone: "+18179619092",
    accountSid: "ACb2ae9861f334988c22b651b0e6404911",
    authToken: "040f38cd19c4a3484b000cc61cf576a2",
  },
};

//determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//export corresponding environment object
const environmentToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment.staging;

//module export
module.exports = environmentToExport;
