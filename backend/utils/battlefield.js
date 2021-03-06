const mongoose = require("mongoose");

const PartyMember = require("../models/partyMember");
const Battlefield = require("../models/battlefield");
const enemyActions = require("./enemyActions");
const floor1 = require("../api/floors/1");
const skills = require("./skills");

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
          if (bfInfo.actors.players[socket.userId].actionPoints > 0) {

        const worldIntermediate = JSON.parse(JSON.stringify(floor1.mapLayout));

        // add enemies to the map
        for (let enemy in bfInfo.actors.enemies) {
            worldIntermediate[bfInfo.actors.enemies[enemy].y][bfInfo.actors.enemies[enemy].x] = 2;
        }
        // add players to the map
        for (let player in bfInfo.actors.players) {
            worldIntermediate[bfInfo.actors.players[player].y][bfInfo.actors.players[player].x] = 3;
        }


        let axis;
        let newValue;

        if (directionMoved.direction === 'up') {
          axis = 'y';
          
          if (bfInfo.actors.players[socket.userId].y - 1 < 0 || 
            worldIntermediate[bfInfo.actors.players[socket.userId].y - 1][bfInfo.actors.players[socket.userId].x] > 0) {
            newValue = bfInfo.actors.players[socket.userId].y;
            directionMoved.direction = 'stay';
          } else {
            newValue = bfInfo.actors.players[socket.userId].y - 1;
          }
        } else if (directionMoved.direction === 'down') {
          axis = 'y';
          if (bfInfo.actors.players[socket.userId].y + 1 > 15 || 
            worldIntermediate[bfInfo.actors.players[socket.userId].y + 1][bfInfo.actors.players[socket.userId].x] > 0) {
            newValue = bfInfo.actors.players[socket.userId].y;
            directionMoved.direction = 'stay';
          } else {
            newValue = bfInfo.actors.players[socket.userId].y + 1;
          }
        } else if (directionMoved.direction === 'left') {
          axis = 'x';
          if (bfInfo.actors.players[socket.userId].x - 1 < 0 || 
            worldIntermediate[bfInfo.actors.players[socket.userId].y][bfInfo.actors.players[socket.userId].x - 1] > 0) {
            newValue = bfInfo.actors.players[socket.userId].x;
            directionMoved.direction = 'stay';
          } else {
            newValue = bfInfo.actors.players[socket.userId].x - 1;
          }
        } else if (directionMoved.direction === 'right') {
          axis = 'x';
          if (bfInfo.actors.players[socket.userId].x + 1 > 24 || 
            worldIntermediate[bfInfo.actors.players[socket.userId].y][bfInfo.actors.players[socket.userId].x + 1] > 0) {
            newValue = bfInfo.actors.players[socket.userId].x;
            directionMoved.direction = 'stay';
          } else {
            newValue = bfInfo.actors.players[socket.userId].x + 1;
          }
        }


        const playersKey = 'actors.players.'+ socket.userId + '.' + axis;
        const playersActionPoints = 'actors.players.'+ socket.userId + '.actionPoints';
        const newActionPoints = bfInfo.actors.players[socket.userId].actionPoints - 1;
        

        Battlefield.update({partyId: member.partyId}, {'$set': {
          [playersKey]: newValue,
          [playersActionPoints]: newActionPoints,
        }}, function (err, success) {
          if (err) {
           
          } else {
         
          }
      });


      return callback({
        partyId: member.partyId,
        userId: socket.userId,
        directionMoved: directionMoved.direction,
        actionPoints: newActionPoints
      });
      } // end of if (have action points)
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
        const playersActionPoints = 'actors.players.'+ socket.userId + '.actionPoints';
        let newActionPoints = bfInfo.actors.players[socket.userId].actionPoints + 6;
        if (newActionPoints > 10) {
          newActionPoints = 10;
        }

        Battlefield.update({partyId: member.partyId}, {'$set': {
          [playersKey]: true,
          [playersActionPoints]: newActionPoints,
        }}, function (err, success) {
          if (err) {
           
          } else {
         
            Battlefield.findOne({ partyId: member.partyId })
            .exec()
            .then(field => {
              
              // check if all players have ended turn
              let allPlayersEndedTurn = true;
              for (let player in field.actors.players) {
                console.log(`${player}'s turn has ended? ${field.actors.players[player].isEndedTurn}`);
                if (field.actors.players[player].isEndedTurn === false) {
                  
                  allPlayersEndedTurn = false;
                }
              }
                if (allPlayersEndedTurn === true) {
                  console.log('all players have ended their turns');


    // if enemy diesn't have a target, loop over all alive players (health higher than 0) and add their ID's to array,
    // then randomly select one ID from array and assign to enemy as target
   

    const enemiesWithTargets = {};
    let arrayOfAlivePlayersIds = [];
   

    for (let player in bfInfo.actors.players) {
      if (bfInfo.actors.players[player].hpLeft > 0) {
        arrayOfAlivePlayersIds.push(player);
      }
    }

    for (let enemy in bfInfo.actors.enemies) {
    if (bfInfo.actors.enemies[enemy].target === null) {
      enemiesWithTargets['actors.enemies.'+ enemy + '.target'] =
       arrayOfAlivePlayersIds[Math.floor(Math.random() * arrayOfAlivePlayersIds.length)];
    
    }

  }

console.log('enemiesWithTargets:');
console.log(enemiesWithTargets);
     // const enemyTarget = 'actors.enemies.'+ enemy + '.target';
      Battlefield.update({partyId: member.partyId}, {'$set': enemiesWithTargets
      // {
      //   [enemyTarget]: randonPlayerId
      // }
    }, function (err, success) {
        if (err) {
          console.log('Error occurred in a enemyActions.js makeTurn() method (3)');
          console.log(err);
        } else {
          enemyActions.makeTurn(member.partyId, io);
        }
      });
    
  




                 
                }
              
            })
            .catch(err => {
              console.log('Error occurred in a battlefield.js playerEndedTurn() method (1)');
              console.log(err);
              res.status(500).json({
                error: err
              });
            });

          }
      });

      // enemyActions.makeTurn(member.partyId, 10).then((sum) => {
      //   console.log(sum);
      // });
      
     


      return callback({
        partyId: member.partyId,
        userId: socket.userId,
        actionPoints: newActionPoints
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

exports.playerAttackedEnemy = (socket, callback, attackData) => {
  // attackData = { removed - enemyId: '', 
  // x: 14, y: 9, skillId: 0, skillDirection: 'E' }
  PartyMember.findOne({ userId: socket.userId })
  .exec()
  .then(member => {

    Battlefield.findOne({ partyId: member.partyId })
    .exec()
    .then(bfInfo => {

      let actionPoints = bfInfo.actors.players[socket.userId].actionPoints;

        if (actionPoints > 1) {
          // TODO: check if a player owns a skill that he is using

          // TODO: check if player is actually in range to perform used skill

          const callback_combatLog = combatLog => {
            return callback({
              partyId: member.partyId,
              userId: socket.userId,
              combatLog: combatLog
            });
          };

          skills.calculateDamage(
            attackData.x, 
            attackData.y, 
            attackData.skillId, 
            bfInfo, 
            attackData.skillDirection, 
            bfInfo.actors.players[socket.userId].x, 
            bfInfo.actors.players[socket.userId].y,
            socket.userId, 
            member.partyId, 
            callback_combatLog
          );
        }

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