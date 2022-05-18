var camera, scene, renderer;
var input, output, audioControls, audioFile, audioSource, data, sound;
var analyser;
var data;
let mainSphere;
////////////////////////////////////////////////////////////////////////
// Get random float
function getRandomArbitrary(min, max) {
return Math.random() * (max - min) + min;
}
// Get a random element from array
function getRandom(list) {
return list[Math.floor(Math.random() * list.length)];
}


// Create a sphere
function createSphere(radius) {
    let geometry = new THREE.SphereGeometry(radius, 90, 300);

    let sMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0x0800ff,
        shininess: 100,
        flatShading: true,
      });

    let sphere = new THREE.Mesh(geometry, sMaterial);
    sphere.position.set(0, 0, 0);
    return sphere;
};

// Create spotlight
function createSpotlight(color) {
    const light = new THREE.SpotLight(color, 2);
    light.castShadow = true;
    light.angle = 0.3;
    light.penumbra = 0.2;
    light.decay = 2;
    light.distance = 50;
    light.position.set(10,10,10);
    light.target.position.set(0,0,0);
    return light;
}
// Animate sphere
function animateSphereUniform(curFreq) {
    scene.remove(mainSphere);

    let sphere = createSphere(4);
    let center = new THREE.Vector3(0, 0, 0);

    const vertices = sphere.geometry.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 24) {
        let x = vertices[i];
        let y = vertices[i + 1];
        let z = vertices[i + 2];

        let curVertex = new THREE.Vector3(x,y,z);

        // let noise = getRandomArbitrary(0, curFreq/50);

        let noise = curFreq/50;
        
        let normal = curVertex.clone().sub(center);
        normal.normalize();
        normal.multiplyScalar(noise);
        curVertex.add(normal);

        vertices[i] = curVertex.x;
        vertices[i + 1] = curVertex.y;
        vertices[i + 2] = curVertex.z;
    }
    mainSphere = sphere;
    scene.add(mainSphere);
}

function animateSphereRandom(curFreq) {
    scene.remove(mainSphere);

    let sphere = createSphere(3);
    let center = new THREE.Vector3(0, 0, 0);

    const vertices = sphere.geometry.attributes.position.array;

    let offset = getRandom([6,12,15,18,21]);

    for (let i = 0; i < vertices.length; i += offset) {
        let x = vertices[i];
        let y = vertices[i + 1];
        let z = vertices[i + 2];

        let curVertex = new THREE.Vector3(x,y,z);

        let noise = getRandomArbitrary(0, curFreq/30);

        // let noise = curFreq/50;
        
        let normal = curVertex.clone().sub(center);
        normal.normalize();
        normal.multiplyScalar(noise);
        curVertex.add(normal);

        vertices[i] = curVertex.x;
        vertices[i + 1] = curVertex.y;
        vertices[i + 2] = curVertex.z;
    }
    mainSphere = sphere;
    scene.add(mainSphere);
}
////////////////////////////////////////////////////////////////////////
function init() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    // Set up camera
    camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 0, 15);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width-100, height-100);
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);

    // Set up renderer, canvas, and minor CSS adjustments
    renderer.setPixelRatio(window.devicePixelRatio);
    const canvas = renderer.domElement;
    canvas.style.display = 'block'; // Removes padding below canvas
    document.body.style.margin = 0; // Removes margin around page
    document.body.style.overflow = 'hidden'; // Fix scrolling
    document.body.appendChild(canvas);

    var audioFile = null;
    var input;
    var audio;
    var data = null;
    var audioSource;

    //Create the sphere and add it to the scene
    var sphere = createSphere(4);
    mainSphere = sphere;
    scene.add(mainSphere);

    //Create a light source and add it to the scene
    const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );
}


function loadAudio() {

    input.onchange = function () {
        var reader = new FileReader();
        var file = input.files[0];
        reader.readAsArrayBuffer(file);
        audioControls.src = URL.createObjectURL(file);
        listener = new THREE.AudioListener();

        sound = new THREE.Audio(listener);
        sound.setMediaElementSource(audioControls);
        analyser = new THREE.AudioAnalyser(sound, 32768);

    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    scene.rotation.y += 0.005;
    scene.rotation.x += 0.005;


    renderer.render(scene, camera);
    input = document.getElementById("audioInput");
    audioControls = document.getElementById("audioControls");

    if (input != null) {
        loadAudio();
    }

    if (analyser) {
        if (analyser.getAverageFrequency() != 0) {
            // console.log(analyser.getAverageFrequency());
            animateSphereRandom(analyser.getAverageFrequency());
        }
    }

    window.addEventListener('resize', onWindowResize, true);

    requestAnimationFrame(animate);
}
init();
animate();
