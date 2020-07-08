let windowWidth = window.innerWidth
let video
let poseNet
let pose
let drawPath = []
let canvasStatus = 'play'
let handedness = 'leftWrist'
let leftShoulder = []
let rightShoulder = []
let shoulders = [ leftShoulder , rightShoulder ]

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
  createCanvas(640, 480).parent($.main)
  initiateVideoCapture()
}

function draw() {
  renderCanvas(canvasRender, canvasStatus)  
}

function renderCanvas(lookupTable, lookupQuery) {
  lookupTable[`${lookupQuery}`]()
}

function idleGame() {
  background(250, 250, 250)
  noLoop()
}

function startGame(event) {
  event.preventDefault()
  video.play()
  renderVideo()
  visualCountdown($.timer, 20)
  userFormData(event.target)
  canvasStatus = 'play' 
  loop()
  window.setTimeout(endGame, 20*1000)
}

function endGame() {
  video.pause()
  canvasStatus = 'end'
  // save the drawPath for the backend
  window.setTimeout((() => {
    canvasStatus = 'idle'
    redraw()
    drawPath = []
  }), 5*1000)
}

function endGameDrawing() {
  background(250, 250, 250)
    translate(640, 0)
    scale(-1, 1)
  renderPath(drawPath, 10)
  noLoop()
}

function playingGame() {
  renderVideo()
  bodyPointTracking(handedness, pose, drawPath)
  bodyPointTrackingTwoRelated('leftShoulder', 'rightShoulder', pose, shoulders)
  renderPath(drawPath, 10)
}

function modelLoaded() {
  console.log('model loaded (poseNet)')
}

function initiateVideoCapture() {
  video = createCapture(VIDEO)
  video.hide()
  $.video = document.querySelector('video')
  $.video.width = 640
  $.video.height = 480
  frameRate(15)
  poseNet = ml5.poseNet(video, modelLoaded)
  poseNet.on('pose', capturePose)
}

function capturePose(poseData) {
  if (poseData.length) {
    pose = poseData[0].pose;
  }
}

function bodyPointTrackingTwoRelated(bodyPointA, bodyPointB, bodyCapture, storePoints ) {
  bodyPointTracking(bodyPointA, bodyCapture, storePoints[0])
  bodyPointTracking(bodyPointB, bodyCapture, storePoints[1])
  if(storePoints[0].length > 1) { storePoints[0].shift() }
  if(storePoints[1].length > 1) { storePoints[1].shift() }
  pauseBox(storePoints)
}

function pauseBox(points) {
  
}

function bodyPointTracking(bodyPoint, bodyCapture, storePoints) {
  if (bodyCapture) {
    fill(255, 0, 0)
    ellipse(bodyCapture[bodyPoint].x, bodyCapture[bodyPoint].y, 20)
    storePoints.push(createVector(bodyCapture[bodyPoint].x, bodyCapture[bodyPoint].y))
  }
}

function renderPath(strokePath, weightStroke) {
  noFill()
  strokeWeight(weightStroke)
  stroke(255, 0, 0)
  beginShape()
    strokePath.forEach(point => vertex(point.x, point.y))
  endShape()
  if(strokePath.length > 400) { strokePath.shift() }
}

function renderVideo() {
  translate(640, 0)
  scale(-1, 1)
  image(video, 0, 0, 640, 480)
}

function userFormData(form) {
  let formData = new FormData(form)
  let preferredHand = formData.get('lefty')
  if (!preferredHand) { handedness = 'rightWrist' }
}

function visualCountdown($timeDisplay, counter) {
  count = setInterval(function() {
    counter >= 10 
      ? $timeDisplay.textContent = `00:${counter}`
      : $timeDisplay.textContent = `00:0${counter}`
    if (counter <= 0) {clearInterval(count)}
    counter--
  }, 1000)
}
