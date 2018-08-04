// import modules

var findOutput = module.exports = {

    // unset CREEP target infomration
    clearTarget: function (creep) {

        // unset memory
        creep.memory.targetId = undefined ;
        creep.memory.targetClass = undefined ;
        creep.memory.targetType = undefined ;
    },
    
    // Sets path to SPAWN or EXTENSION STORAGE or returns FALSE
    outSpawn: function (creep) {

        // unset memory
        findOutput.clearTarget(creep) ;

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
            || s.structureType == STRUCTURE_EXTENSION)
            && s.energy < s.energyCapacity
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'transfer' ;
            creep.memory.targetType = 'energy' ;

            return true
        }
        else {

            let spawn = Game.getObjectById(creep.memory.spawnId) ;

            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION)
                && s.energy < s.energyCapacity
            });

            if (target != undefined) {

                creep.memory.targetId = target.id ;
                creep.memory.targetClass = 'transfer' ;
                creep.memory.targetType = 'energy' ;

                return true
            }
            else return false
        }
    },

    // Sets path to EXTENSION only STORAGE or returns FALSE
    outExtension: function (creep) {

        // unset memory
        findOutput.clearTarget(creep) ;

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_EXTENSION
            && s.energy < s.energyCapacity
        });

        if (target != undefined) {

            creep.memory.targetId = target.id ;
            creep.memory.targetClass = 'transfer' ;
            creep.memory.targetType = 'energy' ;

            return true
        }
        else {

            let spawn = Game.getObjectById(creep.memory.spawnId) ;

            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_EXTENSION
                && s.energy < s.energyCapacity
            });

            if (target != undefined) {

                creep.memory.targetId = target.id ;
                creep.memory.targetClass = 'transfer' ;
                creep.memory.targetType = 'energy' ;

                return true
            }
            else return false
        }
    },

    // Set path to CONTAINER STORAGE or return false
    outContainer: function (creep, percent, resource) {

        // unset memory
        findOutput.clearTarget(creep) ;

        if (percent == undefined) {

            percent = 1.0 ;
        }

        if (resource == undefined) {

            resource = RESOURCE_ENERGY ;
        }

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_CONTAINER
            && s.store[resource] < (s.storeCapacity * percent) )
        });

        if (target != undefined) {

            creep.memory.targetId = target.id;
            creep.memory.targetClass = 'transfer';
            creep.memory.targetType = 'store' ;

            return true
        }
        else {

            let spawn = Game.getObjectById(creep.memory.spawnId) ;
            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                && s.store[resource] < (s.storeCapacity * percent) )
            });

            if (target != undefined) {

                creep.memory.targetId = target.id ;
                creep.memory.targetClass = 'transfer' ;
                creep.memory.targetType = 'energy' ;

                return true
            }
            else return false
        }
    },

    // Set path to STORAGE or return false
    outStorage: function (creep, percent, resource) {

        // unset memory
        findOutput.clearTarget(creep) ;

        if (percent == undefined) {

            percent = 1.0 ;
        }

        if (resource == undefined) {

            resource = RESOURCE_ENERGY ;
        }

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_STORAGE
            && s.store[resource] < (s.storeCapacity * percent) )
        });

        if (target != undefined) {

            creep.memory.targetId = target.id;
            creep.memory.targetClass = 'transfer';
            creep.memory.targetType = 'store' ;

            return true
        }
        else {

            let spawn = Game.getObjectById(creep.memory.spawnId) ;
            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_STORAGE
                && s.store[resource] < (s.storeCapacity * percent) )
            });

            if (target != undefined) {

                creep.memory.targetId = target.id ;
                creep.memory.targetClass = 'transfer' ;
                creep.memory.targetType = 'store' ;

                return true
            }
            else return false
        }
    },

    // Sets path to TOWER STORAGE or returns FALSE
    outTower: function (creep, percent) {

        // unset memory
        findOutput.clearTarget(creep) ;

        if (percent == undefined) {

            percent = 1.0 ;
        }

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
            && s.energy < (s.energyCapacity * percent)
        });

        if (target != undefined) {

            creep.memory.targetId = target.id;
            creep.memory.targetClass = 'transfer';
            creep.memory.targetType = 'energy' ;

            return true
        }
        else {

            let spawn = Game.getObjectById(creep.memory.spawnId) ;
            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_TOWER
                && s.energy < (s.energyCapacity * percent)
            });

            if (target != undefined) {

                creep.memory.targetId = target.id ;
                creep.memory.targetClass = 'transfer' ;
                creep.memory.targetType = 'energy' ;

                return true
            }
            else return false
        }
    },

    // Sets path to BUILD SITE
    outBuildSite: function (creep) {

        // unset memory
        findOutput.clearTarget(creep) ;

        for (let type in Memory.lists.build) {

            let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
                filter: (s) => s.structureType == Memory.lists.build[type]
            }) ;

            if (target != undefined) {

                creep.memory.targetId = target.id;
                creep.memory.targetClass = 'build';

                return true
            }
        }

        let spawn = Game.getObjectById(creep.memory.spawnId) ;

        for (let type in Memory.lists.build) {

            let target = spawn.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
                filter: (s) => s.structureType == Memory.lists.build[type]
            }) ;

            if (target != undefined) {

                creep.memory.targetId = target.id;
                creep.memory.targetClass = 'build';

                return true
            }
        }

        return false
    },

    // Sets path to BUILD SITE
    outExtensionSite: function (creep) {

        // unset memory
        findOutput.clearTarget(creep) ;

        let target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {
            filter: (s) => s.structureType == STRUCTURE_EXTENSION
        }) ;

        if (target != undefined) {

            creep.memory.targetId = target.id;
            creep.memory.targetClass = 'build';

            return true
        }

        let spawn = Game.getObjectById(creep.memory.spawnId) ;

        let auxTarget = spawn.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION}) ;

        if (auxTarget != undefined) {

            creep.memory.targetId = auxTarget.id;
            creep.memory.targetClass = 'build';

            return true
        }

        return false
    },

    // Sets path to REPAIR SITE
    outRepairSite: function (creep, percent) {

        // unset memory
        findOutput.clearTarget(creep) ;

        if (percent == undefined) {
            percent = 1.0
        }

        for (let type in Memory.lists.repair) {

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < ( s.hitsMax * percent )
                && s.structureType == Memory.lists.repair[type]
            }) ;

            if (target != undefined) {

                creep.memory.targetId = target.id;
                creep.memory.targetClass = 'repair';

                return true
            }
        }

        let spawn = Game.getObjectById(creep.memory.spawnId) ;

        for (let type in Memory.lists.repair) {

            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < ( s.hitsMax * percent )
                && s.structureType == Memory.lists.repair[type]
            }) ;

            if (target != undefined) {

                creep.memory.targetId = target.id;
                creep.memory.targetClass = 'repair';

                return true
            }
        }

        return false
    },

    // Sets path to REPAIR SITE
    outWallSite: function (creep, maxHits) {

        // unset memory
        findOutput.clearTarget(creep) ;

        if (maxHits == undefined) {
            maxHits = creep.room.memory.wallRepairLevel
        }

        for (let type in Memory.lists.repair) {

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < maxHits
                && (s.structureType == STRUCTURE_WALL
                || s.structureType == STRUCTURE_RAMPART)
            }) ;

            if (target != undefined) {

                creep.memory.targetId = target.id;
                creep.memory.targetClass = 'repair';

                return true
            }
        }

        let spawn = Game.getObjectById(creep.memory.spawnId) ;

        for (let type in Memory.lists.repair) {

            let target = spawn.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < maxHits
                && (s.structureType == STRUCTURE_WALL
                || s.structureType == STRUCTURE_RAMPART)
            }) ;
            if (target != undefined) {

                creep.memory.targetId = target.id;
                creep.memory.targetClass = 'repair';

                return true
            }
        }

        return false
    },

};
