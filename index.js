console.log('ml5', ml5.version)
console.log('p5', window.p5)
console.log('window', window.innerWidth)

let windowWidth = window.innerWidth
let video
let poseNet
let pose
let drawPath = []

const $ = {
  main: document.querySelector('main'),
  timer: document.querySelector('.timer')
}

// const canvasRender = {
//   active,
//   inactive,
//   practice, 
// }

function setup() {
  // video height is 75% of width
  createCanvas(640, 640).parent($.main)
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
  // background(250, 250, 250)


  bodyPointTracking('leftWrist', pose, drawPath)

  // if(drawPath) {
  //   noFill() 
  //   strokeWeight(25)
  //   stroke(255, 0, 0)
  //   beginShape()
  //   drawPath.forEach(point => vertex(point.x, point.y))
  //   endShape()
  //   if(drawPath.length > 5) {
  //     drawPath.shift()
  //   }
  // }
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

function bodyPointTracking(bodyPoint, bodyCapture, strokePath) {
  if (bodyCapture) {
    fill(255, 255, 255)
    ellipse(bodyCapture[bodyPoint].x + 320, bodyCapture[bodyPoint].y, 20)
    strokePath.push(createVector(bodyCapture[bodyPoint].x + 320, bodyCapture[bodyPoint].y))
  }
}

$.timer.addEventListener('click', event => countdown(event.target, 20))

function countdown(counter, $timeDisplay) {
  count = setInterval(function() {
  counter >= 10 
    ? $timeDisplay.textContent = `00:${counter}`
    : $timeDisplay.textContent = `00:0${counter}`
  if (counter <= 0) clearInterval(count)
  counter--
  }, 1000)
}
