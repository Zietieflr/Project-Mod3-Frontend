let windowWidth = window.innerWidth
let video
let poseNet
let pose
let drawPath = []
let canvasStatus = 'idle'
let handedness = 'leftWrist'
const leftRight = {
  'leftWrist': 'rightWrist',
  'rightWrist': 'leftWrist'
}
let leftShoulder = []
let rightShoulder = []
let shoulders = [ leftShoulder , rightShoulder ]
let category

const $ = {
  main: document.querySelector('main'),
  timer: document.querySelector('.timer'),
  category: document.querySelector('.category'),
  userInput: document.querySelector('.user-input'),
  splashPage: document.querySelector('.splash'),
}

const url = {
  random: 'http://localhost:3000/random'
}

$.userInput.addEventListener('submit', startGame)

const canvasRender = {
  idle: idleGame,
  end: endGameDrawing,
  play: playingGame, 
}

function setup() {
  createCanvas(640, 480).parent($.main)
  // initiateVideoCapture()
  getCategory()
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
  $.category.textContent = category
  visualCountdown($.timer, 20)
  userFormData(event.target)
  canvasStatus = 'play' 
  loop()
  window.setTimeout(endGame, 20*1000)
}

function endGame() {
  video.pause()
  canvasStatus = 'end'
  $.category.textContent = ''
  getCategory()
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
  console.log('category', category)
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
  if (bodyCapture) {
    if(storePoints[0].length > 1) { storePoints[0].shift() }
    if(storePoints[1].length > 1) { storePoints[1].shift() }
    pauseBox(storePoints, bodyCapture)
  }
}

function pauseBox(points, bodyCapture) {
  difference = (points[0][0].x - points[1][0].x)/2
  let offHand = []
  bodyPointTracking(leftRight[handedness], bodyCapture, offHand)
  if (
    (offHand[0].x > points[1][0].x ) &&
    (offHand[0].y > points[0][0].y - difference) &&
    (offHand[0].x < points[0][0].x) &&
    (offHand[0].y < points[1][0].y + difference)
  ) {}
}

function bodyPointTracking(bodyPoint, bodyCapture, storePoints) {
  if (bodyCapture) {
    // fill(255, 0, 0)
    // ellipse(bodyCapture[bodyPoint].x, bodyCapture[bodyPoint].y, 20)
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
  resetCounter = counter 
  $timeDisplay.textContent = `00:${counter}`
  count = setInterval(function() {
    counter--
    (counter >= 10)
      ? $timeDisplay.textContent = `00:${counter}`
      : $timeDisplay.textContent = `00:0${counter}`
    if (counter <= 0) {
      clearInterval(count)
      $timeDisplay.textContent = `00:${resetCounter}`
    }
  }, 1000)
}

function boilerPlateGet(url, method) {
  return fetch(url, {
    method: method, 
    headers: {'Content-Type': 'application/json'},
  })
}

function getCategory() {
  boilerPlateGet(url.random, 'GET')
    .then(response => response.json())
    .then(result => category = result.title)
}