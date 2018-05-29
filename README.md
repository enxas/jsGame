## Requirements

NodeJS v10.2.1

NPM v6.1.0

MongoDB v3.6

Nodemon v1.17.5

## Technologies used

ReactJS - frontend rendering

MongoDB - database

NodeJS - server

Express - serverside routing

Socket.IO - real time messaging

Bulma.io - css framework

Mongoose - MongoDB object modeling for NodeJS

Many more...

## Starting project

**Backend:**

Go to directory `cd /backend`

Install dependancies `npm install`

Start server `nodemon app.js`

Change global variable values for mongodb and such in nodemon.json if necessary

**Frontend:**

Go to directory `cd /frontend`

Install dependancies `npm install`

Start development server `npm start`

Server will start at `localhost:3000`

Visit address `http://localhost:3000`

## Scrapped game design (v0.1):

**Initial design:**

Screenshot for reference: https://i.imgur.com/KH0C42a.jpg

Download (v0.1) here: https://www44.zippyshare.com/v/qFVMdowb/file.html

Initialy this game was supposed to be turn based and oriented around positioning on battlefield. At first everyone had a turn. For example player1 makes turn, then player2 makes turn, then enemy1 makes turn, enemy2 makes turn and so on. This proved to be very slow process so i changed so there are only 2 phases, players turn and enemies turn. For example during players turn all players able to move or attack, during enemies turn enemies can do the same. Player movement and attack actins are limited to how many Action Points (AP) you have. For example player have 10AP, moving 1 tile consumes 1AP and using skill consumes 2-4AP. Finishing turn restores AP. Every turn multipliers would change changing player and enemies skill effectiveness randomly.

**Problems with design:**

During playtest i realized that gameplay is slow and boring. Players and enemies would spend 2 turns moving next to each other and then would just keep fighting in the middle. Positioning in battle field felt clumsy and didn't added much to the gameplay. Using different skills with different patterns felt very limited, restricted and not fun.
