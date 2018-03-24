const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const sharedVars = require("./sharedVars");

exports.signin = (email, password, socket, callback) => {
  User.find({ email: email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        // email doesn't exist
        return callback({
          message: "Email doesn't exist",
          error: true
        });
      }
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          return callback({
            message: "Wrong password",
            error: true
          });
        }
        if (result) {
          socket.userId = String(user[0]._id);
          sharedVars.socketsList[socket.id] = socket;

          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "5h"
            }
          );
          return callback({
            error: false,
            message: "Auth successful",
            idToken: token,
            localId: user[0].email,
            expiresIn: 3600 * 5
          });
        }
        return callback({
          message: "Auth failed",
          error: true
        });
      });
    })
    .catch(err => {
      console.log(err);
      return callback({
        message: err,
        error: true
      });
    });
};
