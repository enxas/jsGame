const mongoose = require("mongoose");

const PartyMember = require("../models/partyMember");
const Battlefield = require("../models/battlefield");
const enemyActions = require("./enemyActions");

exports.connectToBattlefield = (socket, callback) => {
  PartyMember.findOne({ userId: socket.userId })
    .exec()
    .then(member => {
      return callback({
        partyId: member.partyId,
        userId: socket.userId
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

exports.disconnectFromBattlefield = (socket, callback) => {
  PartyMember.findOne({ userId: socket.userId })
    .exec()
    .then(member => {
      return callback({
        partyId: member.partyId,
        userId: socket.userId
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

exports.movedInBattlefield = (socket, callback, directionMoved) => {
  PartyMember.findOne({ userId: socket.userId })
    .exec()
    .then(member => {

      Battlefield.findOne({ partyId: member.partyId })
      .exec()
      .then(bfInfo => {

        if (bfInfo.actors.players[socket.userId].isEndedTurn === false) {

        let axis;
        let newValue;

        if (directionMoved.direction === 'up') {
          axis = 'y';
          newValue = bfInfo.actors.players[socket.userId].y -= 1;
        } else if (directionMoved.direction === 'down') {
          axis = 'y';
          newValue = bfInfo.actors.players[socket.userId].y += 1;
        } else if (directionMoved.direction === 'left') {
          axis = 'x';
          newValue = bfInfo.actors.players[socket.userId].x -= 1;
        } else if (directionMoved.direction === 'right') {
          axis = 'x';
          newValue = bfInfo.actors.players[socket.userId].x += 1;
        }


        const playersKey = 'actors.players.'+ socket.userId + '.' + axis;

        Battlefield.update({partyId: member.partyId}, {'$set': {
          [playersKey]: newValue
        }}, function (err, success) {
          if (err) {
           
          } else {
         
          }
      });


      return callback({
        partyId: member.partyId,
        userId: socket.userId,
        directionMoved: directionMoved.direction,
      });
    } // end of if (isEndedTurn)


      }).catch(err => {
        console.log(err);
        return callback({
          message: err,
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


exports.playerEndedTurn = (socket, callback, io) => {
  PartyMember.findOne({ userId: socket.userId })
    .exec()
    .then(member => {

      Battlefield.findOne({ partyId: member.partyId })
      .exec()
      .then(bfInfo => {

        const playersKey = 'actors.players.'+ socket.userId + '.isEndedTurn';

        Battlefield.update({partyId: member.partyId}, {'$set': {
          [playersKey]: false // TODO: change to true
        }}, function (err, success) {
          if (err) {
           
          } else {
         
          }
      });

      // enemyActions.makeTurn(member.partyId, 10).then((sum) => {
      //   console.log(sum);
      // });
      enemyActions.makeTurn(member.partyId, io);
     


      return callback({
        partyId: member.partyId,
        userId: socket.userId
      });


      }).catch(err => {
        console.log(err);
        return callback({
          message: err,
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