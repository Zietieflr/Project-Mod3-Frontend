# bodle
### A full body experience... for doodling.

This is a full stack application, of which this repository is the frontend. You'll need the [Backend Repository](https://github.com/Zietieflr/Project-Mod3-Backend) as well for full functionality. 

This is my third module project for Flatiron Denver. At the time of writing this, I have been coding for nine weeks, and this is my first solo full stack application. Here is the culmination of what I can do in three days, after eight weeks of immersive coding. 

## What is bodle? 
A small Scottish coin, not worth very much, according to Google. In this instance though, its a hybrid of body and doodle. I wanted a project which would force me to leave my coding chair on occasion, so using the body tracking systems of poseNet(ml5.js) I set about making an app where you would have to use your body to draw simple doodles. 

I was inspired to use the ml5.js library, but I didn't have a good direction to implement the project until I saw the project [Quick, Draw!](https://quickdraw.withgoogle.com/). From there, the pieces fell into place and bodle was born. 

## Demonstration 

## Installation
Most of this project uses cdn references in the HTML, so the installation is fairly light. Once you have the file locally and have followed the steps to get the [Backend Repository](https://github.com/Zietieflr/Project-Mod3-Backend) running, you simply need to host the local server. I used [lite-server](https://github.com/johnpapa/lite-server). 

**I recommend starting the Rails server, then lite-server to keep the ports playing nicely.**

In the command line folder of this directory: 
lite-server
```
lite-server
```

At this point a tab will automatically open in your most recently used browser window. 

## Get Doodlin'
Smile! You're on camera, however, its not recording. None of your experience is being saved, and your video will never be recorded. Once the models have loaded (this usually only takes 5-10 seconds) you can click the Welcome plaque and get to playing!

To the lower right of the camera, you'll see a checkbox for preferred drawing hand. Check for being a lefty, or uncheck for being a righty. 

Once you're ready, make sure you have some space to stand and back up. Click *Start!* and you have twenty seconds to draw the category appearing to the upper right of the canvas. The app will track your movements drawing where your chosen hand *(wrist, technically)*, goes.

### Some Tips
You will have best results if you are well lit, and the camera can see your whole body. The technology can occasionally lose track of your hand, but it will get back on course. Wide sweeping gestures, rather than quick flicks, will help. **MOST IMPORTANTLY HAVE FUN, bodle is fun and silly.**

## Future Goals
Time and circumstance permitting, the following are features I would like to add to bodle. 
-Stop drawing, aka: lift the pencil
-In application explanation of how to play the game
-A countdown before you have to start drawing
-Green screen effect to make the background less confusing while drawing
-Saving the doodles you make
  -Ability to go through your previous doodles
  -Video or image capture would not be involved 
-Train ml5.js from Quick, Draw! database and have it attempt to guess what your doodle is
-Color picker for your doodles

## Technologies Used
-JavaScript
-p5.js
-ml5.js
  -poseNet(Focus)
-Ruby on Rails
-Quick, Draw! 
  -Categories used, for later integration

## Contact 
[LinkedIn](www.linkedin.com/in/Logan-McGuire)
lrmcguire93@gmail.com

Thank you!