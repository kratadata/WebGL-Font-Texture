let rows, columns;

let xSpace, ySpace;
let yWave;
let yWaveSize = 20;
let yWaveSpeed = 0.1;

let cg;
let myModel;

function preload() {
  myModel = loadModel("hh.obj", true);
  font = loadFont("IBMPlexMono-Bold.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cg = createGraphics(width, height);
  inp = createInput("HOLD").position(30, 30).style("width", "100px");

  createSliders();

  cg.angleMode(DEGREES);
}

function draw() {
  blendMode(SCREEN);
  cg.clear();

  background(
    clrSlider.value(),
    clrSliderG.value(),
    clrSliderB.value(),
    fadeSlider.value()
  );
  orbitControl(5);
  cg.push();
  cg.textFont(font);

  textSize(5);
  // Connect the slider values to the wave variables
  rows = rowsSlider.value();
  columns = columnsSlider.value();
  xSpace = xSpaceSlider.value();
  ySpace = ySpaceSlider.value();
  yWaveSize = yWaveSizeSlider.value();
  yWaveLength = yWaveLengthSlider.value();
  yWaveOffset = yWaveOffsetSlider.value();
  yWaveSpeed = yWaveSpeedSlider.value();
  clr = clrSlider.value();

  txt = inp.value();
  // Center matrix
  cg.translate(width / 2, height / 2);
  // Reposition  matrix depending on width & height of the grid
  cg.translate((-(columns - 1) * xSpace) / 2, (-(rows - 1) * ySpace) / 2);

  cg.noStroke();
  cg.fill(clrSliderB.value(), clrSlider.value(), clrSliderG.value());

  // grid
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      cg.push();

      cg.translate(i * xSpace, j * ySpace);
      yWave = sin(frameCount * yWaveSpeed + i) * yWaveSize;

      yWavePre =
        cos(frameCount * yWaveSpeed + (i - 1) * yWaveLength + j * yWaveOffset) *
        yWaveSize;
      yWavePost =
        cos(frameCount * yWaveSpeed + (i + 1) * yWaveLength + j * yWaveOffset) *
        yWaveSize;

      let rot = atan2(yWavePost - yWavePre, 2 * xSpace);
      cg.translate(0, yWave);
      cg.textSize(txtS.value());
      cg.rotate(rot);

      let charSel = (i + j) % txt.length;
      let char = txt.charAt(charSel);
      cg.text(char, 0, 0);
      cg.pop();
    }
  }

  push();
  textureMode(IMAGE);
  texture(cg);
  stroke(1);
  strokeWeight(0.2);
  rotateY(frameCount * 0.01);
  scale(1.5);
  rotateX(71);
  rotateZ(10);
  model(myModel);
  pop();

  push();
  translate(0, 0, -250);
  image(cg, -width / 2, -height / 2);
  tint(0, 0, 0, 155);
  image(cg, -width / 2 + 5, -height / 2 + 5);
  pop();

  push();
  lights();
  noStroke();
  translate(0, 0, 0);
  cg.pop();
}

// still need to name them
function createSliders() {
  columnsSlider = createSlider(1, 100, 10)
    .position(30, 60)
    .style("width", "100px")
    .addClass("slider");
  rowsSlider = createSlider(1, 100, 14)
    .position(30, 90)
    .style("width", "100px")
    .addClass("slider");
  xSpaceSlider = createSlider(0, 200, 100)
    .position(30, 120)
    .style("width", "100px")
    .addClass("slider");
  ySpaceSlider = createSlider(0, 200, 50)
    .position(30, 150)
    .style("width", "100px")
    .addClass("slider");
  yWaveSizeSlider = createSlider(0, 100, 70)
    .position(30, 180)
    .style("width", "100px")
    .addClass("slider");
  yWaveLengthSlider = createSlider(0, PI, 0.5, 0.01)
    .position(30, 210)
    .style("width", "100px")
    .addClass("slider");
  yWaveOffsetSlider = createSlider(0, PI, 0.5, 0.01)
    .position(30, 240)
    .style("width", "100px")
    .addClass("slider");
  yWaveSpeedSlider = createSlider(0, 0.25, 0.05, 0.01)
    .position(30, 270)
    .style("width", "100px")
    .addClass("slider");
  clrSlider = createSlider(0, 255, 0, 0)
    .position(30, height - 50)
    .style("width", "100px")
    .addClass("slider");
  clrSliderG = createSlider(0, 255, frameCount % 255, 0)
    .position(150, height - 50)
    .style("width", "100px")
    .addClass("slider");
  clrSliderB = createSlider(0, 255, 255, 0)
    .position(270, height - 50)
    .style("width", "100px")
    .addClass("slider");
  fadeSlider = createSlider(0, 100, 100, 0)
    .position(30, height - 150)
    .style("width", "100px")
    .addClass("slider");
  txtS = createSlider(0, 400, 50, 0)
    .position(30, height - 200)
    .style("width", "100px")
    .addClass("slider");
}

function getangle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  return theta;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
