function remap(x, old_min, old_max, new_min, new_max) {
  return (x - old_min) / (old_max - old_min) * (new_max - new_min) + new_min;
}

const formulaPrelude = `
  const sin = Math.sin;
  const cos = Math.cos;
`;

export default {
  data() {
    return {
      formula: "sin(1/x)",
      lowx: -1,
      highx: 1,
      zoomx: 0,
      lowy: -1,
      highy: 1,
      zoomy: 0,
      steps: 100,
      examples: ["sin(1/x)", "sin(x)", "x*x", "1/x", "cos(x)", "cos(1/x)"],
    }
  },
  methods: {
    draw() {
      try {
        // try to parse formula
        eval(formulaPrelude + `const x = ${this.lowx};` + this.formula);
      } catch {
        // if failed, do nothing
        return;
      };

      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      this.ctx.strokeStyle = "black";
      this.ctx.beginPath();
      const minx = this.lowx * Math.pow(2, this.zoomx);
      const maxx = this.highx * Math.pow(2, this.zoomx);
      const miny = this.lowy * Math.pow(2, this.zoomy);
      const maxy = this.highy * Math.pow(2, this.zoomy);
      const step = (maxx - minx) / this.steps;
      console.log("drawing", minx, maxx, this.formula);
      for (let x = minx; x < maxx; x += step) {
        const y = eval(formulaPrelude + `const x = ${x};` + this.formula);
        this.ctx.lineTo(
          remap(x, minx, maxx, 0, this.$refs.canvas.width),
          remap(y, miny, maxy, this.$refs.canvas.height, 0),
        );
      }
      this.ctx.stroke();
    },
    updLowx(lowx) {
      this.lowx = lowx;
      if (this.lowx >= this.highx) {
        this.lowx = this.highx - 1;
      }
    },
    updHighx(highx) {
      this.highx = highx;
      if (this.highx <= this.lowx) {
        this.highx = this.lowx + 1;
      }
    },
    updLowy(lowy) {
      this.lowy = lowy;
      if (this.lowy >= this.highy) {
        this.lowy = this.highy - 1;
      }
    },
    updHighy(highy) {
      this.highy = highy;
      if (this.highy <= this.lowy) {
        this.highy = this.lowy + 1;
      }
    },
  },
  beforeUpdate() {
    this.draw();
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
    this.draw();
  },
  template: /*html*/`
    <canvas ref="canvas" width="400" height="400" />
    <p><input type="textarea" v-model="formula"></p>
    <p><input type="number" min="100" step="100" v-model="steps"></p>
    <div>
      <p>
        lowx
        <input type="range" min="-100" max="100" :value="lowx" @input="event => updLowx(Number(event.target.value))">
        {{lowx}}
      </p>
      <div style="width: 1em;"></div>
      <p>
        highx
        <input type="range" min="-100" max="100" :value="highx" @input="event => updHighx(Number(event.target.value))">
        {{highx}}
      </p>
      <div style="width: 1em;"></div>
      <p>
        zoomx
        <input type="range" min="-10" max="10" step="0.1" v-model="zoomx">
        {{zoomx}}
      </p>
    </div>
    <div>
      <p>
        lowy
        <input type="range" min="-100" max="100" :value="lowy" @input="event => updLowy(Number(event.target.value))">
        {{lowy}}
      </p>
      <div style="width: 1em;"></div>
      <p>
        highy
        <input type="range" min="-100" max="100" :value="highy" @input="event => updHighy(Number(event.target.value))">
        {{highy}}
      </p>
      <div style="width: 1em;"></div>
      <p>
        zoomy
        <input type="range" min="-10" max="10" step="0.1" v-model="zoomy">
        {{zoomy}}
      </p>
    </div>
    <div>
      <button v-for="example in examples" @click="formula = example">{{example}}</button>
    </div>
  `
}
