//Based on :
// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/learning/ml5/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR
let cnv;
let video;
let poseNet;
let pose;
let skeleton;
let fr = 60; 
let x_line = 0;
let speed = 20;
var lastPrint;
var i = 0;
let arr = [];
let kick;


/*
https://teropa.info/ext-assets/drumkit/kick.mp3
https://teropa.info/ext-assets/drumkit/hatClosed.mp3
https://teropa.info/ext-assets/drumkit/hatOpen2.mp3
https://teropa.info/ext-assets/drumkit/snare2.mp3
https://teropa.info/ext-assets/drumkit/tomLow.mp3
https://teropa.info/ext-assets/drumkit/tomMid.mp3
https://teropa.info/ext-assets/drumkit/ride.mp3
https://teropa.info/ext-assets/drumkit/hatOpen.mp3

*/


function preload(){

  ride = loadSound("https://teropa.info/ext-assets/drumkit/ride.mp3");
  tommid = loadSound("https://teropa.info/ext-assets/drumkit/tomMid.mp3");
  tomlow = loadSound("https://teropa.info/ext-assets/drumkit/tomLow.mp3");
  snare = loadSound("https://teropa.info/ext-assets/drumkit/snare2.mp3");
  kick = loadSound("https://teropa.info/ext-assets/drumkit/kick.mp3");

}


function setup() {
  frameRate(fr);
  cnv = createCanvas(640, 480);  
  cnv.id('canvas');
  //centerCanvas();
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  //lastPrint = millis() - 3000;
    for(let i =0; i<40; i++){

      if(i<8){arr.push("rr");}
      if(i>7 && i<16){ arr.push("tm");}
      if(i>15 && i<24) {arr.push("tl");}
      if(i>23 && i<32){arr.push("sd");}
      if(i>31){arr.push("kk");}
  }
}


function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function bar(){
stroke(0,255,255);
    line(x_line,0,x_line,height);
  x_line = x_line + 60;
  if(x_line>width){
    x_line = 0;
  }
}

function grid(){
  for (var x = 0; x < width; x += width / 8) {
    for (var y = 0; y < height; y += height / 5) {
      stroke(128);
      strokeWeight(1);
      line(x, 0, x, height);
      line(0, y, width, y);
    }
  }

}


function grid2(){
  textAlign(CENTER, CENTER);
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 8; x++) {
      let xpos = x *80;
      let ypos = y *96;
      
      let index = y * 8 + x; // find the index
      
      if( inside(xpos, ypos, 80,96) ){
        // were inside
        fill('rgba(0,200,200, 0.5)');
      } else {
        // not inside
        //fill(255);
        fill('rgba(255,255,255, 0.1)');
      }
      
      stroke(128);
      rect(xpos, ypos, 80, 96);
      
      fill(255);
      noStroke();
      text(arr[index], xpos, ypos, 80,96);

      // colorMode(RGB);
    }
  }

}




function grid_pose(posx,posy,x_line){
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 8; x++) {
      let xpos = x *80;
      let ypos = y *96;
      let index = y * 8 + x; 
      if( inside2(xpos, ypos, 80,96,posx,posy) ){
        // were inside
        fill('rgba(0,200,200, 0.5)');
        if(x_line>xpos && x_line< xpos+80)
        {
          if(index<8){ride.play();}
          if(index>7 && index<16){tommid.play();}
          if(index>15 && index<24){tomlow.play();}
          if(index>23 && index<32){snare.play();}
          if(index>31){kick.play();}
        }
      }  
      else{

        fill('rgba(255,255,255, 0)');
      }

      stroke(128);
      rect(xpos, ypos, 80, 96);   
      }
    }
  }




function inside2(x,y,w,h, posx, posy){
 if(posx > x && posx < x + w && posy > y && posy < y + h) {
  return true; 
 } else {
  return false; 
 } 
}

function inside(x, y, w, h){
 if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
  return true; 
 } else {
  return false; 
 }
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}


function draw() {
  try{
  image(video, 0, 0);
  }
  catch(err)
  {
    console.log(err);

  }


  grid2();

  if (pose) {
    //let eyeR = pose.rightEye;
    //let eyeL = pose.leftEye;
    //let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    //fill(255, 0, 0);
    //ellipse(pose.nose.x, pose.nose.y, d);
    //fill(0, 0, 255);
    //ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    //ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      grid_pose(x,y,x_line);
      fill(0, 200, 200);
      ellipse(x, y, 16, 16);
    }

    /*for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }*/
  }


  /*var timeElapsed = millis() - lastPrint;
  //console.log(timeElapsed);

  if (timeElapsed > 1000) {
    i++;
    console.log(i);
    lastPrint = millis();
  }*/
    bar();


}
