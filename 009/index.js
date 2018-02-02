const THREE = require('three')
const postprocessing = require('postprocessing');
const EffectComposer = postprocessing.EffectComposer
const RenderPass = postprocessing.RenderPass
const GlitchPass = postprocessing.GlitchPass
// const fragmentShader = require('./glitch-shader')

// Set the scene size.
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const container =
    document.createElement('div');
container.style.width = WIDTH + 'px';
container.style.height = HEIGHT + 'px';
document.body.appendChild(container);

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer();
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

const scene = new THREE.Scene();

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);

// create the sphere's material
// const sphereMaterial =
//   new THREE.MeshBasicMaterial(
//     {
//       color: 0xCC8844
//     });
const sphereMaterial = new THREE.MeshPhongMaterial( {
          color: 0x896215,
          emissive: 0x072534,
          side: THREE.DoubleSide,
          flatShading: true
        })

// Set up the sphere vars
const RADIUS = 75;
const SEGMENTS = 8;
const RINGS = 8;

// Create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
const sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    RADIUS,
    SEGMENTS,
    RINGS),

  sphereMaterial);

// Move the Sphere back in Z so we
// can see it.
sphere.position.z = -300;

// Finally, add the sphere to the scene.
scene.add(sphere);

// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 0;

// add to the scene
scene.add(pointLight);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const glitchPass = new GlitchPass();
glitchPass.renderToScreen = true;
composer.addPass(glitchPass);

function update () {
  // Draw!
  // renderer.render(scene, camera);
  composer.render();

  sphere.rotation.x += 0.005;
  sphere.rotation.y += 0.005;

  // Schedule the next frame.
  requestAnimationFrame(update);
}

// Schedule the first frame.
requestAnimationFrame(update);
