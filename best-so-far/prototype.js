module.exports = function() {

    // create a new function for StructureSpawn - SHORT
    StructureSpawn.prototype.createShortCreep = function(roleName, spawnId, roomEnergy) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 550) {

            body.push(WORK,WORK,CARRY,MOVE) ;
            var totalCost = 300 ;
        }

        else if (roomEnergy < 800) {

            body.push(WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 550 ;
        }
        else {
            body.push(WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 800 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'short', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - MEDIUM
    StructureSpawn.prototype.createMediumCreep = function(roleName, spawnId, roomEnergy) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 500) {

            body.push(WORK,WORK,CARRY,MOVE) ;
            var totalCost = 300 ;
        }

        else if (roomEnergy < 750) {

            body.push(WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 500 ;
        }
        else {
            body.push(WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 750 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'medium', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - LONG
    StructureSpawn.prototype.createLongCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 550) {

            body.push(WORK,WORK,CARRY,MOVE) ;
            var totalCost = 300 ;
        }

        else if (roomEnergy < 750) {

            body.push(WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE) ;
            var totalCost = 550 ;
        }
        else {
            body.push(WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 750 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'long', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - MINER
    StructureSpawn.prototype.createMinerCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 550) {

            body.push(WORK,WORK,MOVE) ;
            var totalCost = 250 ;
        }

        else if (roomEnergy < 800) {

            body.push(WORK,WORK,WORK,WORK,WORK,MOVE) ;
            var totalCost = 550 ;
        }
        else {
            body.push(WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 800 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'Miner', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - REMOTE MINER
    StructureSpawn.prototype.createRemMinerCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 450) {

            body.push(WORK,WORK,MOVE,MOVE) ;
            var totalCost = 300 ;
        }

        else {
            body.push(WORK,WORK,WORK,MOVE,MOVE,MOVE) ;
            var totalCost = 450 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'Miner', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - ARCHER
    StructureSpawn.prototype.createArcherCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy  < 550) {

            var mainCost = 200 ;
            var secCost = 60 ;

            var numberMainParts = Math.floor(roomEnergy / mainCost) ;
            var energyAvailable = roomEnergy - (numberMainParts * mainCost) ;
            var numberSecParts = Math.floor(energyAvailable / secCost) ;
            var totalCost = (numberMainParts * mainCost) + (numberSecParts * secCost) ;

            // push creep build configuration to body[]
            for (let i = 0; i < numberSecParts; i++) {
                body.push(TOUGH,MOVE) ;
            }

            for (let i = 0; i < numberMainParts; i++) {
                body.push(RANGED_ATTACK,MOVE) ;
            }
        }
        else {

            roomEnergy = roomEnergy - 300 ;

            var mainCost = 200 ;
            var secCost = 60 ;

            var numberMainParts = Math.floor(roomEnergy / mainCost) ;
            var energyAvailable = roomEnergy - (numberMainParts * mainCost) ;
            var numberSecParts = Math.floor(energyAvailable / secCost) ;
            var totalCost = (numberMainParts * mainCost) + (numberSecParts * secCost) ;

            // push creep build configuration to body[]
            for (let i = 0; i < numberSecParts; i++) {
                body.push(TOUGH,MOVE) ;
            }

            for (let i = 0; i < numberMainParts; i++) {
                body.push(RANGED_ATTACK,MOVE) ;
            }

            body.push(HEAL) ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'Archer', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - SOLDIER
    StructureSpawn.prototype.createSoldierCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy  < 550) {

            var mainCost = 130 ;
            var secCost = 60 ;

            var numberMainParts = Math.floor(roomEnergy / mainCost) ;
            var energyAvailable = roomEnergy - (numberMainParts * mainCost) ;
            var numberSecParts = Math.floor(energyAvailable / secCost) ;
            var totalCost = (numberMainParts * mainCost) + (numberSecParts * secCost) ;

            // push creep build configuration to body[]
            for (let i = 0; i < numberSecParts; i++) {
                body.push(TOUGH,MOVE) ;
            }

            for (let i = 0; i < numberMainParts; i++) {
                body.push(ATTACK,MOVE) ;
            }
        }
        else {

            roomEnergy = roomEnergy - 300 ;

            var mainCost = 130 ;
            var secCost = 60 ;

            var numberMainParts = Math.floor(roomEnergy / mainCost) ;
            var energyAvailable = roomEnergy - (numberMainParts * mainCost) ;
            var numberSecParts = Math.floor(energyAvailable / secCost) ;
            var totalCost = (numberMainParts * mainCost) + (numberSecParts * secCost) ;

            // push creep build configuration to body[]
            for (let i = 0; i < numberSecParts; i++) {
                body.push(TOUGH,MOVE) ;
            }

            for (let i = 0; i < numberMainParts; i++) {
                body.push(ATTACK,MOVE) ;
            }

            body.push(HEAL) ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'Soldier', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - MEDIC
    StructureSpawn.prototype.createMedicCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;
        var mainCost = 300 ;
        var secCost = 60 ;

        var numberMainParts = Math.floor(roomEnergy / mainCost) ;
        var energyAvailable = roomEnergy - (numberMainParts * mainCost) ;
        var numberSecParts = Math.floor(energyAvailable / secCost) ;
        var totalCost = (numberMainParts * mainCost) + (numberSecParts * secCost) ;

        // push creep build configuration to body[]
        for (let i = 0; i < numberSecParts; i++) {
            body.push(TOUGH,MOVE) ;
        }

        for (let i = 0; i < numberMainParts; i++) {
            body.push(HEAL,MOVE) ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'MEDIC', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - ARCHER
    StructureSpawn.prototype.createClaimerCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        var totalCost = 800 ;

        // push creep build configuration to body[]
        body.push(CLAIM,WORK,CARRY,MOVE) ;

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'Claimer', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - REMOTE WORKER
    StructureSpawn.prototype.createRemWorkerCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 500) {

            body.push(WORK,CARRY,CARRY,MOVE,MOVE) ;
            var totalCost = 300 ;
        }

        else if (roomEnergy < 750) {

            body.push(WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE) ;
            var totalCost = 500 ;
        }
        else {
            body.push(WORK,WORK,RANGED_ATTACK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE) ;
            var totalCost = 750 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'medium', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    };

    // create a new function for StructureSpawn - MINER
    StructureSpawn.prototype.createUpgraderCreep = function(roleName, spawnId, roomEnergy ) {

        //build the creep body
        var body = [] ;

        if (roomEnergy < 550) {

            body.push(WORK,WORK,CARRY,MOVE) ;
            var totalCost = 300 ;
        }

        else if (roomEnergy < 800) {

            body.push(WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE) ;
            var totalCost = 550 ;
        }
        else {
            body.push(WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE) ;
            var totalCost = 800 ;
        }

        console.log("building a " + roleName + " creep with " + totalCost + " roomEnergy.") ;

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, {
            charged: false, profile: 'Miner', role: roleName, spawnId: spawnId, cost: totalCost, aboutToDie: false, recycle: false
        }) ;
    }
};