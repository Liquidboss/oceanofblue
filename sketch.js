
let waves = [];
let waveCount = 200;
let waveSpacing = 4;
let segmentSpacing = 6;
let ambientSound;
let audioStarted = false;

function preload() {
  ambientSound = loadSound('ocean.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < waveCount; i++) {
    let y = i * waveSpacing;
    let isBlue = random(10000) < 1;
    waves.push(new Wave(y, isBlue));
  }

  textAlign(CENTER, CENTER);
  textSize(24);
  fill(100);
  noStroke();
  text("Tap to start", width / 2, height / 2);
}

function draw() {
  background(255);
  let interactionX = mouseIsPressed ? mouseX : touchX;
  let interactionY = mouseIsPressed ? mouseY : touchY;

  for (let wave of waves) {
    wave.update(interactionX, interactionY);
    wave.display();
  }
}

function touchStarted() {
  if (!audioStarted) {
    ambientSound.loop();
    audioStarted = true;
  }
  return false;
}

function mousePressed() {
  if (!audioStarted) {
    ambientSound.loop();
    audioStarted = true;
  }
}

class Wave {
  constructor(y, isBlue) {
    this.y = y;
    this.isBlue = isBlue;
    this.points = [];
    this.speed = 0.03;
    for (let x = 0; x <= width; x += segmentSpacing) {
      this.points.push({
        x,
        yOffset: 0,
        baseY: y + noise(x * 0.01, y * 0.01) * 20
      });
    }
  }

  update(mx, my) {
    for (let pt of this.points) {
      let d = dist(mx, my, pt.x, this.y);
      if (d < 100) {
        let force = (100 - d) * 0.3;
        pt.yOffset = lerp(pt.yOffset, sin(frameCount * 0.2 + pt.x * 0.05) * force, 0.2);
      } else {
        let baseMotion = sin(frameCount * this.speed + pt.x * 0.01) * 2;
        pt.yOffset = lerp(pt.yOffset, baseMotion, 0.05);
      }
    }
  }

  display() {
    stroke(this.isBlue ? '#007BFF' : 180);
    noFill();
    beginShape();
    for (let pt of this.points) {
      vertex(pt.x, pt.baseY + pt.yOffset);
    }
    endShape();
  }
}
