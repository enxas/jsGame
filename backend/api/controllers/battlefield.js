const mongoose = require("mongoose");

const sharedVars = require("../../utils/sharedVars");
const myFunctions = require('../../utils/reformWorld');
const Battlefield = require("../../models/battlefield");
const Party = require("../../models/party");
const PartyMember = require("../../models/partyMember");

exports.mapData = (req, res, next) => {

  var world = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]; 

    const worldEnemies = [
      { 
          id:'orc1',
          health: 100,
          x: 7,
          y: 3
        
      },{ 
        id:'orc2',
          health: 100,
          x: 7,
          y: 4
        
      },{ 
        id:'orc3',
          health: 100,
          x: 7,
          y: 5
       
      }];

  let worldReformed = myFunctions.reformWorld(world);


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

        const battlefieldData = {
          _id: mongoose.Types.ObjectId(),
          partyId: party._id,
          "floor": 1,
          actors: { 
            
            "players":
            partymembers.map((member, index) => {
             
              return {
                [member.userId]: {
                  health: 100,
                  x: 3,
                  y: 3+index,
                  isConnected: false
                }
              }
            }),
            "enemies": 
            worldEnemies.map((enemies, index) => {
             
              return {
                [enemies.id]: {
                  health: enemies.health,
                  x: enemies.x,
                  y: enemies.y+index
                }
              }
            }),
         
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
