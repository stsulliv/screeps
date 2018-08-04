// import modules
require('prototype')();

module.exports = {
    // Spawn setting for energy below 550 (built out level 2 extensions)
    run: function (spawn, roomEnergy) {

        var minNumberOfWorkers = ( 4 * spawn.memory.sourceIds.length ) ;
        var minNumberOfUpgraders = 1 ;
        var minNumberOfMiners = spawn.memory.sourceIds.length ;
        var yellowFlags = _.sum(Game.flags, (f) => f.color == COLOR_YELLOW && f.memory.spawnId == spawn.id);
        var minNumberOfRemWorkers = ( 4 * yellowFlags ) ;
        var blueFlags = _.sum(Game.flags, (f) => f.color == COLOR_BLUE && f.memory.spawnId == spawn.id);

        if (blueFlags > 0) {

            var minNumberOfClaimers = 1 ;
        }
        else var minNumberOfClaimers = 0 ;
        
        var name = undefined ;

        // get current SPAWN Population
        spawn.memory.population = {};

        spawn.memory.population.workers = _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.memory.spawnId == spawn.id);
        spawn.memory.population.upgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.memory.spawnId == spawn.id);
        spawn.memory.population.builders = _.sum(Game.creeps, (c) => c.memory.role == 'miner' && c.memory.spawnId == spawn.id);
        spawn.memory.population.remWorkers = _.sum(Game.creeps, (c) => c.memory.role == 'remHarvester' && c.memory.spawnId == spawn.id);
        spawn.memory.population.claimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer' && c.memory.spawnId == spawn.id);


        // build minimum number of UPGRADERS
        if (spawn.memory.population.workers >= 2 && spawn.memory.population.upgraders < minNumberOfUpgraders) {

            spawn.memory.population.upgraders = spawn.memory.population.upgraders + 1;
            name = spawn.createMediumCreep('upgrader', spawn.id, roomEnergy) ;
        }

        // build minimum number of MINER
        else if (spawn.memory.population.workers >= 2 && spawn.memory.population.miners < minNumberOfMiners) {

            spawn.memory.population.miners = spawn.memory.population.miners + 1;
            name = spawn.createMinerCreep('miner', spawn.id, roomEnergy) ;
        }

        // build minimum number of WORKERS
        else if (spawn.memory.population.workers < minNumberOfWorkers) {

            spawn.memory.population.harvesters = spawn.memory.population.harvesters + 1;
            name = spawn.createLongCreep('worker', spawn.id, roomEnergy) ;
        }

        // build minimum number of REMOTE WORKER
        else if (spawn.memory.population.remWorkers < minNumberOfRemWorkers) {

            spawn.memory.population.remWorkers = spawn.memory.population.remWorkers + 1;
            name = spawn.createMediumCreep('remWorker', spawn.id, roomEnergy) ;
        }

        // build minimum number of CLAIMERS
        else if (spawn.memory.population.claimers < minNumberOfClaimers && roomEnergy >= 800) {

            spawn.memory.population.claimers = spawn.memory.population.claimers + 1;
            name = spawn.createClaimerCreep('claimer', spawn.id, roomEnergy) ;
        }

        // print name to console if spawning was a success
        if (name != undefined && !(name < 0)) {

            spawn.memory.harvesterEnergyCommit = 0 ;

            console.log("Spawned new creep: " + name + "   role=" + Game.creeps[name].memory.role
                + "   Workers=" + spawn.memory.population.workers
                + "   Upgraders=" + spawn.memory.population.upgraders
                + "   Miners=" + spawn.memory.population.miners
                + "   remWorkers=" + spawn.memory.population.remWorkers
                + "   Claimers=" + spawn.memory.population.claimers
            );
        }

    }
};
