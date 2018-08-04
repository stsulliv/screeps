// import modules
require('prototype')();

module.exports = {
    // SPAWN settings
    run: function (spawn, roomEnergy) {

        // Get count of FLAGS
        var yellowFlags = _.filter(Game.flags, (f) => f.color == COLOR_YELLOW && f.memory.spawnId == spawn.id);
        var blueFlags = _.filter(Game.flags, (f) => f.color == COLOR_BLUE && f.memory.spawnId == spawn.id);
        var roomHostiles = spawn.room.find(FIND_HOSTILE_CREEPS) ;

        // set min Number of CREEP types
        if (roomEnergy < 500) {

            var minNumberOfWorkers = Math.ceil(2.5 * spawn.memory.sourceIds.length) ;
            var minNumberOfBuilders = Math.ceil(2.5 * spawn.memory.sourceIds.length) ;
        }
        else if (roomEnergy < 800) {

            var minNumberOfWorkers = Math.ceil(2 * spawn.memory.sourceIds.length) ;
            var minNumberOfBuilders = Math.ceil(2 * spawn.memory.sourceIds.length) ;
        }
        else {

            var minNumberOfWorkers = Math.ceil(1.5 * spawn.memory.sourceIds.length) ;
            var minNumberOfBuilders = Math.ceil(1.5 * spawn.memory.sourceIds.length) ;
        }

        var minNumberOfUpgraders = 1 ;
        var minNumberOfMiners = spawn.memory.sourceIds.length ;
        var minNumberOfRemMiners = yellowFlags.length ;
        var minNumberOfArchers = 0 ;
        var minNumberOfSoldiers = 0 ;

        // add up all NUMREMOTEWORKERS from Yellow FLAGS
        var minNumberOfRemWorkers = 0 ;

        for (let f in yellowFlags) {

            minNumberOfRemWorkers = minNumberOfRemWorkers + yellowFlags[f].memory.numRemWorkers ;
        }

        // se minimum of one CLAIMER if there is a BLUE flag
        if (blueFlags.length > 0) {
            var minNumberOfClaimers = 1 ;
        }
        else var minNumberOfClaimers = 0 ;
        
        var name = undefined ;

        // get current SPAWN Population
        spawn.memory.population = {};
        spawn.memory.population.workers = _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.memory.spawnId == spawn.id);
        spawn.memory.population.builders = _.sum(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.spawnId == spawn.id);
        spawn.memory.population.upgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.memory.spawnId == spawn.id);
        spawn.memory.population.miners = _.sum(Game.creeps, (c) => c.memory.role == 'miner' && c.memory.spawnId == spawn.id);
        spawn.memory.population.remWorkers = _.sum(Game.creeps, (c) => c.memory.role == 'remWorker' && c.memory.spawnId == spawn.id);
        spawn.memory.population.remMiners = _.sum(Game.creeps, (c) => c.memory.role == 'remMiner' && c.memory.spawnId == spawn.id);
        spawn.memory.population.claimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer' && c.memory.spawnId == spawn.id);
        spawn.memory.population.remMiners = _.sum(Game.creeps, (c) => c.memory.role == 'remMiner' && c.memory.spawnId == spawn.id);
        spawn.memory.population.archers = _.sum(Game.creeps, (c) => c.memory.role == 'archer' && c.memory.spawnId == spawn.id);
        spawn.memory.population.soldiers = _.sum(Game.creeps, (c) => c.memory.role == 'soldier' && c.memory.spawnId == spawn.id);

        // build minimum number of ARCHERS
        if (spawn.memory.population.archers < minNumberOfArchers) {

            spawn.memory.population.archers = spawn.memory.population.archers + 1;
            name = spawn.createArcherCreep('archer', spawn.id, roomEnergy) ;
        }

        // build minimum number of SOLDIERS
        else if (spawn.memory.population.soldiers < minNumberOfSoldiers) {

            spawn.memory.population.soldier = spawn.memory.population.soldier + 1;
            name = spawn.createSoldierCreep('soldier', spawn.id, roomEnergy) ;
        }

        // build minimum first MINER
        else if (spawn.memory.population.miners < 1) {

            spawn.memory.population.miners = spawn.memory.population.miners + 1;
            name = spawn.createMinerCreep('miner', spawn.id, roomEnergy) ;
        }

        // build minimum number of WORKERS
        else if (spawn.memory.population.workers < 1) {

            spawn.memory.population.harvesters = spawn.memory.population.harvesters + 1;
            name = spawn.createLongCreep('worker', spawn.id, roomEnergy) ;
        }

        // build minimum number of MINER
        else if (spawn.memory.population.miners < minNumberOfMiners) {

            spawn.memory.population.miners = spawn.memory.population.miners + 1;
            name = spawn.createMinerCreep('miner', spawn.id, roomEnergy) ;
        }

        // build minimum number of WORKERS
        else if (spawn.memory.population.workers < minNumberOfWorkers) {

            spawn.memory.population.harvesters = spawn.memory.population.harvesters + 1;
            name = spawn.createLongCreep('worker', spawn.id, roomEnergy) ;
        }

        // build minimum number of UPGRADERS
        else if (spawn.memory.population.upgraders < minNumberOfUpgraders) {

            spawn.memory.population.upgraders = spawn.memory.population.upgraders + 1;
            name = spawn.createMediumCreep('upgrader', spawn.id, roomEnergy) ;
        }

        // build minimum number of BUILDERS
        else if (spawn.memory.population.builders < minNumberOfBuilders) {

            spawn.memory.population.harvesters = spawn.memory.population.harvesters + 1;
            name = spawn.createMediumCreep('builder', spawn.id, roomEnergy) ;
        }

        // build minimum number of CLAIMERS
        else if (spawn.memory.population.claimers < minNumberOfClaimers && roomEnergy >= 800) {

            spawn.memory.population.claimers = spawn.memory.population.claimers + 1;
            name = spawn.createClaimerCreep('claimer', spawn.id, roomEnergy) ;
        }

        // build minimum number of REMOTE MINERS
        else if (spawn.memory.population.remMiners < minNumberOfRemMiners) {

            spawn.memory.population.remMiners = spawn.memory.population.remMiners + 1;
            name = spawn.createRemMinerCreep('remMiner', spawn.id, roomEnergy) ;
        }

        // build minimum number of REMOTE WORKERS
        else if (spawn.memory.population.remWorkers < minNumberOfRemWorkers) {

            spawn.memory.population.remWorkers = spawn.memory.population.remWorkers + 1;
            name = spawn.createRemWorkerCreep('remWorker', spawn.id, roomEnergy) ;
        }


        // print name to console if spawning was a success
        if (name != undefined && !(name < 0)) {

            spawn.memory.harvesterEnergyCommit = 0 ;

            console.log(spawn.name + " spawning new creep: " + name + " (" + Game.creeps[name].memory.role
                + ")   Workers=" + spawn.memory.population.workers
                + "   Builders=" + spawn.memory.population.builders
                + "   Upgraders=" + spawn.memory.population.upgraders
                + "   Miners=" + spawn.memory.population.miners
                + "   remWorkers=" + spawn.memory.population.remWorkers
                + "   remMiners=" + spawn.memory.population.remMiners
                + "   Claimers=" + spawn.memory.population.claimers
                + "   Archers=" + spawn.memory.population.archers
                + "   Soldiers=" + spawn.memory.population.soldiers
            );
        }

    }
};
