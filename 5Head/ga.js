function nextGeneration() {
    console.log("next generation");
    calculateFitness();
    population[0] = pickBest();
    for (let i = 1; i < TOTAL; i++) {
        population[i] = pickOne();
    }
    for (let i = 0; i < TOTAL; i++) {
        savedParticles[i].dispose();
    }
    savedParticles = [];
}

function pickBest() {
    let index = 0;
    for (let i = 1; i < savedParticles.length; i++) {
        if (savedParticles[i].fitness > savedParticles[index].fitness) {
            index = i;
        }
    }
    let particle = savedParticles[index];
    let child = new Particle(particle.brain);
    child.color = "rgba(100%,0%,0%,1)";
    return child;
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