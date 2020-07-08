console.log('ml5', ml5.version)
console.log('p5', window.p5)
console.log('window', window.innerWidth)

let windowWidth = window.innerWidth
let video
let poseNet
let pose
let drawPath = []
let canvasStatus = 'idle'

const $ = {
  main: document.querySelector('main'),
  timer: document.querySelector('.timer'),
  userInput: document.querySelector('.user-input')
}

$.userInput.addEventListener('submit', startGame)

const canvasRender = {
  idle: idleGame,
  begin: 1,
  end: endGameDrawing,
  play: playingGame, 
}

function setup() {
  createCanvas(640, 640).parent($.main)
  initiateVideoCapture()
  console.log('video', video)
}

function draw() {
  renderCanvas(canvasRender, canvasStatus)  
}

function renderCanvas(lookupTable, lookupQuery) {
  lookupTable[`${lookupQuery}`]()
}

function idleGame() {
  background(250, 250, 250)
  noLooping()
}

function startGame(event) {
  // start from event listener
  // stop default
  // show video
  // start looping
  // start countdown
  // change status

  event.preventDefault()
  video.play()
  renderVideo()
  visualCountdown($.timer, 20)
  canvasStatus = 'play' 
  looping()
  window.setTimeout(endGame, 20*1000)
}

function endGame() {
  // pause/end video feed
  // render background
  // render completed drawing
  // save drawing
  // reset to play new game
  // stop looping 
  
  video.pause()
  canvasStatus = 'end'
  // save the drawPath for the backend
  window.setTimeout((() => {
    canvasStatus = 'idle'
    // redraw()
  }), 5*1000)
}

function endGameDrawing() {
  background(250, 250, 250)
  renderPath2(drawPath, 10)
  noLooping()
}

function playingGame() {
  renderVideo()
  bodyPointTracking('leftWrist', pose, drawPath)
  renderPath(drawPath, 10)
}

function modelLoaded() {
  console.log('model loaded (poseNet)')
}

function initiateVideoCapture() {
  video = createCapture(VIDEO)
  video.hide()
  frameRate(15)
  poseNet = ml5.poseNet(video, modelLoaded)
  poseNet.on('pose', capturePose)
}

function capturePose(poseData) {
  if (poseData.length) {
    pose = poseData[0].pose;
  }
}

function bodyPointTracking(bodyPoint, bodyCapture, strokePath) {
  if (bodyCapture) {
    fill(255, 0, 0)
    ellipse(bodyCapture[bodyPoint].x + 320, bodyCapture[bodyPoint].y, 20)
    strokePath.push(createVector(bodyCapture[bodyPoint].x + 320, bodyCapture[bodyPoint].y))
  }
}

function renderPath(strokePath, weightStroke) {
  noFill()
  strokeWeight(weightStroke)
  stroke(255, 0, 0)
  beginShape()
    strokePath.forEach(point => vertex(point.x, point.y))
  endShape()
  if(strokePath.length > 500) {
    strokePath.shift()
  }
}

function renderPath2(strokePath, weightStroke) {
  noFill()
  strokeWeight(weightStroke)
  stroke(255, 0, 0)
  beginShape()
    strokePath.forEach(point => vertex(point.x - 320, point.y))
  endShape()
}

function renderVideo() {
  translate(video.width, 0)
  scale(-1, 1)
  image(video, 320, 0)
}

function looping() {
  loop()
}

function noLooping() {
  noLoop()
}

function visualCountdown($timeDisplay, counter) {
  count = setInterval(function() {
    counter >= 10 
      ? $timeDisplay.textContent = `00:${counter}`
      : $timeDisplay.textContent = `00:0${counter}`
    if (counter <= 0) clearInterval(count)
    counter--
  }, 1000)
}

