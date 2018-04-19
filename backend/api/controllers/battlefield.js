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
          x: 19,
          y: 8
        
      },{ 
        id:'orc2',
          health: 100,
          x: 16,
          y: 4
        
      },{ 
        id:'orc3',
          health: 100,
          x: 14,
          y: 6
       
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
            health: 100,
            x: 3,
            y: 3+index,
            isConnected: false,
            isEndedTurn: false
          };
        });

        const enemiesObj = {};
        worldEnemies.map((enemies, index) => {
          enemiesObj[enemies.id] = {
            health: enemies.health,
            x: enemies.x,
            y: enemies.y+index,
            target: null
          };
        });

        const battlefieldData = {
          _id: mongoose.Types.ObjectId(),
          partyId: party._id,
          "floor": 1,
          "actors": {
            "players": playersObj,
            "enemies": enemiesObj
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
    
 

  // User.find({ userId: req.userData.userId })
  // .exec()
  // .then(user => {
  // Battlefield.find({ partyId: req.userData.userId })
  //   .exec()
  //   .then(myParty => {
  //     if (myParty.length > 0) {
  //       return res.status(200).json({
  //         error: true,
  //         message: "You already belong in a party!"
  //       });
  //     }
  //     const generatedPartyId = mongoose.Types.ObjectId();
  //     const party = new Party({
  //       _id: generatedPartyId,
  //       creator: req.userData.userId,
  //       floor: req.body.floorLevel,
  //       members: 1
  //     });
  //     party.save();
  //     const partyMember = new PartyMember({
  //       _id: mongoose.Types.ObjectId(),
  //       userId: req.userData.userId,
  //       partyId: generatedPartyId
  //     });
  //     partyMember.save();

  //     // SOCKETS START
  //     const socketio = req.app.get("socketio");

  //     Object.keys(sharedVars.socketsList).forEach(element => {
  //       if (sharedVars.socketsList[element].userId == req.userData.userId) {
  //         sharedVars.socketsList[element].join(generatedPartyId);
  //         console.log("CREATED AND JOINED SOCKET");
  //       }
  //     });

  //     // SOCKETS END

  //     User.findOne({ _id: req.userData.userId }, (err, user) => {
  //       if (err) return res.status(200).send(err);
  //       return res.status(200).json({
  //         error: false,
  //         message: "Party created!",
  //         partyId: generatedPartyId,
  //         floor: req.body.floorLevel,
  //         members: [user.email]
  //       });
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: true,
  //       message: err
  //     });
  //   });
  // });









};
