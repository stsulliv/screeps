// import modules

var findInput = module.exports = {

    // unset CREEP target infomration
    clearTarget: function (creep) {

        // unset memory
        creep.memory.targetId = undefined ;
        creep.memory.targetClass = undefined ;
        creep.memory.targetType = undefined ;
    },
    
    // Set path to ENERGY or returns FALSE
    energyPile: function (creep) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use SPAWN position
        var spawn = Game.getObjectById(creep.memory.spawnId) ;

        for (let i = 1000; i >= 200 ; i = i - 50) {

            // use CREEP position
            let target = creep.pos.findClosestByPath(spawn.room.find(FIND_DROPPED_ENERGY), {
                filter: (p) => p.amount >= i
            });


            if (target != undefined) {

                creep.memory.targetId = target.id ;
                creep.memory.targetClass = 'pickup';

                break
            }
            else {

                // use CREEP position
                let target = spawn.pos.findClosestByPath(spawn.room.find(FIND_DROPPED_ENERGY), {
                    filter: (p) => p.amount >= i
                });


                if (target != undefined) {

                    creep.memory.targetId = target.id ;
                    creep.memory.targetClass = 'pickup';

                    break
                }
            }
        }
        return (creep.memory.targetId != undefined) ;
    },

    // Set path to SOURCE or returns FALSE
    inpSource: function (creep) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use CREEP position
        var sources = creep.room.find(FIND_SOURCES);
        var numberSources = sources.length ;

        for (let i = 1; i <= numberSources ; i = i + 1) {

            let closestSource = creep.pos.findClosestByPath(sources) ;

            if (closestSource != undefined) {

                let closestHostileStructure = closestSource.pos.findInRange(FIND_HOSTILE_STRUCTURES, 10) ;
                let closestHostileCreep = closestSource.pos.findInRange(FIND_HOSTILE_CREEPS, 10) ;

                if (closestHostileStructure[0] != undefined || closestHostileCreep[0] != undefined) {

                    for (let s in sources) {

                        if (sources[s] == closestSource) {

                            console.log("skipping source id '" + closestSource.id + "' because Hostiles in vicinity") ;
                            sources.splice(t, 1) ;
                        }
                    }
                }
                else {

                    creep.memory.targetId = closestSource.id;
                    creep.memory.targetClass = 'harvest';

                    break ;
                }
            }
            else {

                break ;
            }

        }
        return (creep.memory.targetId != undefined) ;
    },

    // Sets path to TOWER or returns FALSE
    inpSpawn: function (creep, percent) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use CREEP position
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
                        || s.structureType == STRUCTURE_EXTENSION)
                        && s.energy >= (s.energyCapacity * percent)
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'withdraw' ;
            creep.memory.targetType = 'energy' ;

            return true
        }
        else return false
    },

    // Sets path to TOWER or returns FALSE
    inpTower: function (creep, percent) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use CREEP position
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
                        && s.energy >= (s.energyCapacity * percent)
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'withdraw' ;
            creep.memory.targetType = 'energy' ;

            return true ;
        }
        else return false ;
    },

    // Set path to CONTAINER or returns FALSE
    inpContainer: function (creep, percent, resource) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use CREEP position
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                        && s.store[resource] >= (s.storeCapacity * percent) )
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'withdraw';
            creep.memory.targetType = 'store' ;

            return true
        }
        else return false
    },

    // Set path to STORAGE or returns FALSE
    inpStorage: function (creep, percent, resource) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use creep position
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE
            && s.store[resource] >= (s.storeCapacity * percent) )
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'withdraw' ;
            creep.memory.targetType = 'store' ;

            return true
        }
        else return false
    },


    // Set path to STORAGE or returns FALSE
    inpDismantleHostileStructure: function (creep) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use CREEP position
        let target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'dismantle' ;

            return true
        }
        else return false
    },


    // Set path to STORAGE or returns FALSE
    inpDismantleWall: function (creep) {

        // unset memory
        findInput.clearTarget(creep) ;

        // use CREEP position
        let target = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => s. structureType == STRUCTURE_WALL
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'dismantle' ;

            return true
        }
        else return false
    },


};
