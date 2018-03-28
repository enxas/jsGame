module.exports = {
    reformWorld: function (world) {
        // https://imgur.com/a/eeVmH
        var worldFlipped = [];
        for (let x=0; x < 25; x++)
        {
            worldFlipped[x] = [];

            for (let y=0; y < 16; y++)
            {
                worldFlipped[x][y] = world[15-y][24-x];
            }
            
            worldFlipped[x] = worldFlipped[x].slice().reverse();
        }
        
        var worldReformed = [];
        for (let x=0; x < 25; x++)
        {
            worldReformed[x] = worldFlipped[24-x];

        }


        // pad the world with 999
        for (var x=0; x < 25; x++)
        {

            for (var y=16; y < 25; y++)
            {
                worldReformed[x][y] = 999;
            }
        }

        return worldReformed;
    },
    createObstacleCollision: function (world) {
        let obstacle = [];
        for (let x=0; x < 25; x++)
        {
            for (let y=0; y < 16; y++)
            {
        
                if (world[y][x] != 0) {
                    
                    obstacle[`${x}-${y}`] = {'x': x, 'y': y};
                }
            }
        }
        
        return obstacle;
    }
  };