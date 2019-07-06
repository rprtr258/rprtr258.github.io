Array.prototype.last = function() {
    return this[this.length - 1];
}

class ColorPoint {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
	setColor(color) {
		this.color = color;
	}
	draw() {
		stroke(0, 0, 0);
		fill(this.color);
		ellipse(this.x, this.y, 20, 20);
	}
}

dataset = []
queue = []
centroids = [[], [], []]
clusters = [[], [], []]

function setup() {
	createCanvas(640, 480);
	dataset.push(new ColorPoint(320 + 150 + 50, 240 - 100 - 25, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 + 150 - 50, 240 - 100 - 25, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 + 150, 240 - 100 + 50, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 - 150 + 50, 240 - 100 - 25, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 - 150 - 50, 240 - 100 - 25, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 - 150, 240 - 100 + 50, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 + 50, 240 + 150 - 25, color(255, 255, 255)));
	dataset.push(new ColorPoint(320 - 50, 240 + 150 - 25, color(255, 255, 255)));
	dataset.push(new ColorPoint(320, 240 + 150 + 50, color(255, 255, 255)));
	centroids[0].push(new ColorPoint(random(0, 640), random(0, 480), color(255, 0, 0)));
	centroids[1].push(new ColorPoint(random(0, 640), random(0, 480), color(0, 255, 0)));
	centroids[2].push(new ColorPoint(random(0, 640), random(0, 480), color(0, 0, 255)));
	for (i = 0; i < dataset.length; i++) {
		queue.push(dataset[i]);
	}
	frameRate(2);
}

function updateCentroidsColors(i) {
	n = centroids[i].length;
	for (j = 0; j < n; j++) {
		value = 50 + (180 - 50) * (n - j - 1) / (n - 1);
		if (i == 0) {
			centroids[i][j].setColor(color(255, value, value));
		} else if (i == 1) {
			centroids[i][j].setColor(color(value, 255, value));
		} else if (i == 2) {
			centroids[i][j].setColor(color(value, value, 255));
		}
	}
}

function update() {
	if (queue.length == 0) {
		delta = 0;
		for (i = 0; i < 3; i++) {
			if (clusters[i].length == 0) {
				continue;
			}
			median_x = 0;
			median_y = 0;
			for (j = 0; j < clusters[i].length; j++) {
				median_x += clusters[i][j].x;
				median_y += clusters[i][j].y;
			}
			median_x /= clusters[i].length;
			median_y /= clusters[i].length;
			delta += pow(centroids[i].last().x - median_x, 2) + pow(centroids[i].last().y - median_y, 2);
			centroids[i].push(new ColorPoint(median_x, median_y, centroids[i].last().color));
			updateCentroidsColors(i);
		}
		if (delta < 0.0001) {
			noLoop();
		} else {
			for (i = 0; i < dataset.length; i++) {
				dataset[i].setColor(color(255, 255, 255));
				queue.push(dataset[i]);
			}
			clusters = [[], [], []];
		}
	} else {
		p = queue.pop();
		distances = [0, 0, 0];
		for (i = 0; i < 3; i++) {
			distances[i] += pow(p.x - centroids[i].last().x, 2);
			distances[i] += pow(p.y - centroids[i].last().y, 2);
		}
		mindistance_i = 0;
		for (i = 0; i < 3; i++) {
			if (distances[i] < distances[mindistance_i]) {
				mindistance_i = i;
			}
		}
		clusters[mindistance_i].push(p);
		p.setColor(centroids[mindistance_i].last().color);
	}
}

function draw() {
	update();
	background(200);
    for (i = 0; i < dataset.length; i++) {
		dataset[i].draw();
    }
    for (i = 0; i < centroids.length; i++) {
		for (j = 0; j < centroids[i].length; j++) {
			centroids[i][j].draw();
		}
    }
}
