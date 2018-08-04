// import Modules
var findInput = require('find.input') ;
var findOutput = require('find.output') ;
var findClose = require('find.close') ;
var findRemote = require('find.remote') ;

var manager = module.exports = {

    // unset CREEP target infomration
    clearTarget: function (creep) {

        // unset memory
        creep.memory.targetId = undefined ;
        creep.memory.targetClass = undefined ;
        creep.memory.targetType = undefined ;
    },

    // WORKER role
    mgrWorker: function(creep) {

        // if CREEP is empty change CHARGE to false
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }

        // if CREEP is full change CHARGE to true
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if CREEP is charged
        if (creep.memory.charged == true) {

            if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findOutput.outSpawn(creep)) {}
                else if (findOutput.outExtensionSite(creep)) {}
                else if (findOutput.outTower(creep, 0.8)) {}
                else if (findOutput.outBuildSite(creep)) {}
                else if (findOutput.outStorage(creep, 1.0, RESOURCE_ENERGY)) {}
                else {
                    let spawn = Game.getObjectById(creep.memory.spawnId) ;
                    creep.memory.targetId = spawn.room.controller.id ;
                    creep.memory.targetClass = 'upgradeController' ;
                }
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetType == 'energy' && target.energy == target.energyCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == target.storeCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetClass == 'transfer') {

                    if (creep.transfer(target, RESOURCE_ENERGY) != OK ) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

                else {

                    if (creep[creep.memory.targetClass](target) != OK ) {

                        if (creep.moveTo(target) != OK) {

                            manager.clearTarget(creep) ;
                        }

                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }

        // if CREEP is not charged
        else if (creep.memory.charged == false) {

            if (findClose.droppedEnergy(creep, 3)) {}

            else if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findInput.energyPile(creep)) {}
                else if (findInput.inpContainer(creep, 0.0, RESOURCE_ENERGY)) {}
                else if (findInput.inpStorage(creep, 0.0, RESOURCE_ENERGY)) {}

            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetClass == 'withdraw') {

                    if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
                else {

                    if (creep[creep.memory.targetClass](target) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

            }
        }
    },

    // BUILDER role
    mgrBuilder: function(creep) {

        // if CREEP is empty change CHARGE to false
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }

        // if CREEP is full change CHARGE to true
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if CREEP is chraged
        if (creep.memory.charged == true) {

            if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                let roomTowers = creep.pos.findClosestByRange(FIND_STRUCTURES, (s) => s.structureType == STRUCTURE_TOWER) ;

                if (findOutput.outBuildSite(creep)) {}
                else if (roomTowers == undefined && findOutput.outRepairSite(creep, 0.8)) {}
                else if (findOutput.outExtension(creep)) {}
                else if (findOutput.outSpawn(creep)) {}
                else if (findOutput.outTower(creep, 0.8)) {}

                else {
                    let spawn = Game.getObjectById(creep.memory.spawnId) ;
                    creep.memory.targetId = spawn.room.controller.id ;
                    creep.memory.targetClass = 'upgradeController' ;
                }
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                // clear TARGET information if TARGET becomes full
                if (creep.memory.targetType == 'energy' && target.energy == target.energyCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == target.storeCapacity) {

                    manager.clearTarget(creep) ;
                }

                // TRANSFER reuires RESOURCE_ENERGY
                else if (creep.memory.targetClass == 'transfer') {

                    if (creep.transfer(target, RESOURCE_ENERGY) != OK ) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

                // BUILD, REPAIR and UPGRADECONTROLLER
                else {

                    if (creep[creep.memory.targetClass](target) != OK ) {

                        creep.moveTo(target) ;
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }

        // if creep is supposed to harvest energy from source
        else if (creep.memory.charged == false) {

            if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findInput.inpDismantleHostileStructure(creep)) {}
                else if (findInput.energyPile(creep)) {}
                else if (findInput.inpStorage(creep, 0.0, RESOURCE_ENERGY)) {}
                else if (findInput.inpContainer(creep, 0.0, RESOURCE_ENERGY)) {}
                else if (findInput.inpSource(creep)) {}
            }

            else {

                if (findClose.droppedEnergy(creep, 5)) {}

                else {

                    let target = Game.getObjectById(creep.memory.targetId) ;

                    // make sure TARGET hasn't changed to EMPTIED
                    if (creep.memory.targetType == 'energy' && target.energy == 0) {

                        manager.clearTarget(creep) ;
                    }

                    else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == 0) {

                        manager.clearTarget(creep) ;
                    }

                    if (creep.memory.targetClass == 'withdraw') {

                        if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                            if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                                manager.clearTarget(creep) ;
                            }
                        }
                        else {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        if (creep[creep.memory.targetClass](target) != OK) {

                            if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                                manager.clearTarget(creep) ;
                            }
                        }
                        else {

                            manager.clearTarget(creep) ;
                        }
                    }
                }
            }
        }
    },

    // MINER role
    mgrMiner: function(creep) {

        var spawn = Game.getObjectById(creep.memory.spawnId) ;

        // assign free SOURCE to MINER
        if (creep.memory.targetId == undefined) {

            for (let s in spawn.memory.sourceIds) {

                let numMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner'
                                                        && c.memory.spawnId == spawn.id
                                                        && c.memory.targetId == spawn.memory.sourceIds[s]) ;
                if (numMiners == 0) {
                    creep.memory.targetId = spawn.memory.sourceIds[s] ;
                    break
                }
            }
        }

        // special handling for small MINERS without storage
        else if (creep.carryCapacity == 0 ) {

            let target = Game.getObjectById(creep.memory.targetId);

            if (creep.harvest(target) != OK) {
                creep.moveTo(target) ;
            }
        }
        // if creep is bringing energy to the spawn but has no energy left
        else if (creep.memory.charged == true && creep.carry.energy == 0) {

            creep.memory.charged = false ;
        }

        // if creep is harvesting energy but is full
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            creep.memory.charged = true ;
        }

        // if Miner is full
        else if (creep.memory.charged == true) {

            if (findClose.closeSpawn(creep, 3 )) {}
            else if (findClose.closeTower(creep, 3, 0.5 )) {}
            else if (findClose.closeContainer(creep, 4 )) {}
            else creep.drop(RESOURCE_ENERGY)
        }

        // if creep is supposed to harvest energy from source
        else if (creep.memory.charged == false) {

            let target = Game.getObjectById(creep.memory.targetId);

            if (target != undefined) {

                if (creep.harvest(target) != OK) {
                    creep.moveTo(target) ;
                }
            }
            else manager.clearTarget(creep) ;
        }
    },

    // UPGRADER role
    mgrUpgrader: function(creep) {

        // if CREEP is empty change CHARGE to false
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }

        // if CREEP is full change CHARGE to true
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if creep is supposed to transfer energy to the spawn
        if (creep.memory.charged == true) {

            if (creep.room.controller.ticksToDowngrade > 1000 && findOutput.outExtensionSite(creep)) {}

            else{
                let spawn = Game.getObjectById(creep.memory.spawnId) ;
                creep.memory.targetId = spawn.room.controller.id ;

                if (creep.upgradeController(spawn.room.controller) != OK ) {

                    creep.moveTo(creep.room.controller) ;
                }
            }
        }

        // if creep is supposed to harvest energy from source
        else if (creep.memory.charged == false) {

            if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findInput.energyPile(creep)) {}
                else if (findInput.inpStorage(creep, 0.0, RESOURCE_ENERGY)) {}
                else if (findInput.inpContainer(creep, 0.0, RESOURCE_ENERGY)) {}
                else if (findInput.inpSource(creep)) {}
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetClass == 'withdraw') {

                    if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
                else {

                    if (creep[creep.memory.targetClass](target) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }
    },

    // REMOTE WORKER role
    mgrRemWorker: function(creep) {

        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if creep is supposed to transfer energy
        if (creep.memory.charged == true) {

            let numWeapons = _.sum(creep.body, (b) => b.type == ATTACK || b.type == RANGED_ATTACK) ;
            let roomTowers = creep.pos.findClosestByRange(FIND_STRUCTURES, (s) => s.structureType == STRUCTURE_TOWER) ;

            if (numWeapons > 0 && findClose.hostile(creep, 5)) {}

            else if (findClose.closeSpawn(creep, 3 )) {}
            else if (findClose.buildSite(creep, 3)) {}
            else if (findClose.repairSite(creep, 1, 1.0)) {}
            else if (roomTowers == undefined && findClose.repairSite(creep, 2, 1.0)) {}

            else if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findOutput.outBuildSite(creep)) {}
                else if (findOutput.outStorage(creep, 1.0)) {}

                else {
                    let spawn = Game.getObjectById(creep.memory.spawnId) ;
                    creep.memory.targetId = spawn.room.controller.id ;
                    creep.memory.targetClass = 'upgradeController' ;
                }
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                // make sure Target hasn't changed to FULL
                if (creep.memory.targetType == 'energy' && target.energy == target.energyCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == target.storeCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetClass == 'transfer') {

                    if (creep.transfer(target, RESOURCE_ENERGY) != OK ) {

                        creep.moveTo(target, {reusePath: 15})
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

                else {

                    if (creep[creep.memory.targetClass](target) != OK ) {

                        creep.moveTo(target) ;
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }

        // if creep is supposed to harvest energy
        else if (creep.memory.charged == false) {

            let numWeapons = _.sum(creep.body, (b) => b.type == ATTACK || b.type == RANGED_ATTACK) ;

            if (numWeapons > 0 && findClose.hostile(creep, 5)) {}

            else if (findClose.droppedEnergy(creep, 0)) {}

            else if (creep.memory.targetFlag == undefined) {
                findRemote.remSource(creep)
            }

            else {

                let target = Game.flags[creep.memory.targetFlag] ;
                let rangeToFlag = creep.pos.getRangeTo(target) ;

                if (rangeToFlag <=3 && findClose.droppedEnergy(creep, 3)) {}

                else {

                    let source = creep.pos.findClosestByRange(FIND_SOURCES) ;

                    if (creep.memory.targetClass == 'withdraw') {

                        if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                            if (creep.moveTo(target, {reusePath: 15}) != OK ) {

                                manager.clearTarget(creep) ;
                            }
                        }
                        else {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        if (creep.harvest(source) != OK) {

                            if (creep.moveTo(target, {reusePath: 15}) != OK ) {

                                manager.clearTarget(creep) ;
                            }
                        }
                        else {

                            manager.clearTarget(creep) ;
                        }
                    }

                }
            }
        }
    },

    // REMOTE MINER role
    mgrRemMiner: function(creep) {

        if (creep.memory.targetFlag == undefined) {

            findRemote.remSourceMiner(creep)
        }

        else {

            let source = creep.pos.findClosestByRange(FIND_SOURCES) ;
            let target = Game.flags[creep.memory.targetFlag] ;
            let rangeToFlag = creep.pos.getRangeTo(Game.flags[creep.memory.targetFlag]) ;

            if (rangeToFlag <=3) {

                if (creep.harvest(source) != OK) {

                    if (creep.moveTo(target, {reusePath: 15}) != OK)  {

                        manager.clearTarget(creep) ;
                    }
                }
                else {

                    manager.clearTarget(creep) ;
                }
            }

            else if (creep.moveTo(target, {reusePath: 15}) != OK)  {

                manager.clearTarget(creep) ;
            }


        }
    },

    // REMOTE WORKER role
    mgrClaimer: function(creep) {

        // if creep is bringing energy to the spawn but has no energy left
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if creep is supposed to transfer energy
        if (creep.memory.charged == true) {

            let numWeapons = _.sum(creep.body, (b) => b.type == ATTACK || b.type == RANGED_ATTACK) ;

            //console.log(creep.name + " has " + numWeapons + " weapons") ;

            if (numWeapons > 0 && findClose.hostile(creep, 5)) {}

            else if (findClose.buildSite(creep, 3)) {}

            else if (findClose.repairSite(creep, 2, 1.0)) {}

            else if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findOutput.outBuildSite(creep)) {}
                else if (findOutput.outRepairSite(creep, 0.8)) {}
                else if (findOutput.outSpawn(creep)) {}
                else if (findOutput.outContainer(creep)) {}
                else if (findOutput.outTower(creep, 1.0)) {}
                else {
                    let spawn = Game.getObjectById(creep.memory.spawnId) ;
                    creep.memory.targetId = spawn.room.controller.id ;
                    creep.memory.targetClass = 'upgradeController' ;
                }
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetType == 'energy' && target.energy == target.energyCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == target.storeCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetClass == 'transfer') {

                    if (creep.transfer(target, RESOURCE_ENERGY) != OK ) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

                else {

                    if (creep[creep.memory.targetClass](target) != OK ) {

                        creep.moveTo(target) ;
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }

        // if creep is supposed to harvest energy
        else if (creep.memory.charged == false) {

            let numWeapons = _.sum(creep.body, (b) => b.type == ATTACK || b.type == RANGED_ATTACK) ;

            if (numWeapons > 0 && findClose.hostile(creep, 5)) {}

            else if (creep.memory.targetFlag == undefined || Game.flags[creep.memory.targetFlag] == undefined) {

                if (findRemote.remController(creep)) {}
                else if (findRemote.remSource(creep)) {}
            }

            else {

                let rangeToFlag = creep.pos.getRangeTo(Game.flags[creep.memory.targetFlag]) ;

                if (rangeToFlag <=3 && findClose.droppedEnergy(creep, 3)) {}

                else {

                    let source = creep.pos.findClosestByRange(FIND_SOURCES) ;
                    let target = Game.flags[creep.memory.targetFlag] ;

                    if (creep.memory.targetClass == 'claimController') {

                        if (creep.claimController(creep.room.controller) != OK) {

                            if (creep.moveTo(target, {reusePath: 15}) != OK ) {

                                Game.flags[creep.memory.targetFlag].remove() ;
                                manager.clearTarget(creep)
                            }
                        }
                        else {

                            manager.clearTarget(creep)
                        }
                    }
                    else if (creep.memory.targetClass == 'withdraw') {

                        if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                            if (creep.moveTo(target, {reusePath: 15}) != OK ) {

                                manager.clearTarget(creep) ;
                            }
                        }
                        else {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        if (creep.harvest(source) != OK) {

                            if (creep.moveTo(target, {reusePath: 15}) != OK ) {

                                manager.clearTarget(creep) ;
                            }
                        }
                        else {

                            manager.clearTarget(creep) ;
                        }
                    }

                }
            }
        }
    },

    // ARCHERS role
    mgrArcher: function(creep) {

        // if CREEP is empty change CHARGE to false
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }

        // if CREEP is full change CHARGE to true
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if CREEP is charged
        if (creep.memory.charged == true) {

            if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findOutput.outSpawn(creep)) {}
                else if (findOutput.outExtensionSite(creep)) {}
                else if (findOutput.outTower(creep, 1.0)) {}
                else if (findOutput.outStorage(creep)) {}
                else if (findOutput.outBuildSite(creep)) {}
                else {
                    creep.memory.targetId = creep.room.controller.id ;
                    creep.memory.targetClass = 'upgradeController' ;
                }
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetType == 'energy' && target.energy == target.energyCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == target.storeCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetClass == 'transfer') {

                    if (creep.transfer(target, RESOURCE_ENERGY) != OK ) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

                else {

                    if (creep[creep.memory.targetClass](target) != OK ) {

                        if (creep.moveTo(target) != OK) {

                            manager.clearTarget(creep) ;
                        }

                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }

        // if CREEP is not charged
        else if (creep.memory.charged == false) {

            if (findClose.droppedEnergy(creep, 3)) {}

            else if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findInput.energyPile(creep)) {}
                else if (findInput.inpContainer(creep)) {}
                else if (findInput.inpTower(creep, 0.5)) {}
                else if (findInput.inpSource(creep)) {}
                //else console.log("mgrWorker could not find source")
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetClass == 'withdraw') {

                    if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
                else {

                    if (creep[creep.memory.targetClass](target) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

            }
        }
    },

    // SOLDIER role
    mgrSoldier: function(creep) {

        // if CREEP is empty change CHARGE to false
        if (creep.memory.charged == true && creep.carry.energy == 0) {

            manager.clearTarget(creep) ;
            creep.memory.charged = false ;
        }

        // if CREEP is full change CHARGE to true
        else if (creep.memory.charged == false && creep.carry.energy == creep.carryCapacity) {

            manager.clearTarget(creep) ;
            creep.memory.charged = true ;
        }

        // if CREEP is charged
        if (creep.memory.charged == true) {

            if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findOutput.outSpawn(creep)) {}
                else if (findOutput.outExtensionSite(creep)) {}
                else if (findOutput.outTower(creep, 1.0)) {}
                else if (findOutput.outStorage(creep)) {}
                else if (findOutput.outBuildSite(creep)) {}
                else {
                    creep.memory.targetId = creep.room.controller.id ;
                    creep.memory.targetClass = 'upgradeController' ;
                }
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetType == 'energy' && target.energy == target.energyCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetType == 'store' && target.store[RESOURCE_ENERGY] == target.storeCapacity) {

                    manager.clearTarget(creep) ;
                }

                else if (creep.memory.targetClass == 'transfer') {

                    if (creep.transfer(target, RESOURCE_ENERGY) != OK ) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

                else {

                    if (creep[creep.memory.targetClass](target) != OK ) {

                        if (creep.moveTo(target) != OK) {

                            manager.clearTarget(creep) ;
                        }

                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
            }
        }

        // if CREEP is not charged
        else if (creep.memory.charged == false) {

            if (findClose.droppedEnergy(creep, 3)) {}

            else if (creep.memory.targetId == undefined || creep.memory.targetClass == undefined || Game.getObjectById(creep.memory.targetId) == undefined) {

                if (findInput.energyPile(creep)) {}
                else if (findInput.inpContainer(creep)) {}
                else if (findInput.inpTower(creep, 0.5)) {}
                else if (findInput.inpSource(creep)) {}
                //else console.log("mgrWorker could not find source")
            }

            else {

                let target = Game.getObjectById(creep.memory.targetId) ;

                if (creep.memory.targetClass == 'withdraw') {

                    if (creep.withdraw(target, RESOURCE_ENERGY) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }
                else {

                    if (creep[creep.memory.targetClass](target) != OK) {

                        if (creep.moveTo(target, {reusePath: 5}) != OK ) {

                            manager.clearTarget(creep) ;
                        }
                    }
                    else {

                        manager.clearTarget(creep) ;
                    }
                }

            }
        }
    }

};