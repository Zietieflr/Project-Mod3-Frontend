console.log('ml5', ml5.version)
console.log('p5', window.p5)
console.log('window', window.innerWidth)

let windowWidth = window.innerWidth
let video
let poseNet
let pose
let drawPath = []

const $ = {
  main: document.querySelector('main')
}

function setup() {
  // video height is 75% of width
  createCanvas(640, 640)
  colorMode(HSL)
  video = createCapture(VIDEO)
  video.hide()
  frameRate(10)
  poseNet = ml5.poseNet(video, modelLoaded)
  poseNet.on('pose', capturePose)
}

function draw() {
  translate(video.width, 0)
  scale(-1, 1)
  image(video, 320, 0)

  if (pose) {
    fill(0, 100, 50);
    ellipse(pose.nose.x + 320, pose.nose.y, 25);
    drawPath.push(createVector(pose.nose.x + 320, pose.nose.y))


    // fill(0, 255, 0)
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 25)
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 25)

    // drawLeftWrist(pose)
  }

  if(drawPath) {
    noFill() 
    strokeWeight(25)
    stroke(255, 0, 0)
    beginShape()
    drawPath.forEach(point => vertex(point.x, point.y))
    endShape()
    if(drawPath.length > 5) {
      drawPath.shift()
    }
  }
}

function modelLoaded() {
  console.log('model loaded (poseNet)')
}

function capturePose(poseData) {
  // console.log(poseData)
  if (poseData.length) {
    pose = poseData[0].pose;
  }
}

function drawLeftWrist(pose){
  
}