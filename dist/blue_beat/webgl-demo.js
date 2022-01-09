main();

//
// Start here
//
var full = false;

function goFullScreen(){
  const canvas = document.querySelector('#glcanvas');

  if(!full){

    if(  canvas.webkitRequestFullScreen){
      canvas.webkitRequestFullScreen()
    }else{
      canvas.mozRequestFullScreen()
    }
    full = true
  }else{
    if (canvas.webkitCancelFullScreen){
      canvas.webkitCancelFullScreen()
    }else{
      canvas.mozCancelFullScreen
    }
    full = false
  }

}

function main() {

  var circleRotation = 0;


  const canvas = document.querySelector('#glcanvas');

  canvas.width = window.screen.width;
  canvas.height = window.screen.height;


  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');

  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 appData;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 pos;
    varying lowp vec4 data;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      pos = aVertexPosition;
      data = appData;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 pos;
    varying lowp vec4 data;

    lowp float ring_rad;


    //converts normal coordinates to radial
    lowp vec2 angular(){
      lowp float rad = pow(pos.x, 2.0) + pow( pos.y, 2.0);
      lowp float rot = atan(pos.y/pos.x)/3.141529/2. +.25;
      rot += step(pos.x,0.)*0.5;
      lowp vec2 res = vec2(rad*2.2,rot);
      return res;
    }

    lowp float noise(lowp float t, lowp float seed){
      return fract(sin(t*seed)*sin(t*t)*seed);
    }

    lowp float rand(lowp float t, lowp float seed){
      t = abs(t);
      lowp float fr = fract(t);
      lowp float cl = ceil(t);



      return noise(cl,seed)*(1.-fr) + noise(cl+1.,seed)*(fr);
    }

    lowp float smoothmin(lowp float a, lowp float b){
      lowp float t = 100.;
      lowp float wa = pow(t,-a);
      lowp float wb = pow(t,-b);
      wa = wa / (wa+wb);
      return a *wa + b*(1.-wa);
    }

    lowp float wave_generator(lowp float freq,lowp float diffusion, lowp float y){

      lowp float d1 = clamp(1.-abs(freq-1.)/diffusion,0.,1.);
      lowp float d2 = clamp(1.-abs(freq-2.)/diffusion,0.,1.);
      lowp float d3 = clamp(1.-abs(freq-3.)/diffusion,0.,1.);
      lowp float d4 = clamp(1.-abs(freq-4.)/diffusion,0.,1.);
      lowp float d5 = clamp(1.-abs(freq-5.)/diffusion,0.,1.);
      lowp float d6 = clamp(1.-abs(freq-6.)/diffusion,0.,1.);
      lowp float d7 = clamp(1.-abs(freq-7.)/diffusion,0.,1.);
      lowp float d8 = clamp(1.-abs(freq-8.)/diffusion,0.,1.);
      lowp float d9 = clamp(1.-abs(freq-9.)/diffusion,0.,1.);
      lowp float d10= clamp(1.-abs(freq-10.)/diffusion,0.,1.);


      y = y *3.141529*2.;

      lowp float w = cos(y*2.)*d1
                    +cos(y*4.)*d2
                    +cos(y*8.)*d3
                    +cos(y*16.)*d4
                    +cos(y*32.)*d5
                    +cos(y*64.)*d6
                    +cos(y*128.)*d7
                    +cos(y*256.)*d8
                    +cos(y*512.)*d9
                    +cos(y*1024.)*d10
                    ;
      w = w/(d1+d2+d3+d4+d5+d6+d7+d8+d9);




      w = w*.5+.5;
      w = 1.-(1.-w)*1.1;
      return w;
    }



    lowp float bow_generator(lowp float brek, lowp float bow,lowp float spiral, lowp float x){

      lowp float y = abs(x-.5)*brek;

      y += (x*x+0.25-x) *bow;
      y += (x-.3) *spiral;
      return y;
    }

    lowp vec3 huemixer(lowp float saturation, lowp float t){

      lowp vec3 hue = vec3(clamp(t,0.,1.)*0.5,-clamp(t,-1.,0.),1.);
      saturation = pow(saturation,.5);
      saturation = 0.2+saturation*0.8;
      return hue*saturation+vec3(.7,.7,.7)*(1.-saturation);
    }

    lowp vec3 colormixer(lowp vec3 hue, lowp float wave){
      wave /=1.5;
      lowp float s = .1;
      lowp float cw = clamp(cos((wave-.75)*.7*3.1415),0.,1.);

      // cw = step(.1,wave);
      return hue*cw
      ;
    }

    void main() {
      lowp float time = data[3];

      lowp vec2 relpos = angular();
      lowp float edge = clamp((1.-relpos.x)*100.,0.,1.);

      // lowp float ring_rad = .5;
      // lowp float ring_strength = .08;

      ring_rad = .5;
      lowp float ring_strength = .08;

      lowp float x = relpos.x - ring_rad;
      lowp float ring = pow(x,2.)/ring_strength;
      ring = 1.-ring;

      ring = clamp(ring,0.,1.);

      lowp float brightness =  ring;

      lowp float y = relpos.y;

      time = time *.25+13.45;
      lowp float beat = .01;
      lowp float beatfreq = 30.;
      lowp float beatamp = cos(time*beatfreq)*beat;
      lowp float speed = sin(time*beatfreq)*beat*5.;
      lowp float acc = -cos(time*beatfreq);


      lowp float brek         = rand(time*.6,9126.5)*2.;
      lowp float bow          = rand(time*.7,1111.1)*1.;
      lowp float spiral       = rand(time*.9,2193.7)*.6;
      lowp float wiggle       = rand(time/.55,1222.4);
      lowp float rotoffset    = rand(time/2.1,9834.4);
      lowp float freqdiffusion= rand(time*.8,7323.4);
      lowp float freq         = rand(time*1.55,1121.4);
      lowp float heart        = rand(time*.5,7474.1);
      lowp float saturation   = rand(time/1.2,35843.);
      lowp float temperature  = rand(time/.7,904.)*2.-1.;

      y = y + time * .2 + beatamp;
      spiral = .0;

      brek = clamp(brek-.75,0.,1.)+clamp(brek-0.25,-1.,0.);
      brek = brek*3.;

      y += bow_generator(brek,acc*.7,spiral + speed,relpos.x);

      // freq = 0.5;
      // freqdiffusion = .00;

      // freqdiffusion = pow(freqdiffusion,freq*2.);

      freq = freq*4.;
      freqdiffusion = freqdiffusion * 4.+1.;
      freqdiffusion = clamp(freqdiffusion,5.,10.);

      lowp float wave = wave_generator(freq,freqdiffusion,y);

      // heart = 1.;

      lowp float heartbeat = sin(time*150.-x*5.);
      heartbeat = pow(clamp(heartbeat,0.,1.),2.)*.5-.1;
      heart = clamp(heart*1.6-1.,0.,1.);
      heartbeat *= heart;

      wave += pow(wave,0.5)*heartbeat;

      wave = clamp(wave,0.,1.);

      lowp vec3 lighthue = vec3(1.,1.,1.);


      lowp vec3 hue = vec3(0.,0.,1.);
      hue = huemixer(saturation,temperature);

      lowp vec3 col = colormixer(hue,wave);

      col = col *brightness;

      gl_FragColor = vec4(col*edge,1.);



      x = 1./relpos.x*200.;
      x = x+time*20.;
      // x = relpos.x*15.+time*40.;

      y = relpos.y;

      y = ceil(y*2000.);
      x = ceil(x);

      lowp float x1 = noise(x,2193.7);
      lowp float x2 = noise(x+y,21.7);

      x1 = x2*x1;
      x1 = fract(sin(x1)*10.);
      x1 = clamp((x1-.9985)*1000.,0.,1.);

      lowp float backstar = noise(ceil(pos.x*1000.),3953.)
                            *noise(ceil(pos.y*1000.+113.4),384.1);
      backstar = fract(sin(backstar)*10.);
      backstar = clamp((backstar-.9985)*10000.,0.,1.);


      lowp float star;
      star = x1;
      star += backstar;

      star = star*clamp((relpos.x-.78)*100.,0.,1.);
      gl_FragColor += star;
    }


  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      appData: gl.getAttribLocation(shaderProgram,'appData')

    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Draw the scene
  var last_time = 0;
  function render(now){

    delta = now-last_time;
    last_time = now
    circleRotation +=delta * 0.0001;

    var x = 1
    var y = 1
    var z = 0
    var t = circleRotation


    var data = [x,y,z,t,
                x,y,z,t,
                x,y,z,t,
                x,y,z,t]

    const dataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,dataBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(data),
                  gl.STATIC_DRAW);

    drawScene(gl, programInfo, buffers, dataBuffer);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//



function initBuffers(gl) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = [
     1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
    -1.0, -1.0,
  ];



  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, appData) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -1.5]);  // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to pass appData to fragmentShader
  {
    const numComponents = 4; //size of data
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, appData)
    gl.vertexAttribPointer(
      programInfo.attribLocations.appData,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.appData);
  }
  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
