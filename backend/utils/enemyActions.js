const mongoose = require("mongoose");

const PartyMember = require("../models/partyMember");
const Battlefield = require("../models/battlefield");
const enemyActions = require("./enemyActions");
const myFunctions = require('./reformWorld');
const floor1 = require("../api/floors/1");
const aStar = require('./astar-pathfinding');

async function makeTurn (partyId, io) {

  /*
  function doubleAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x * 2);
      }, 2000);
    });
  }

  
    const a = await doubleAfter2Seconds(10);
    console.log(a);
    const b = await doubleAfter2Seconds(20);
    console.log(b);
    const c = await doubleAfter2Seconds(30);
    console.log(c);
    return x + a + b + c;
*/



    var i = 0;
    function movementFunc() {
    

      Battlefield.findOne({ partyId: partyId })
      .exec()
      .then(bfInfo => {





  for (let enemy in bfInfo.actors.enemies) {

   
 



    let worldIntermediate = [];
    worldIntermediate = JSON.parse(JSON.stringify(floor1.mapLayout));

      // adds collision between enemies  
      for (let enemy2 in bfInfo.actors.enemies) {
        if (enemy !== enemy2){
          worldIntermediate[bfInfo.actors.enemies[enemy2].y][bfInfo.actors.enemies[enemy2].x] = 2;
        }
      }
     
       // adds collision between current enemy and other players (not target)
        for (let player2 in bfInfo.actors.players) {
            if (bfInfo.actors.enemies[enemy].target !== player2){
                worldIntermediate[bfInfo.actors.players[player2].y][bfInfo.actors.players[player2].x] = 3;
            }
        }
        //=================


    let worldReformed = [];
    worldReformed = myFunctions.reformWorld(worldIntermediate);
   // console.log(`worldReformed:`);
   // console.log(worldReformed);
        
        let pathStart = [bfInfo.actors.enemies[enemy].x,bfInfo.actors.enemies[enemy].y];
       // console.log(`pathStart:`);
      //  console.log(pathStart);
      console.log(`enemies target: ${bfInfo.actors.enemies[enemy].target}`);
      console.log(bfInfo.actors.players);
        let pathEnd = [bfInfo.actors.players[bfInfo.actors.enemies[enemy].target].x,bfInfo.actors.players[bfInfo.actors.enemies[enemy].target].y];
    
        let currentPath = aStar.findPath(worldReformed,pathStart,pathEnd);
       // console.log(`currentPath:`);
       // console.log(currentPath);
        if (currentPath === '') {
          continue;
        }

        if (currentPath[0] !== undefined) {
          // stop before moving into target tile
          if (currentPath[1][0] === pathEnd[0] && currentPath[1][1] === pathEnd[1])
          {
            break;
          } else {

            const enemyKeyX = 'actors.enemies.'+ enemy + '.x';
            const enemyKeyY = 'actors.enemies.'+ enemy + '.y';

            Battlefield.update({partyId: partyId}, {'$set': {
              [enemyKeyX]: currentPath[1][0],
              [enemyKeyY]: currentPath[1][1]
            }}, function (err, success) {
              if (err) {
                console.log('Error occurred in a enemyActions.js makeTurn() method (2)');
                console.log(err);
              } else {
           
                let directionMoved = '';

                if (bfInfo.actors.enemies[enemy].x < currentPath[1][0]) {
                  directionMoved = 'right';
                } else if (bfInfo.actors.enemies[enemy].x > currentPath[1][0]) {
                  directionMoved = 'left';
                } else if (bfInfo.actors.enemies[enemy].y < currentPath[1][1]) {
                  directionMoved = 'down';
                } else if (bfInfo.actors.enemies[enemy].y > currentPath[1][1]) {
                  directionMoved = 'up';
                }

           
                console.log(`${enemy} x,y: [${bfInfo.actors.enemies[enemy].x},${bfInfo.actors.enemies[enemy].y}], x2y2: [${currentPath[1][0]},${currentPath[1][1]}]`);
               // console.log('currentPath:');
              //  console.log(currentPath);
               // console.log('worldReformed:');
               // console.log(worldReformed);

                io.to(partyId).emit("onActorMovedInBattlefield", {
                  actorId: enemy,
                  directionMoved: directionMoved,
                  whoMoved: 'enemy'
                });
              }
            });
         
          }   
        }

    
  }

}).catch(err => {
  console.log('Error occurred in a enemyActions.js makeTurn() method (1)');
  console.log(err);
 
});

  i++;
  if (i == 6) {
    clearInterval(interval);

    // after enemies stopped moving set all players .isEndedTurn to false so they can move
    Battlefield.findOne({ partyId: partyId })
    .exec()
    .then(bfInfo => {
    for (let player3 in bfInfo.actors.players) {

      const playersKey = 'actors.players.'+ player3 + '.isEndedTurn';
      Battlefield.update({partyId: partyId}, {'$set': {
        [playersKey]: false
      }}, function (err, success) {
        if (err) {
         console.log('Error occurred in a enemyActions.js makeTurn() method (5)');
        console.log(err);
        } else {


        }
      });
    }
    }).catch(err => {
      console.log('Error occurred in a enemyActions.js makeTurn() method (6)');
      console.log(err);
     
    });

  }
  console.log('---------------------');
  console.log("TICK " + i);
} // end if movementFunc
var interval = setInterval(movementFunc, 1900);
movementFunc();


 

/*
      Battlefield.findOne({ partyId: partyId })
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

        Battlefield.update({partyId: partyId}, {'$set': {
          [playersKey]: newValue
        }}, function (err, success) {
          if (err) {
           
          } else {
         
          }
      });


      return callback({
        partyId: partyId,
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
*/


};

module.exports.makeTurn = makeTurn;