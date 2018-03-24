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

const utils_signin = require("./utils/signin");
const sharedVars = require("./utils/sharedVars");

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
    const signin_cb = result => {
      socket.emit("signInResponse", result);
    };

    utils_signin.signin(data.email, data.password, socket, signin_cb);

    //     isValidPassword(data, function (res) {
    //         if (res) {
    //             Player.onConnect(socket, data.username);
    //             socket.emit('signInResponse', { success: true });
    //             socket.emit('newTurn', { actorsName: Object.keys(Player.list)[0] });
    //             socket.emit('updateMovePoints', movePoints);

    //             io.sockets.emit('drawGrid2', {'world': worldReformed});

    //             actorsName = Object.keys(Player.list)[0];
    //         } else {
    //             socket.emit('signInResponse', { success: false });
    //         }
    //     });
  });

  // socket_list[socket.id] = socket;
  // // when there is a user on the site
  // visitorCount += 1;
  // io.sockets.emit("visitorCountUpdated", visitorCount);

  // socket.on("helloFromClient", function(data) {
  //   console.log(`[socket] on.helloFromClient`);
  //   io.to("8633").emit("some event");
  //   socket.emit("helloFromClientResponse", { message: "hello " + data.name });
  // });

  // on disconnect
  socket.on("disconnect", function() {
    console.log(
      `[socket] User Socket ID: ${socket.id}, User ID: ${
        socket.userid
      } disconnected`
    );
    console.log(socket);
    delete sharedVars.socketsList[socket.userid];
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

/*
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

let interval;
io.on("connection", socket => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://api.darksky.net/forecast/31e332cedc16b2d979e0fff892b9af38/43.7695,11.2558"
    );
    socket.emit("FromAPI", res.data.currently.temperature);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));
*/
