const mongoose = require("mongoose");
const Party = require("../../models/party");
const PartyMember = require("../../models/partyMember");
const User = require("../../models/user");

const sharedVars = require("../../utils/sharedVars");

exports.party_create = (req, res, next) => {
  PartyMember.find({ userId: req.userData.userId })
    .exec()
    .then(myParty => {
      if (myParty.length > 0) {
        return res.status(200).json({
          error: true,
          message: "You already belong in a party!"
        });
      }
      const generatedPartyId = mongoose.Types.ObjectId();
      const party = new Party({
        _id: generatedPartyId,
        creator: req.userData.userId,
        floor: req.body.floorLevel,
        members: 1
      });
      party.save();
      const partyMember = new PartyMember({
        _id: mongoose.Types.ObjectId(),
        userId: req.userData.userId,
        partyId: generatedPartyId
      });
      partyMember.save();

      // const my_socket = req.app.get("my-socket");

      const socketio = req.app.get("socketio");
      // socketio.sockets.join(generatedPartyId);

      // var selectedUser = sharedVars.socketsList.find(function(user) {
      //   return user.userId == "5a9bb97a3de0c02720ece2c4";
      // });

      console.log("----------------");
      console.log(sharedVars.socketsList);
      console.log("----------------");

      socketio.to(generatedPartyId).emit("playerJoinedParty", {
        name: req.userData.userId
      });
      //console.log("---------------------");
      //console.log(socketio.sockets.adapter.rooms["456"]);

      User.findOne({ _id: req.userData.userId }, (err, user) => {
        if (err) return res.status(200).send(err);
        return res.status(200).json({
          error: false,
          message: "Party created!",
          partyId: generatedPartyId,
          floor: req.body.floorLevel,
          members: [user.email]
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: true,
        message: err
      });
    });
};

exports.party_get_all = (req, res, next) => {
  Party.find()
    .select("_id creator floor members")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        partiesList: docs.map(doc => {
          return {
            _id: doc._id,
            creator: doc.creator,
            floor: doc.floor,
            members: doc.members
          };
        })
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.party_join = (req, res, next) => {
  Party.findById(req.params.partyId)
    .exec()
    .then(party => {
      if (!party) {
        return res.status(200).json({
          message: "Party not found"
        });
      } else {
        PartyMember.find({ partyId: req.params.partyId })
          .exec()
          .then(parties => {
            if (parties.length > 2) {
              return res.status(200).json({
                message: "Party is full"
              });
            } else {
              const partiesIBelong = parties.find(party => {
                return party.userId == req.userData.userId;
              });
              if (partiesIBelong) {
                return res.status(200).json({
                  message: "You already belong in a party"
                });
              } else {
                const partyMember = new PartyMember({
                  _id: mongoose.Types.ObjectId(),
                  userId: req.userData.userId,
                  partyId: req.params.partyId
                });
                partyMember.save();

                // emmit my joining to party to party members
                const socketio = req.app.get("socketio");
                const my_socket = req.app.get("my-socket");

                console.log("SOCKET ID: " + my_socket.id);

                my_socket.join("456");

                console.log(Object.keys(socketio.sockets.sockets)); // returns array of sockets
                console.log("current socket: " + my_socket.id);
                console.log(socketio.sockets.adapter.rooms["456"]);

                socketio
                  .to(req.params.partyId)
                  .emit("playerJoinedParty", { name: req.userData.userId });

                // join socket room

                my_socket.join(req.params.partyId);

                let partyMembers = [req.userData.userId];
                for (let party of parties) {
                  partyMembers.push(party.userId);
                }
                res.status(200).json({
                  message: "You joined a party!",
                  error: false,
                  partyId: req.params.partyId,
                  floor: party.floor,
                  members: partyMembers
                });
              }
            }
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.party_leave = (req, res, next) => {
  PartyMember.findOneAndRemove({ userId: req.userData.userId })
    .then(doc => {
      Party.findOneAndRemove({ creator: req.userData.userId })
        .then(doc => {
          // my_socket.leave(doc._id);
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });

      res.status(200).json({
        message: "Party left"
      });
      // my_socket.leave(doc.partyId);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
