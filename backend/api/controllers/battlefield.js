const mongoose = require("mongoose");

const sharedVars = require("../../utils/sharedVars");
const myFunctions = require('../../utils/reformWorld');
const Battlefield = require("../../models/battlefield");
const Party = require("../../models/party");
const PartyMember = require("../../models/partyMember");
const floor1 = require("./../floors/1");

exports.mapData = (req, res, next) => {

   

    const worldEnemies = [
      { 
          id:'orc1',
          health: 100,
          attack: 11,
          defence: 9,
          x: 19,
          y: 8,
          actionPoints: 10
      },{ 
        id:'orc2',
          health: 100,
          attack: 11,
          defence: 9,
          x: 16,
          y: 4,
          actionPoints: 10
        
      },{ 
        id:'orc3',
          health: 100,
          attack: 11,
          defence: 9,
          x: 14,
          y: 6,
          actionPoints: 10
       
      }];

  let worldReformed = myFunctions.reformWorld(floor1.mapLayout);


  Party.findOne({ creator: req.userData.userId })
  .exec()
  .then(party => {
    if (party.length === 0) {
      return res.status(200).json({
        error: true,
        message: "You're not a party leader!"
      });
    } else {
      PartyMember.find({ partyId: party._id })
      .exec()
      .then(partymembers => {

        const playersObj = {};
        partymembers.map((member, index) => {
          playersObj[member.userId] = {
            hpFull: 100,
            hpLeft: 100,
            attack: 12,
            defence: 8,
            x: 3,
            y: 3+index,
            actionPoints: 10,
            isConnected: false,
            isEndedTurn: false
          };
        });

        const enemiesObj = {};
        worldEnemies.map((enemies, index) => {
          enemiesObj[enemies.id] = {
            hpFull: enemies.health,
            hpLeft: enemies.health,
            attack: enemies.attack,
            defence: enemies.defence,
            x: enemies.x,
            y: enemies.y+index,
            actionPoints: enemies.actionPoints,
            target: null
          };
        });

        const battlefieldData = {
          _id: mongoose.Types.ObjectId(),
          partyId: party._id,
          floor: 1,
          turnNo: 1,
          playersMultiplier: 0,
          enemiesMultiplier: 0,
          actors: {
            players: playersObj,
            enemies: enemiesObj
          }
        }; 
   
        const battlefield = new Battlefield(
          battlefieldData
        );
        battlefield.save();
      

      // SOCKETS START
      const socketio = req.app.get("socketio");

      socketio.to(party._id).emit("leaderEnteredBattlefield", {
        battlefieldData: battlefieldData,
        field: worldReformed
      });

      // SOCKETS END
  
        return res.status(200).json({
          error: false,
          message: "Entered battlefield!"
          
        });





      });

    }
  }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: true,
            message: err
          });
        });
    



};
