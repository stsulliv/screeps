// import modules
var configure = require ('configure') ;
var managerSpawn = require ('manager.spawn') ;
var managerCreep = require ('manager.creep') ;

module.exports = {

    // set single build target for spawn
    mgrRoom: function (room) {

        var towers = room.find(FIND_MY_STRUCTURES, {
            filter : (s) => s.structureType == STRUCTURE_TOWER
        });

        for (let t in towers) {

            let tower = towers[t] ;
            let target = towers[t].pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            if (target != undefined) {
                tower.attack(target);
            }
            else {
                let hurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (c) => (c.hits < c.hitsMax)
                });

                if (hurtCreep != undefined) {
                    tower.heal(hurtCreep);
                }
                else {

                    let damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.hits < s.hitsMax)
                        && (s.structureType != STRUCTURE_RAMPART)
                        && (s.structureType != STRUCTURE_WALL)
                    });

                    if (damagedStructure != undefined && tower.energy >= (tower.energyCapacity * .5)) {
                        tower.repair(damagedStructure);
                    }

                    else if (tower.energy >= (tower.energyCapacity * .75)) {

                        for (let minHits = 10000; minHits <= room.memory.wallRepairLevel; minHits = minHits + 5000) {

                            // find a wall with less than percentage hits
                            target = tower.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (s) => (s.structureType == STRUCTURE_WALL
                                || s.structureType == STRUCTURE_RAMPART)
                                && s.hits < minHits
                            });

                            // if there is one
                            if (target != undefined) {

                                tower.repair(target);
                                break;
                            }
                        }
                    }
                }
            }
        }
    },

    // set single build target for spawn
    mgrSpawn: function (spawn) {

        // if SPAWN is not in the process of spawning a CREEP
        if (spawn.spawning == null) {

            //get room Energy status
            var roomEnergy = spawn.room.energyAvailable ;
            var roomCapacity = spawn.room.energyCapacityAvailable ;

            // checks minimum energy required for spawn and current population
            if (roomEnergy >= 250 && (_.sum(Game.creeps, (c) => c.memory.role == 'miner' && c.memory.spawnId == spawn.id)) == 0) {

                //console.log("running level 1 spawn routine") ;

                spawn.memory.spawnTime = Game.time ;
                managerSpawn.run(spawn, roomEnergy)
            }
            if (roomEnergy >= 300 && (_.sum(Game.creeps, (c) => c.memory.role == 'miner' && c.memory.spawnId == spawn.id)) == 0) {

                //console.log("running level 1 spawn routine") ;

                spawn.memory.spawnTime = Game.time ;
                managerSpawn.run(spawn, roomEnergy)
            }
            else if (roomEnergy >= 300 && roomEnergy == roomCapacity ) {

                //console.log("running level 2 spawn routine") ;

                spawn.memory.spawnTime = Game.time ;
                managerSpawn.run(spawn, roomEnergy)
            }

            else if (roomCapacity <= 800 && roomEnergy == roomCapacity) {

                //console.log("running level 3 spawn routine") ;

                spawn.memory.spawnTime = Game.time ;
                managerSpawn.run(spawn, roomEnergy)
            }
            else if (roomEnergy >= 800 && (Game.time - spawn.memory.spawnTime) >= 30) {

                //console.log("running level 4 spawn routine") ;

                spawn.memory.spawnTime = Game.time ;
                managerSpawn.run(spawn, roomEnergy)
            }
        }
    },

    // a function to run the logic for this role
    mgrCreep: function (creep) {

        // if CREEP is not in the process of being SPAWNED
        if (creep.spawning  != true ) {

            //get room Energy status
            var roomEnergy = creep.room.energyAvailable ;
            var spawn = Game.getObjectById(creep.memory.spawnId) ;
            var rangeToSpawn = creep.pos.getRangeTo(spawn) ;

            if (creep.memory.role == 'miner') {

                managerCreep.mgrMiner(creep)
            }

            else if (creep.memory.role == 'remMiner') {

                managerCreep.mgrRemMiner(creep)
            }

            else if (creep.ticksToLive <= 0
                && roomEnergy > 300
                && rangeToSpawn <= 50) {

                if (spawn.renewCreep(creep) != OK) {
                    creep.moveTo(spawn) ;
                }
            }

            else if (creep.ticksToLive <= 0
                &&roomEnergy >= 550
                && rangeToSpawn <= 25) {

                if (spawn.renewCreep(creep) != OK) {
                    creep.moveTo(spawn) ;
                }
            }

            else if (creep.ticksToLive <= 0
                &&roomEnergy >= 800
                && rangeToSpawn <= 15) {

                if (spawn.renewCreep(creep) != OK) {
                    creep.moveTo(spawn) ;
                }
            }

            else if (creep.memory.role == 'worker') {

                managerCreep.mgrWorker(creep)
            }
            else if (creep.memory.role == 'builder') {

                managerCreep.mgrBuilder(creep)
            }
            else if (creep.memory.role == 'upgrader') {

                managerCreep.mgrUpgrader(creep)
            }
            else if (creep.memory.role == 'remWorker') {

                managerCreep.mgrRemWorker(creep)
            }
            else if (creep.memory.role == 'claimer') {

                managerCreep.mgrClaimer(creep)
            }
            else if (creep.memory.role == 'archer') {

                managerCreep.mgrArcher(creep)
            }
            else if (creep.memory.role == 'soldier') {

                managerCreep.mgrSoldier(creep)
            }
        }
    }
};
