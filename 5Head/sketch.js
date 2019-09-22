let walls;
let ray;
let population = [];
let savedParticles = [];
const TOTAL = 100;

let speedSlider;

let mx = 0;
let start;

let inside;
let outside;
let checkpoints;
let PATH_WIDTH = 70;
let zoff = 0;

function generateMap() {
    walls = [];
    inside = [];
    outside = [];
    checkpoints = [];

    let res = []

    let noiseMax = 4;
    const total = 72;
    for (let i = 0; i < total; i++) {
        let a = map(i, 0, total, 0, TWO_PI);
        let xoff = map(cos(a), -1, 1, 0, noiseMax);
        let yoff = map(sin(a), -1, 1, 0, noiseMax);
        let r = map(noise(xoff, yoff, zoff), 0, 1, 100, height / 2);
        let x1 = width / 2 + (r - PATH_WIDTH) * cos(a);
        let y1 = height / 2 + (r - PATH_WIDTH) * sin(a);
        let x2 = width / 2 + (r + PATH_WIDTH) * cos(a);
        let y2 = height / 2 + (r + PATH_WIDTH) * sin(a);
        checkpoints.push(new Boundary(x1, y1, x2, y2));
        inside.push(createVector(x1, y1));
        outside.push(createVector(x2, y2));
    }
    for (let i = 0; i < total; i++) {
        let ai = inside[i];
        let bi = inside[(i + 1) % total];
        res.push(new Boundary(ai.x, ai.y, bi.x, bi.y));
        let ao = outside[i];
        let bo = outside[(i + 1) % total];
        res.push(new Boundary(ao.x, ao.y, bo.x, bo.y));
    }

    start = checkpoints[0].midpoint();
    walls = res;
    zoff += 0.01;
}

function setup() {
    speedSlider = createSlider(1, 100, 1);
    createCanvas(800, 800);
    generateMap();
    for (let i = 0; i < TOTAL; i++) {
        population[i] = new Particle();
    }
}

function draw() {
    background(0);
    for (let j = 0; j < speedSlider.value(); j++) {
        generateMap();
        for (let particle of population) {
            particle.look(walls);
            particle.check(checkpoints);
            particle.update();
        }

        for (let i = population.length - 1; i >= 0; i--) {
            const particle = population[i];
            if (particle.dead || particle.finished) {
                savedParticles.push(population.splice(i, 1)[0]);
            }
        }
        if (population.length == 0) {
            for (let i = population.length - 1; i >= 0; i--) {
                const particle = population[i];
                savedParticles.push(population.splice(i, 1)[0]);
            }
            nextGeneration();
            mx = 0;
        }
    }

    for (let particle of population) {
        particle.show();
    }
    population[0].show();
    strokeWeight(2);
    for (let wall of walls) {
        wall.show();
    }
    for (let particle of population) {
        mx = max(mx, particle.index);
    }
    checkpoints[mx % checkpoints.length].show();
}
