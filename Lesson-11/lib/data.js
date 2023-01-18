const fs = require("fs");
const path = require("path");

const lib = {};

//basedir
lib.basedir = path.join(__dirname, "./../.data/");

//write data to file
lib.create = (dir, file, data, callback) => {
  //open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // stringify data
      const stringData = JSON.stringify(data);

      // write data to the file then close it
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback(`Error to can't close this file.`);
            }
          });
        } else {
          callback(`Error to can't write any data to the file!.`);
        }
      });
    } else {
      callback(`Could not create new file, it may already exists.`);
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir}/${dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  //file open
  //   console.log(`${lib.basedir + dir}/${file}.json`);
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //stringify data
      const stringData = JSON.stringify(data);
      //File truncate
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          //write to file and close it
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback(`Can't close the file system.`);
                }
              });
            } else {
              callback(`can't update & write the file data!.`);
            }
          });
        } else {
          callback(`can't truncate the file!.`);
        }
      });
    } else {
      callback(`Can't open the file!.`);
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`Can't delete this file!`);
    }
  });
};

module.exports = lib;
