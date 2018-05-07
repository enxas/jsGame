const Battlefield = require("../models/battlefield");
module.exports = {
    calculateDamage: function (x, y, skillId, bfInfo, direction, actorX, actorY, userId, partyId, callback) {
      
        let affectedTiles = [];
        let combatLog = [];
        let rotateAroundAxis = true;
        const updatedInfoObj = {};
        console.log(`skillId: ${skillId}`);
        switch (skillId) {
            case 1:
            console.log('case 1');
                affectedTiles.push([x, y]);
            break;
            case 2:
            console.log('case 2');
                // pattern https://puu.sh/AhbAO/6d9d4a9241.jpg
                const patterns = [[0,-1],[1,0],[0,1]];
                affectedTiles = rotate(patterns, direction);  
            break;
            default:
            console.log('case DEFAULT');
              return null;
          }

       
          let newActionPoints = bfInfo.actors.players[userId].actionPoints - 2;
          let playersActionPoints = 'actors.players.'+ userId + '.actionPoints';
          updatedInfoObj[playersActionPoints] = newActionPoints;
        
              // check affected tiles for enemies and performa damage to affected enemies
              console.log(`before afftiles: ${affectedTiles}`);
            for (let affectedTile of affectedTiles) {
                  console.log('affectedTile:');
                  console.log(affectedTile);
              for (let enemy in bfInfo.actors.enemies) {
                if (bfInfo.actors.enemies[enemy].x === affectedTile[0] && bfInfo.actors.enemies[enemy].y === affectedTile[1]) {
                  console.log('found enemy');

                  let playerAttackMultiplier = bfInfo.actors.players[userId].attack / 100 * bfInfo.playersMultiplier;
                  let enemyDefenceMultiplier = bfInfo.actors.enemies[enemy].defence / 100 * bfInfo.enemiesMultiplier;
              
                  let damage = parseInt((bfInfo.actors.players[userId].attack + playerAttackMultiplier) - (bfInfo.actors.enemies[enemy].defence + enemyDefenceMultiplier));
                  console.log(`dmage: ${damage}`);
                 
            

                  if (damage > 0) {
                    let enemyLeftHealth = bfInfo.actors.enemies[enemy].hpLeft - damage;
                    let leftHealth = 'actors.enemies.'+ enemy + '.hpLeft';
                    updatedInfoObj[leftHealth] = enemyLeftHealth;
                    combatLog.push({
                        attackingActor: userId,
                        attackedActor: enemy,
                        damage: damage,
                        actionPoints: newActionPoints
                    });
                  } else {
                    combatLog.push({
                        attackingActor: userId,
                        attackedActor: enemy,
                        damage: 0,
                        actionPoints: newActionPoints
                    });
                  }
        

                }
              }
            }


            Battlefield.update({partyId: partyId}, {'$set': updatedInfoObj}, 
            function (err, success) {
                if (err) {
                
                } else {
                    callback(combatLog);
                }
            });
       
     

          function rotate(patterns, direction) {
         /* 
            Rotate skill pattern around axis (North, East, South, West)
            C - Clockwise, CC - Counter Clockwise
            90° (x, y) -> C(y, -x) -> CC(-y, x)
            180° (x, y) -> C(-x, -y) -> CC(-x, -y)
            270° (x, y) -> C(-y, x) -> CC(y, -x)
        */
            const rotatedPatterns = [];

            for (let pattern of patterns) {
                if (direction === 'N') {
                    // rotate 270° C(-y, x)
                    let dif1 = pattern[1] + actorX; 
                    let dif2 = -pattern[0] + actorY;
                    rotatedPatterns.push([dif1, dif2]);
                }else if (direction === 'E') {
                    // no need to rotate
                    rotatedPatterns.push([pattern[0] + actorX, pattern[1] + actorY]);
                }else if (direction === 'S') {
                    // rotate 90° C(y, -x)
                    let dif1 = -pattern[1] + actorX;
                    let dif2 = pattern[0] + actorY;
                    rotatedPatterns.push([dif1, dif2]);  
                }else if (direction === 'W') {
                    // rotate 180° C(-x, -y)
                    let dif1 = -pattern[0] + actorX; 
                    let dif2 = -pattern[1] + actorY;
                    rotatedPatterns.push([dif1, dif2]);
                }   
            }

            return rotatedPatterns;
          }

    },
  };