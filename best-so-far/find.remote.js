// import modules

var findRemotes = module.exports = {

    // unset CREEP target infomration
    clearTarget: function (creep) {

        // unset memory
        creep.memory.targetId = undefined ;
        creep.memory.targetClass = undefined ;
        creep.memory.targetType = undefined ;
        creep.memory.targetFlag = undefined ;
    },

    // find YELLOW flags associated with SPAWNID - mark remote sources to harvest
    remSource: function (creep) {

        // unset memory
        findRemotes.clearTarget(creep) ;

        var yellowFlags = _.filter(Game.flags, (f) => f.color == COLOR_YELLOW && f.memory.spawnId == creep.memory.spawnId) ;

        for (let f in yellowFlags) {

            let numberCreeps = _.sum(Game.creeps, (c) => c.memory.role == 'remWorker' && c.memory.targetFlag == [yellowFlags[f].name]) ;

            if (yellowFlags[f].memory.numRemWorkers == undefined) {
                yellowFlags[f].memory.numRemWorkers = 5
            }

            else if (numberCreeps <= yellowFlags[f].memory.numRemWorkers) {

                console.log(creep.name + " assigned YELLOW flag :" + yellowFlags[f].name) ;
                creep.memory.targetClass = 'harvest' ;
                creep.memory.targetFlag = yellowFlags[f].name ;
            }
        }

        return (creep.memory.targetFlag != undefined) ;
    },

    // find YELLOW flags associated with SPAWNID - mark remote sources to harvest
    remSourceMiner: function (creep) {

        // unset memory
        findRemotes.clearTarget(creep) ;

        var yellowFlags = _.filter(Game.flags, (f) => f.color == COLOR_YELLOW && f.memory.spawnId == creep.memory.spawnId) ;

        for (let f in yellowFlags) {

            let numberCreeps = _.sum(Game.creeps, (c) => c.memory.role == 'remMiner' && c.memory.targetFlag == [yellowFlags[f].name]) ;

            if (numberCreeps == 0) {

                console.log(creep.name + " assigned YELLOW flag :" + yellowFlags[f].name) ;
                creep.memory.targetClass = 'harvest' ;
                creep.memory.targetFlag = yellowFlags[f].name ;

                //set distance from spawn
                creep.memory.distToSpawn = yellowFlags[f].memory.distToSpawn
            }
        }
        return (creep.memory.targetFlag != undefined) ;
    },

    // find BLUE flags associated with SPAWNID - mark controllers to claim
    remController: function (creep) {

        // unset memory
        findRemotes.clearTarget(creep) ;

        var blueFlags = _.filter(Game.flags, (f) => f.color == COLOR_BLUE && f.memory.spawnId == creep.memory.spawnId) ;

        if (blueFlags[0] != undefined) {

            console.log(creep.name + " assigned BLUE flag :" + blueFlags[0]) ;
            creep.memory.targetClass = 'claimController' ;
            creep.memory.targetFlag = blueFlags[0].name ;

            return true
        }
        else return false
    },


};
