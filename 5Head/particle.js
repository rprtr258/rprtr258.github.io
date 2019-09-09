class Particle {
  constructor(brain) {
    this.pos = createVector(start.x, start.y);
    this.vel = createVector();
    this.maxspeed = 3;
    this.acc = createVector();
    this.rays = [];
    this.sight = 50;
    for (let a = 0; a < 360; a += 45) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(this.rays.length, 8, 2);
    }
    this.dead = false;
    this.finished = false;
    this.fitness = 0;
  }

  calculateFitness(target) {
    if (this.dead) {
      this.fitness = 0;
    } else if (this.finished) {
      this.fitness = 1;
    } else {
      const d = p5.Vector.dist(this.pos, target);
      this.fitness = constrain(1 / d, 0, 1);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.dead && !this.finished) {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.acc.set(0, 0);
    }
  }

  check(target) {
    const d = p5.Vector.dist(this.pos, target);
    if (d < 10) {
      this.finished = true;
    }
  }

  dispose() {
    this.brain.dispose();
  }

  mutate() {
    this.brain.mutate();
  }

  look(walls) {
    let inputs = [];
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = this.sight;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record && d < this.sight) {
            record = d;
            closest = pt;
          }
        }
      }
      inputs[i] = map(record, 0, this.sight, 1, 0);
      if (record < 2) {
        this.dead = true;
      }
    }
    const out = this.brain.predict(inputs);
    const angle = map(out[0], 0, 1, 0, TWO_PI);
    const speed = map(out[1], 0, 1, 1, this.maxspeed);
    const steering = p5.Vector.fromAngle(angle);
    steering.setMag(speed);
    steering.sub(this.vel);
    this.applyForce(steering);
  }

  show() {
    fill(255, 100);
    ellipse(this.pos.x, this.pos.y, 8);
  }
}
