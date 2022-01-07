main();

//
// Start here
//

function goFullScreen(){
  const canvas = document.querySelector('#glcanvas');


  canvas.webkitRequestFullScreen()


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



    lowp vec2 angular(){
      lowp float rad = pow(pos.x, 2.0) + pow( pos.y, 2.0);
      lowp float rot = atan(pos.y/pos.x)/6.283 +.25;
      rot += step(pos.x,0.)*0.5;
      lowp vec2 res = vec2(rad*1.5,rot);
      return res;
    }



    void main() {
      lowp float time = data[3];

      lowp vec2 relpos = angular();
      lowp float edge = clamp((1.-relpos.x)*100.,0.,1.);

      lowp float ring_rad = .5;
      lowp float ring_strength = .08;

      lowp float x = relpos.x - ring_rad;
      lowp float ring = pow(x,2.)/ring_strength;
      ring = 1.-ring;

      ring = clamp(ring,0.,1.);

      lowp float brightness =  ring;

      lowp float wave_y =
      - pow(relpos.x,.1)*50. + pow(relpos.x,6.)*100.
      + relpos.y * 3.1415 * 2. * 32.
      -time * 5.;

      lowp float wave =
                        cos(wave_y)*.6+
                        cos(wave_y/2.)*.2+
                        cos(wave_y/4.)*.2;
      wave = wave +0.5;

      lowp vec3 lighthue = vec3(0.1,0.4,0.6);
      lowp vec3 hue = vec3(0.,0.,.6);
      hue = hue+lighthue*wave;
      hue = clamp(hue,0.,1.);

      lowp vec3 col = vec3(hue*brightness);



      lowp float spec = pow(relpos.x-.63,2.)+  pow(relpos.y - .5,2.)*1.5;
      lowp float spec2 = pow(relpos.x-.45,2.)+  pow(relpos.y - .0,2.)*2.;
      lowp float spec3 = pow(relpos.x-.45,2.)+  pow(relpos.y - 1.0,2.)*2.;


      spec = min(spec,spec2);
      spec = min(spec,spec3);


      spec = 1.1-spec*1000.;
      spec = clamp(spec,0.,.8);

      // col = col + vec3(spec);

      gl_FragColor = vec4(col*edge,1.);
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
                 [-0.0, 0.0, -2.0]);  // amount to translate

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
