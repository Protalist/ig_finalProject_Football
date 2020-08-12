
//import
import * as THREE from '../src/node_modules/three/build/three.module.js'//'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from '../src/node_modules/three/examples/jsm/controls/OrbitControls.js' // 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../src/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { TDSLoader } from '../src/node_modules/three/examples/jsm/loaders/TDSLoader.js';

import {streetLamp,people} from '../src/Shape/shape.js'
//trhee object
const loader = new THREE.TextureLoader();
var loaderF = new FBXLoader();

//main object in the scene
var renderer;
var scene,Bscene;
var bgMesh;
var ball;
var camera;
var human;
var light_a=[];
var roller_wheel=[];
var texture_a=[];
var tree_a=[];
var lamp_a=[];


//controlli della telecamera
var controls 

//Dimensions
    //dimension Plane
    var planeA=120
    var planeB=120

    //dimension of the pivot
    const radius = 0.5;
    const widthSegments = 6;
    const heightSegments = 6;

    //dimension of the torso
    const bodyWidth=3;
    const bodyHeight=5.5;
    const bodyDepth=1.5;

//function
//
function light(a,b,c){
    const color = 0xFFFFFF;
    const intensity = 1.1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.castShadow = true; 


//light.shadowCameraVisible = true;
    light.position.set(a,b,c);
    light.shadow.camera.top=30;
    light.shadow.camera.bottom=0;
    light.shadow.mapSize.width = 300;  // default
    light.shadow.mapSize.height = 300; // default
    light.shadow.camera.near = -10.5;    // default
    light.shadow.camera.far = 50;     // default

    scene.add(light);
    light_a.push(light)
    var helper = new THREE.CameraHelper( light.shadow.camera );
   // scene.add( helper );

    
  }

function background(){
    Bscene=new THREE.Scene()
    var loader = new THREE.TextureLoader();
    var texture = loader.load(
        '../src/texture/sky.jpg',
        () => {
          const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
          rt.fromEquirectangularTexture(renderer, texture);
          scene.background = rt;
        });
    
}


function plane(a,b){
    const texture = loader.load('../src/texture/football_field.jpeg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = a/32;

    texture.repeat.set(1, 1);

    const planeGeo = new THREE.PlaneBufferGeometry(a,b);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    mesh.receiveShadow = true;
    scene.add(mesh);
    texture_a.push(texture)
    }


function humanStructure(){
    const Material = new THREE.MeshPhongMaterial({color: 0xFFFF00, fog: true});
    const cubeGeometry= new THREE.BoxBufferGeometry(1,1,1);
    
    const humanBody = new THREE.Object3D();

    const body=new THREE.Mesh(cubeGeometry,Material);
    body.scale.set(bodyWidth,bodyHeight,bodyDepth);
    body.position.set(0,8,0);
    body.castShadow = true; //default is false
    body.receiveShadow = true; //default
    humanBody.add(body)

    var rightArm=art(false);
    rightArm.position.set(bodyWidth*0.5+0.5,bodyHeight+4.6,0);

    var leftArm=art(false);
    leftArm.position.set(-(bodyWidth*0.5+0.5),bodyHeight+4.6,0);

    var rightLeg=art(true);
    rightLeg.position.set(bodyWidth*0.5-0.5,bodyHeight/2+2,0);

    var leftLeg=art(true);
    leftLeg.position.set(-(bodyWidth*0.5-0.5),bodyHeight/2+2,0);

    var head=new THREE.Mesh(cubeGeometry,Material);
    //head.scale.set(bodyWidth,bodyHeight,bodyDepth);
    head.position.set(0,bodyHeight*2 +0.4,0);

    humanBody.add(head);
    humanBody.add(rightArm);
    humanBody.add(leftArm);
    humanBody.add(rightLeg);
    humanBody.add(leftLeg);
    return humanBody

}
function rollerBlade(){


    var geometryUpper = new THREE.CylinderBufferGeometry(
        0.65, 0.55, 0.7,
        heightSegments, heightSegments,
        true,
        Math.PI * 0.15,//start
        Math.PI * 1.8);//hou much is open 
    
    var lowerGeometry=  new THREE.BoxBufferGeometry(0.7,0.7,2)

    var radiusTop =  0.15;  

    var radiusBottom =  0.15;  
    
    var height =  0.3;  
    
    var radialSegments = 11;  
    
    const geometryWheel = new THREE.CylinderBufferGeometry(
        radiusTop, radiusBottom, height, radialSegments);

    var rollerMaterial = new THREE.MeshPhongMaterial({color: 0xEA330C, fog: true});
    
    var upperPart= new THREE.Mesh(geometryUpper, rollerMaterial);
    var lowerPart= new THREE.Mesh(lowerGeometry, rollerMaterial);
    //rollerMaterial.map.set(texture);
    var wheel1= new THREE.Mesh(geometryWheel, rollerMaterial);
    var wheel2= new THREE.Mesh(geometryWheel, rollerMaterial);
    var wheel3= new THREE.Mesh(geometryWheel, rollerMaterial);

    lowerPart.position.set(0,-0.7,0.58)
    wheel1.rotation.z=90*Math.PI/180
    wheel1.position.set(0,-0.5,-0.8)

    wheel2.rotation.z=90*Math.PI/180
    wheel2.position.set(0,-0.5,0)

    wheel3.rotation.z=90*Math.PI/180
    wheel3.position.set(0,-0.5,0.8)

    upperPart.add(lowerPart);
    lowerPart.add(wheel1)
    lowerPart.add(wheel2)
    lowerPart.add(wheel3)

    roller_wheel.push(wheel1);
    roller_wheel.push(wheel2);
    roller_wheel.push(wheel3);

    return upperPart;
}


function art( isLeg){
    var pivotGeometry = new THREE.SphereBufferGeometry(
        radius, widthSegments, heightSegments);
  
    var pivotMaterial = new THREE.MeshPhongMaterial({color: 0xFFFF00, fog: true});

    var cubeGeometry= new THREE.CylinderBufferGeometry(
        0.5, 0.5, 2, 10);
    //THREE.BoxBufferGeometry(1,2,1)

    var pivot1 = new THREE.Mesh(pivotGeometry, pivotMaterial);
    //pivot1.position.set(0.,4.,0.)
    pivot1.castShadow = true; //default is false
    pivot1.receiveShadow = true; //default
    var upperArt= new THREE.Mesh(cubeGeometry, pivotMaterial);
    upperArt.position.set(0.,-0.7,0.)
    upperArt.castShadow = true; //default is false
    upperArt.receiveShadow = true; //default

    var pivot2 = new THREE.Mesh(pivotGeometry, pivotMaterial);
    pivot2.position.set(0.,-1,0.)
    
    var lowerArt= new THREE.Mesh(cubeGeometry, pivotMaterial);
    lowerArt.position.set(0.,-1,0.)
    lowerArt.castShadow = true; //default is false
    lowerArt.receiveShadow = true; //default

    pivot1.add(upperArt)
    upperArt.add(pivot2)
    pivot2.add(lowerArt)


    if(isLeg){
        var r=rollerBlade()
        r.position.set(0,-0.68,0);
        lowerArt.add(r)
    }

    return pivot1
}


function loadModel(){
    var carBox=new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());;;
    var loader3 = new TDSLoader();
    var r=loader3.load( '../src/Models/p/Gate.3ds', function ( object ) {
        // object.rotateX(90*Math.PI/180)
        //  object.rotateY(-90*Math.PI/180)
        // object.position.set(-planeA/2,0,0);
        console.log(object)
        // apply texture
        object.traverse(
            function (child){
                if (child instanceof THREE.Mesh) {
            child.material.map = loader.load('../src/Models/p/texture.jpg');
            child.material.needsUpdate = true;
            child.material.side = THREE.DoubleSide;
            child.castShadow = true; //default is false
            child.receiveShadow = true; //default
                }
            }
        )

         object.position.set(planeA/2-2,10,0);
        object.rotateX(-90*Math.PI/180)
        object.rotateZ(-180*Math.PI/180)
        object.scale.set(0.1,0.09,0.09)

        scene.add( object );
        
        console.log("before")

        console.log("after")


    } );
    
}




window.onload= function(){
    

    scene = new THREE.Scene();
    //scene.fog=new THREE.Fog( 'skyblue' , 1, 2);
    background()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,17,17)
    scene.background = new THREE.Color( 'skyblue' );

    //var helper = new THREE.CameraHelper( camera );
   // scene.add( helper );
    
    light(-2, 4, 8);

    plane(planeA,planeB);

    scene.add(camera)

    human=humanStructure()
    scene.add(human);
    ball = ball(1,32);
    

    {var color = 0x89846c;
        var intensity = 0.3;
        var aLight = new THREE.AmbientLight(color, intensity);
        scene.add(aLight);
    }


var d=-1
for(var i=0;i<3;i++){
    var sre=streetLamp()
    sre.position.set(d*(planeA/2-10),0,planeA/2)
    sre.rotateY(180*Math.PI/180)
    scene.add(sre)

    var sre2=streetLamp()
    sre2.position.set(d*(planeA/2-10),0,-planeA/2)
    sre2.rotateY(0*Math.PI/180)
    scene.add(sre2)
    d++
}
var spalto=people(planeA)
scene.add(spalto)
    loadModel();


    renderer = new THREE.WebGLRenderer();
    renderer.autoClearColor = false;
    renderer.shadowMap.enabled = true ;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setPixelRatio( window.devicePixelRatio );

    // add the automatically created <canvas> element to the page
    document.body.appendChild( renderer.domElement );

    // render, or 'create a still image', of the scene

    renderer.render( scene, camera );
    
    controls = new OrbitControls(camera,renderer.domElement);
    controls.update();

    animate(0.00);
 
}


function animate(time){
    // time *= 0.001;
    // var delta=time-now;
    // now=time;
    // an=an+delta
    requestAnimationFrame( animate );

    controls.update();
   
	renderer.render( scene, camera );
}


document.onkeypress=function(e){
    if(e.keyCode==115){
        renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
    }
}


