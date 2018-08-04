// import modules

module.exports = {

    // configure GAME settings
    cfgGame: function () {

        // configure MEMORY lists
        Memory.lists = {} ;
        Memory.lists.build = {STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_ROAD,STRUCTURE_TOWER,STRUCTURE_CONTAINER,STRUCTURE_RAMPART,STRUCTURE_WALL} ;
        Memory.lists.repair = {STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_ROAD,STRUCTURE_TOWER,STRUCTURE_CONTAINER} ;

        // configure POPULATION memory for each creep type
        Memory.population = {};
        Memory.population.workers = _.sum(Game.creeps, (c) => c.memory.role == 'worker');
        Memory.population.builders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
        Memory.population.upgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        Memory.population.miners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
        Memory.population.remWorkers = _.sum(Game.creeps, (c) => c.memory.role == 'remWorker');
        Memory.population.remMiners = _.sum(Game.creeps, (c) => c.memory.role == 'remMiner');
        Memory.population.claimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer');

        // set GAME.memory as configured
        Memory.configured = true ;
        Memory.configTime = Game.time ;
    },

    // configure ROOM
    cfgRoom: function (room) {

        // set room Ownership
        room.memory.mine = room.controller.my ;
        room.memory.wallRepairLevel = 10000 ;

        // set ROOM.memory as configured
        room.memory.configured = true ;
        room.memory.configTime = Game.time ;
    },

    // configure SPAWN settings
    cfgSpawn: function (spawn) {

        var roomSourcesBySpawn = spawn.room.find(FIND_SOURCES) ;
        var numberOfRoomSources = roomSourcesBySpawn.length;

        spawn.memory.sources = new Array() ;
        spawn.memory.sourceIds = new Array() ;
        spawn.memory.sourcesNearEnemy = new Array() ;

        for (let i = 0; i <= ( numberOfRoomSources - 1 ) ; i = i + 1) {

            // get closest source to spawn from ARRAY roomSourcesBySpawn
            var closestSource = spawn.pos.findClosestByPath(roomSourcesBySpawn, {ignoreCreeps: true}) ;

            // remove the closestSource from ARRAY before running again
            for (let sourceNumber in roomSourcesBySpawn) {
                if (roomSourcesBySpawn[sourceNumber] == closestSource) {
                    roomSourcesBySpawn.splice(sourceNumber, 1) ;
                    break;
                }
            }
            // make sure there are no hostiles close to the source before adding to spawn sources
            var closestEnemyStructure = closestSource.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES) ;
            var rangeToClosestEnemyStructure = closestSource.pos.getRangeTo(closestEnemyStructure) ;

            if (rangeToClosestEnemyStructure < 5 ) {
                //console.log("skipping spawn source due to enemy structure(s) in vicinity (" + closestSource.id + ")") ;
                spawn.memory.sourcesNearEnemy.push(closestSource.id) ;
            }
            else {

                spawn.memory.sourceIds.push(closestSource.id ) ;
                var sourceArea = spawn.room.lookForAtArea(LOOK_TERRAIN, closestSource.pos.y-1,closestSource.pos.x-1,closestSource.pos.y+1,closestSource.pos.x+1, {asArray: true}) ;
                var sourceAccess = _.sum(sourceArea, (a) => a.terrain == 'plain' || a.terrain == 'swamp') ;

                let sourceDate = {sourceId: closestSource.id, access: sourceAccess} ;
                spawn.memory.sources.push(sourceDate) ;

            }
        }
        spawn.memory.configured = true ;
        spawn.memory.configTime = Game.time ;
    },

    // configure CREEP settings
    cfgFlag: function (flag) {

        if (flag.memory.numRemWorkers == undefined) {
            flag.memory.numRemWorkers = 5
        }

        if (flag.memory.distToSpawn == undefined && flag.memory.spawnId != undefined) {

            let spawn = Game.getObjectById(flag.memory.spawnId) ;
            let path = flag.pos.getRangeTo(spawn) ;

            flag.memory.distToSpawn = path.length ;

            flag.memory.configured = true ;
            flag.memory.configTime = Game.time ;
        }
    },

    // unset CREEP target infomration
    clearTarget: function (creep) {

        // unset memory
        creep.memory.targetId = undefined ;
        creep.memory.targetClass = undefined ;
        creep.memory.targetType = undefined ;
    },

    // a function to run the logic for this role
    cleanup: function () {

        // check for memory for CREEPS who have died
        for (let name in Memory.creeps) {
            // and checking if the creep is still alive
            if (Game.creeps[name] == undefined) {
                // if not, delete the memory entry
                console.log(name + " was a(n) " + Memory.creeps[name].role + " and died.  cost :" + Memory.creeps[name].cost) ;
                delete Memory.creeps[name];
            }
        }

        // check memory for flags that have been deleted
        for (let flag in Memory.flags) {
            // check if flag is still active
            if (Game.flags[flag] == undefined) {
                // if not, delete the memory entry
                console.log(flag + " was deleted because it no longer exists") ;
                delete Memory.flags[flag];
            }
        }

        // check memory for spawns that have been deleted
        for (let spawn in Memory.spawns) {
            // check if flag is still active
            if (Game.spawns[spawn] == undefined) {
                // if not, delete the memory entry
                console.log(spawn + " was deleted because it no longer exists") ;
                delete Memory.spawns[spawn];
            }
        }
    },

};
