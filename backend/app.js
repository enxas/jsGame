const app = require("express")();
const server = app.listen(process.env.PORT || 4001);
const io = require("socket.io")(server);
app.set("socketio", io);

// morgan is middleware for logging requests
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const partyRoutes = require("./api/routes/party");
const authRoutes = require("./api/routes/user");
const battlefieldRoutes = require("./api/routes/battlefield");

const utils_signin = require("./utils/signin");
const utils_battlefield = require("./utils/battlefield");
const sharedVars = require("./utils/sharedVars");
const myFunctions = require('./utils/reformWorld');

let visitorCount = 0;

// global variable: process.env.MONGO_ATLAS_PW
mongoose.connect(process.env.MONGODB_SERVER);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
// moddleware for supporting POST json and urlencode data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS headers. Replace * with domain which should have access to REST api
// CORS is bypassed by tools such as Postman
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // browser sends OPTIONS request first when sends PUT or POST request to see what requests it can send to the REST api
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const socket_list = {};

// const io = req.app.get('socketio');

io.on("connection", socket => {
  console.log(`[socket] User ${socket.id} connected`);

  socket.on("signIn", data => {
    const callback = result => {
      socket.emit("signInResponse", result);
    };

    utils_signin.signin(data.email, data.password, socket, callback);
  });

   socket.on("connectedToBattlefield", () => {
    const callback = data => {
      io.to(data.partyId).emit("onConnectedToBattlefield", {
        userId: data.userId
      });
    };

    utils_battlefield.connectToBattlefield(socket, callback);
  });

  socket.on("disconnectedFromBattlefield", () => {
    const callback = data => {
      io.to(data.partyId).emit("onDisconnectedFromBattlefield", {
        userId: data.userId
      });
    };

    utils_battlefield.disconnectFromBattlefield(socket, callback);
  });
  
  socket.on("movedInBattlefield", (directionMoved) => {
    const callback = data => {
      io.to(data.partyId).emit("onActorMovedInBattlefield", {
        actorId: data.userId,
        directionMoved: data.directionMoved,
        whoMoved: 'player'
      });
    };

    utils_battlefield.movedInBattlefield(socket, callback, directionMoved);
  });

  socket.on("endedTurn", () => {
    const callback = data => {
      io.to(data.partyId).emit("onPlayerEndedTurn", {
        userId: data.userId
      });
    };

    utils_battlefield.playerEndedTurn(socket, callback, io);
  });
  

  // on disconnect
  socket.on("disconnect", function() {
    console.log(`[socket] User Socket ID: ${socket.id} disconnected`);

    delete sharedVars.socketsList[socket.id];
    visitorCount -= 1;
    io.sockets.emit("visitorCountUpdated", visitorCount);
  });
  //  if (socket_id[0] === socket.id) {
  //    // remove the connection listener for any subsequent
  //    // connections with the same ID
  //    io.removeAllListeners('connection');
  //  }

  //  socket.on('hello message', msg => {
  //     console.log('just got: connected');
  //    socket.emit('chat message', 'hi from server');

  // })
});

// let socketMiidleware = function(req,res,next){
//   req.io = io;
//   next();
// }

// Routes which should handle requests
app.use("/party", partyRoutes);
app.use("/auth", authRoutes);
app.use("/battlefield", battlefieldRoutes);

// trow error if none of the above routes gets handled
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// catch and return error if it happens at any part of the aplication
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
