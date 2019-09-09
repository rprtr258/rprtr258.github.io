let walls = [];
let ray;
let population = [];
let savedParticles = [];
const TOTAL = 100;
let slider;

function generateMap() {
    let res = []
    res.push(new Boundary(50, 390, 120, 390));
    res.push(new Boundary(50, 390, 50, 200));
    res.push(new Boundary(120, 390, 120, 200));
    res.push(new Boundary(50, 200, 150, 100));
    res.push(new Boundary(120, 200, 150, 170));
    res.push(new Boundary(150, 100, 390, 100));
    res.push(new Boundary(150, 170, 390, 170));
    res.push(new Boundary(390, 100, 390, 170));
    return res;
}

function setup() {
    slider = createSlider(1, 100, 1);
    createCanvas(400, 400);
    walls = generateMap();

    start = createVector(85, 380);
    end = createVector(380, 135);

    for (let i = 0; i < TOTAL; i++) {
        population[i] = new Particle();
    }
}

function draw() {
    for (let j = 0; j < slider.value(); j++) {
        for (let particle of population) {
            particle.look(walls);
            particle.check(end);
            particle.update();
        }

        for (let i = population.length - 1; i >= 0; i--) {
            const particle = population[i];
            if (particle.dead || particle.finished) {
                savedParticles.push(population.splice(i, 1)[0]);
            }
        }
        if (population.length == 0) {
            nextGeneration();
        }
    }

    background(0);
    for (let particle of population) {
        particle.show();
    }
    for (let wall of walls) {
        wall.show();
    }
    fill(255);
    ellipse(end.x, end.y, 10);
}
