const fs = require("fs");
const path = require("path");

const lib = {};

lib.basedir = path.join(__dirname, "./../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback(`file can't close`);
            }
          });
        } else {
          callback(`can't write data on file.`);
        }
      });
    } else {
      callback(`Error file can't open, maybe file already exists!`);
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data) => {
    console.log(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          fs.writeFile(fileDescriptor, stringData, (err3) => {
            if (!err3) {
              fs.close(fileDescriptor, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback(`Can't close this update file.`);
                }
              });
            } else {
              callback(~`Can't write the update file.`);
            }
          });
        } else {
          callback(`Can't clear the truncate file.`);
        }
      });
    } else {
      callback(`file can't open!`);
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(`Can't delete this file`);
    }
  });
};

module.exports = lib;
