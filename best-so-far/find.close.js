// import modules

var findClose = module.exports = {

    // resets CREEP's TARGET information
    targetReset: function (creep) {

        creep.memory.targetPath = undefined;
        creep.memory.targetId = undefined;
        creep.memory.targetClass = undefined;
    },

    // a function to run the logic for this role - CLOSE SOURCE
    closeSource: function (creep, range) {

        if (range == undefined) {

            range = 5
        }

        let targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, range, {
            filter: (e) => e.amount >= 50
        });

        if (targets[0] != undefined) {

            // set to memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.pickup(target) != OK) {

                // move towards target
                creep.moveTo(target);
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE DROPPED_ENERGY
    droppedEnergy: function (creep, range) {

        if (range == undefined) {

            range = 5
        }

        let targets = creep.pos.findInRange(FIND_DROPPED_ENERGY, range, {
            filter: (e) => e.amount >= 50
        });

        if (targets[0] != undefined) {

            // set to memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.pickup(target) != OK) {

                // move towards target
                creep.moveTo(target);
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE BUILD TARGETS
    buildSite: function (creep, range) {

        if (range == undefined) {

            range = 5
        }

        // find structure to build
        let targets = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, range);

        if (targets[0] != undefined) {

            // set to memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.build(target) != OK) {

                creep.moveTo(targets[0]);
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE REPAIR TARGETS
    repairSite: function (creep, range, percent) {

        if (range == undefined) {

            range = 5
        }
        if (percent == undefined) {
            percent = 1.0
        }

        // find structure to repair
        let targets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (s) => s.hits < ( s.hitsMax * percent )
            && s.structureType != STRUCTURE_WALL
            && s.structureType != STRUCTURE_RAMPART
        });

        if (targets[0] != undefined) {

            // unset memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.repair(target) != OK) {

                creep.moveTo(target);
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE HOSTILE
    hostile: function (creep, range) {

        if (range == undefined) {

            range = 5
        }
        let numAttack = _.sum(creep.body, (b) => b.type == ATTACK) ;
        let numRangeAttack = _.sum(creep.body, (b) => b.type == RANGED_ATTACK) ;
        let targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);

        if (targets[0] != undefined) {

            // unset memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (numRangeAttack > 0 && creep.rangedAttack(target) != OK) {

                creep.moveTo(target, {reusePath: 0});
            }
            else if (numAttack > 0 && creep.attack(target) != OK) {

                creep.moveTo(target, {reusePath: 0});
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE SPAWN
    closeSpawn: function (creep, range) {

        if (range == undefined) {
            range = 5
        }

        // find close SPAWN
        let targets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
            || s.structureType == STRUCTURE_EXTENSION)
            && s.energy < s.energyCapacity
        });


        if (targets[0] != undefined) {

            // unset memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.transfer(target, RESOURCE_ENERGY) != OK) {
                creep.moveTo(target);
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE CONTAINER
    closeContainer: function (creep, range, resource) {

        if (range == undefined) {
            range = 5
        }

        if (resource == undefined) {

            resource = RESOURCE_ENERGY ;
        }

        // find close SPAWN
        let targets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
                        && s.store[resource] < s.storeCapacity
        });


        if (targets[0] != undefined) {

            // unset memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.transfer(target, RESOURCE_ENERGY) != OK) {
                creep.moveTo(target)
            }
            return true
        }
        else return false
    },

    // a function to run the logic for this role - CLOSE TOWER
    closeTower: function (creep, range, percent) {

        if (range == undefined) {

            range = 5
        }
        if (percent == undefined) {

            percent = 1.0;
        }

        // find close SPAWN
        let targets = creep.pos.findInRange(FIND_STRUCTURES, range, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
                        && s.energy < ( s.energyCapacity * percent )
        });


        if (targets[0] != undefined) {

            // unset memory
            findClose.targetReset(creep);

            let target = creep.pos.findClosestByPath(targets);

            if (creep.transfer(target, RESOURCE_ENERGY) != OK) {

                creep.moveTo(target);
            }
            return true
        }
        else return false
    },

};
