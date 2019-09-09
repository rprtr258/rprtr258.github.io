function nextGeneration() {
    console.log("next generation");
    calculateFitness(end);
    for (let i = 0; i < TOTAL; i++) {
        population[i] = pickOne();
    }
    for (let i = 0; i < TOTAL; i++) {
        savedParticles[i].dispose();
    }
    savedParticles = [];
}

function pickOne() {
    let index = 0;
    let r = random();
    while (r > 0) {
        r = r - savedParticles[index].fitness;
        index++;
    }
    index--;
    let particle = savedParticles[index];
    let child = new Particle(particle.brain);
    child.mutate();
    return child;
}

function calculateFitness(target) {
    let sum = 0;
    for (let particle of savedParticles) {
        particle.calculateFitness(target);
        sum += particle.fitness;
    }
    for (let particle of savedParticles) {
        particle.fitness /= sum;
    }
}