class Particle {
  constructor(brain) {
    this.pos = createVector(start.x, start.y);
    this.vel = createVector();
    this.maxspeed = 5;
    this.acc = createVector();
    this.rays = [];
    this.index = 0;
    this.sight = 100;
    this.timer = 0;
    this.color = "rgba(100%,100%,100%,0.4)";
    for (let a = -45; a < 45; a += 5) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(this.rays.length, 2 * this.rays.length, 2);
    }
    this.dead = false;
    this.finished = false;
    this.fitness = 0;
  }

  calculateFitness() {
    this.fitness = pow(2, this.index);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.dead && !this.finished) {
      this.timer++;
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.acc.set(0, 0);
      if (this.timer > 20) {
        this.dead = true;
      }
      for (let i = 0; i < this.rays.length; i++) {
        this.rays[i].rotate(this.vel.heading());
      }
    }
  }

  check(checkpoints) {
    function mydist(p, v, w) {
      const vdist = p5.Vector.dist;
      const cvector = createVector;
      let vw = cvector(w.x - v.x, w.y - v.y);
      let l2 = pow(vw.mag(), 2);
      let t = cvector(p.x - v.x, p.y - v.y).dot(vw) / l2;
      t = constrain(t, 0, 1);
      return vdist(p, cvector(v.x + t * vw.x, v.y + t * vw.y));
    }
    const a = checkpoints[this.index % checkpoints.length].a;
    const b = checkpoints[this.index % checkpoints.length].b;
    const d = mydist(this.pos, a, b);
    if (d < 5) {
      this.index++;
      this.timer = 0;
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
      if (closest) {
        stroke(255);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
      inputs[i] = map(record, 0, this.sight, 1, 0);
      if (record < this.maxspeed) {
        this.dead = true;
      }
    }
    const out = this.brain.predict(inputs);
    const angle = map(out[0], 0, 1, -PI, PI) + this.vel.heading();
    const speed = map(out[1], 0, 1, 1, this.maxspeed);
    const steering = p5.Vector.fromAngle(angle);
    steering.setMag(speed);
    steering.sub(this.vel);
    this.applyForce(steering);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);
    strokeWeight(1);
    fill(this.color);
    beginShape();
    vertex(-2, 5);
    vertex(10, 0);
    vertex(-2, -5);
    endShape(CLOSE);
    pop();
  }
}
