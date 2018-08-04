// import modules
var configure = require ('configure') ;
var manager = require ('manager') ;

module.exports.loop = function () {

    // run MEMORY clean-up
    configure.cleanup() ;

    //set PATHFINDER to true
    PathFinder.use(true);

    // run Configuration for Game, Rooms, Spawns, Flags, Creep

    // Configure the GAME
    if (Memory.configured != true
    || (Game.time - Memory.configTime) >= 30) {

        configure.cfgGame() ;
    }

    // For every ROOM
    for (let room in Game.rooms) {

        // Configure the room every 30 seconds
        if (Game.rooms[room].memory.configured != true
        || (Game.time - Game.rooms[room].memory.configTime) >= 30) {

            configure.cfgRoom(Game.rooms[room]) ;
        }

        manager.mgrRoom(Game.rooms[room]) ;
    }

    // For every SPAWN
    for (let spawn in Game.spawns) {

        // Configure the SPAWN every 30 seconds
        if (Game.spawns[spawn].memory.configured != true
        || (Game.time - Game.spawns[spawn].memory.configTime) >= 30) {

            configure.cfgSpawn(Game.spawns[spawn]) ;
        }

        manager.mgrSpawn(Game.spawns[spawn]) ;
    }

    // For every FLAG
    for (let flag in Game.flags) {

        // Configure the FLAG every 60 seconds
        if (Game.flags[flag].memory.configured != true
            || (Game.time - Game.flags[flag].memory.configTime) >= 60) {

            configure.cfgFlag(Game.flags[flag])
        }
    }

    // for every CREEP
    for (let creep in Game.creeps) {

        if (Game.creeps[creep].memory.role == 'harvester') {

            Game.creeps[creep].memory.role = 'worker'
        }
        else if (Game.creeps[creep].memory.role == 'remHarvester') {

            Game.creeps[creep].memory.role = 'remWorker'
        }

        manager.mgrCreep(Game.creeps[creep]) ;
    }
};