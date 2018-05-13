const Battlefield = require("../models/battlefield");
const skillPatterns = require("./skillPatterns");
module.exports = {
    calculateDamage: function (x, y, skillId, bfInfo, direction, actorX, actorY, userId, partyId, callback) {
      
        let affectedTiles = [];
        let combatLog = [];
        const skill = skillPatterns[skillId];

        console.log(`direction: ${direction}`);

        if (skill.distance === 'close') {
            affectedTiles = rotate(skill.pattern, direction);  
        } else if (skill.distance === 'far') {
            const farPatterns = [];
            for (let pattern of skill.pattern) {
                farPatterns.push([ pattern[0] + x, pattern[1] + y]);
            }
            affectedTiles = farPatterns;
        }

        const updatedInfoObj = {};
        let newActionPoints = bfInfo.actors.players[userId].actionPoints - 2;
        let playersActionPoints = 'actors.players.'+ userId + '.actionPoints';
        updatedInfoObj[playersActionPoints] = newActionPoints;
        
        // check affected tiles for enemies and performa damage to enemies that are on affected tiles
        console.log(`before afftiles: ${affectedTiles}`);
        for (let affectedTile of affectedTiles) {
            console.log('affectedTile:');
            console.log(affectedTile);
            for (let enemy in bfInfo.actors.enemies) {
                if (bfInfo.actors.enemies[enemy].x === affectedTile[0] && bfInfo.actors.enemies[enemy].y === affectedTile[1]) {
                    console.log('found enemy');
                    let playerAttack = parseInt(bfInfo.actors.players[userId].attack + (bfInfo.actors.players[userId].attack / 100 * bfInfo.playersMultiplier));
                    let enemyDefence = parseInt(bfInfo.actors.enemies[enemy].defence + (bfInfo.actors.enemies[enemy].defence / 100 * bfInfo.enemiesMultiplier));
                    let damage = parseInt(playerAttack - enemyDefence);
                    console.log(`Player attack: ${playerAttack} Enemy defence: ${enemyDefence} Dmage: ${damage}`);
                 
                    if (damage > 0) {
                        let enemyLeftHealth = bfInfo.actors.enemies[enemy].hpLeft - damage;
                        let leftHealth = 'actors.enemies.'+ enemy + '.hpLeft';
                        updatedInfoObj[leftHealth] = enemyLeftHealth;
                        combatLog.push({
                            attackingActor: userId,
                            attackedActor: enemy,
                            attackPts: playerAttack,
                            defencePts: enemyDefence,
                            damage: damage,
                            skillId: skillId,
                            actionPoints: newActionPoints
                        });
                    } else {
                        combatLog.push({
                            attackingActor: userId,
                            attackedActor: enemy,
                            attackPts: playerAttack,
                            defencePts: enemyDefence,
                            damage: 0,
                            skillId: skillId,
                            actionPoints: newActionPoints
                        });
                    }
                }
            }
        }

        Battlefield.update({partyId: partyId}, {'$set': updatedInfoObj}, 
            function (err, success) {
                if (err) {
                    // if error occurred
                } else {
                    callback(combatLog);
                }
        });
       
     
        function rotate(patterns, direction) {
             /* 
            Rotate skill pattern around axis (North, East, South, West)
            C - Clockwise, CC - Counter Clockwise
            90° (x, y) -> C(y, -x) | CC(-y, x)
            180° (x, y) -> C(-x, -y) | CC(-x, -y)
            270° (x, y) -> C(-y, x) | CC(y, -x)
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