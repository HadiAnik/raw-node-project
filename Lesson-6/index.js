const fs = require("fs");

const ourReadStream = fs.createReadStream(`${__dirname}/bigData.txt`);
const ourWriteStream = fs.createWriteStream(`${__dirname}/output.txt`);

// ourReadStream.on("data", (chunk) => {
//   console.log(chunk.toString());
//   ourWriteStream.write(chunk);
// });

//or

ourReadStream.pipe(ourWriteStream);
