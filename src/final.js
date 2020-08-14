
//import
import * as THREE from '../src/node_modules/three/build/three.module.js'//'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from '../src/node_modules/three/examples/jsm/controls/OrbitControls.js' // 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../src/node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { TDSLoader } from '../src/node_modules/three/examples/jsm/loaders/TDSLoader.js';
//import {TWEEN} from "/src/node_modules/three/examples/jsm/libs/tween.module.min.js";


import TWEEN from '../src/node_modules/@tweenjs/tween.js/dist/tween.esm.js'

import {streetLamp,people, portiere, ball} from '../src/Shape/shape.js'

var clock = new THREE.Clock();

var GOAL=false;

//trhee object
const loader = new THREE.TextureLoader();
var update =0.2;

var collisions=[];
//main object in the scene
var renderer;
var scene,Bscene;
var bgMesh;
var balla,goal,fuoriDx,fuoriSx,fuoriUp;
var camera;
var human;
var light_a=[];
var roller_wheel=[];
var texture_a=[];
var tree_a=[];
var lamp_a=[];

//gif
var gif=[];

var tween

var tween1,tween2;
var notStartedSecondTween=false;
var notStarted = false;


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


function calculateCollisionPoints( mesh,type,idArray) { 
    // Compute the bounding box after scale, translation, etc.
    var bbox = new THREE.Box3().setFromObject(mesh);
   
    var bounds = {
      type: type,
      xMin: bbox.min.x,
      xMax: bbox.max.x,
      yMin: bbox.min.y,
      yMax: bbox.max.y,
      zMin: bbox.min.z,
      zMax: bbox.max.z,
    };
    if(idArray>=collisions.length){
        collisions.push( bounds );
    }
    else{
        collisions.splice(idArray,1,bounds);
    }
  }


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

function fondoCampo(){
    
    const planeGeo = new THREE.PlaneBufferGeometry(50,120);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0x44aa88,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.position.set(85,0,0);
    mesh.rotation.x = Math.PI/2;
    scene.add(mesh);
}

function specchio(){
    
    const planeGeo = new THREE.PlaneBufferGeometry(55,16);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    
    mesh.receiveShadow = true;
    mesh.position.set(52.5,9,0);
    mesh.rotation.y = Math.PI/2;
    return mesh;
}

function fuorisx(){
    
    const planeGeo = new THREE.PlaneBufferGeometry(35,20);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0xFF0000,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    
    mesh.receiveShadow = true;
    mesh.position.set(51.5,9,-47);
    mesh.rotation.y = Math.PI/2;
    return mesh;
  
}

function fuoridx(){
    
    const planeGeo = new THREE.PlaneBufferGeometry(35,20);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0x0000FF,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    
    mesh.receiveShadow = true;
    mesh.position.set(51.5,9,47);
    mesh.rotation.y = Math.PI/2;
    return mesh;
}

function fuoriup(){
    
    const planeGeo = new THREE.PlaneBufferGeometry(55+70,50);
    const planeMat = new THREE.MeshPhongMaterial({
        color: 0xFFF000,
    side: THREE.DoubleSide,
    fog: false,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    
    mesh.receiveShadow = true;
    mesh.position.set(51.5,43.5,0);
    mesh.rotation.y = Math.PI/2;
    return mesh;
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
        object.scale.set(0.1,0.2,0.09)

        scene.add( object );
        
        console.log("before")

        console.log("after")


    } );
    
}


function detectCollisions() {
  // Get the user's current collision area.
  
 
  // Run through each object and detect if there is a collision.
  for ( var index = 1; index < collisions.length; index ++ ) {
   
    if (collisions[ index ].type == 'collision' ) {
      if ( ( collisions[ 0 ].xMin <= collisions[ index ].xMax && collisions[ 0 ].xMax >= collisions[ index ].xMin ) &&
         ( collisions[ 0 ].yMin <= collisions[ index ].yMax && collisions[ 0 ].yMax >= collisions[ index ].yMin) &&
         ( collisions[ 0 ].zMin <= collisions[ index ].zMax && collisions[ 0 ].zMax >= collisions[ index ].zMin) ) {
        // We hit a solid object! Stop all movements.
        if(index==1){
            console.log("GOAL");
            GOAL=true;
        }
        else{
            console.log("MISS");
            tween1.stop();
            var pos = {x:collisions[0].xMax-0.5,y:collisions[0].yMax-0.5,z:collisions[0].zMax-0.5};
            var tar = {x:pos.x - (10+Math.random()*20),y:1,z:pos.z-Math.random()*5+Math.random()*5};
            
            new TWEEN.Tween(pos).to(tar, 2000).onUpdate(()=>{balla.position.x=pos.x;
                                                            balla.position.y=pos.y;
                                                            balla.position.z=pos.z;
                                                            balla.rotation.x+=Math.random()})
                                                            .easing(createNoisyEasing(0.1,TWEEN.Easing.Bounce.Out)).start();
        }
 
        // Move the object in the clear. Detect the best direction to move.
       
      }
    }
  }
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
    fondoCampo();
    goal = specchio();
    
    scene.add(camera);
    fuoriDx=fuoridx();
    fuoriSx=fuorisx();
    fuoriUp=fuoriup();
   
    
    human=humanStructure()
    human.position.x=-5;
    human.rotation.y=Math.PI/2;
    scene.add(human);
    balla = ball(1,32);
    balla.position.y=1;

    scene.add(balla);
    console.log(balla.position.z)
    var port=portiere();
    port.translateX(planeA/2-10)
    port.translateZ(-20)
    port.rotateY(90*Math.PI/180)

    scene.add(port)
    calculateCollisionPoints(balla,"collision",0);
    calculateCollisionPoints(goal,"collision",1);
    calculateCollisionPoints(port,"collision",2);
    calculateCollisionPoints(fuoriUp,"collision",3);
     calculateCollisionPoints(fuoriDx,"collision",4);
     calculateCollisionPoints(fuoriSx,"collision",5);
    
    
    {var color = 0x89846c;
        var intensity = 0.3;
        var aLight = new THREE.AmbientLight(color, intensity);
        scene.add(aLight);
    }


    
    
     tween= new TWEEN.Tween(port.position).to({z:20},3000).repeat(Infinity).yoyo(true).onUpdate(()=>{
        calculateCollisionPoints(port,"collision",2);
     }).start()
    
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
var spalto=people(planeA,gif)
scene.add(spalto)
    loadModel();

    document.addEventListener('keydown', function(event) {
        if (event.code == 'KeyK' && !notStarted) {
            notStarted=true;
           ShotBall(balla,"rightLow");
        }
        else if (event.code == 'KeyI'&& !notStarted ) {
            notStarted=true;
            ShotBall(balla,"rightHigh");
         }
         else if (event.code == 'KeyU' && !notStarted) {
            notStarted=true;
            ShotBall(balla,"centerHigh");
         }
         else if (event.code == 'KeyY'&& !notStarted ) {
            notStarted=true;
            ShotBall(balla,"leftHigh");
         }
         else if (event.code == 'KeyH' && !notStarted) {
            notStarted=true;
            ShotBall(balla,"leftLow");
         }
         else if (event.code == 'KeyJ' && !notStarted) {
            notStarted=true;
            ShotBall(balla,"centerLow");
         }
      });

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


function tweennala(balla,position,target,target2,pot,rot){
            tween1 = new TWEEN.Tween(position).to(target, pot); //Now update the 3D mesh accordingly 
            tween1.onUpdate(function(){ 
            balla.position.x = position.x; 
            balla.position.y = position.y; 
            balla.position.z = position.z;
            if(rot =="-"){
                balla.rotation.y -=0.05+Math.random()*0.1;  
            }
            else if (rot=="+"){
                balla.rotation.y +=0.05+Math.random()*0.1;  
            }
            else if(rot=="="){
                balla.rotation.z -=0.05+Math.random()*0.1;  
            }
            calculateCollisionPoints(balla,"collision",0);
            if(collisions.length>0){
                detectCollisions();
            }
             if(balla.position.x>=56.5 &&!notStartedSecondTween&&GOAL){
                 notStartedSecondTween=true;
                 tween2 =new TWEEN.Tween(balla.position).to(target2, 1500).onUpdate(()=>{balla.rotation.y +=0.05+Math.random()*0.1;  }).start();
                 target.y=target2.y;
                 target.x=target2.x;
                 
                 tween2.easing(createNoisyEasing(0.1,TWEEN.Easing.Bounce.Out));
                 console.log(balla.rotation);
                 
                 var tween3 = new TWEEN.Tween(balla.rotation).to({},3500).onUpdate(()=>{
                     
                     if((balla.rotation.x).toFixed(2)>0.){
                        balla.rotation.x-=update;
                     }
                     else if((balla.rotation.x).toFixed(2)<0.){
                        balla.rotation.x+=update;
                     }
                     if((balla.rotation.y).toFixed(2)>0.){
                        balla.rotation.y-=update;
                     }
                     else if((balla.rotation.y).toFixed(2)<0.){
                        balla.rotation.y+=update;
                     }
                     if((balla.rotation.z).toFixed(2)>0.){
                        balla.rotation.z-=update;
                     }
                     else if((balla.rotation.z).toFixed(2)<0.){
                        balla.rotation.z+=update;
                     }
                     update=update/2;
                 });
                tween2.chain(tween3);
             }
            }); 
            
           //tween1.easing(createNoisyEasing(0.1,TWEEN.Easing.
               //Back.Out));
            
            tween1.start();
}

function createNoisyEasing(randomProportion, easingFunction) {
    var normalProportion = 1.0 - randomProportion
    return function (k) {
        return 0.9*easingFunction(k)
    }
}
function ShotBall(balla,dir){
    console.log(dir);
    var pot = 1000;
    switch(dir){
        
        case "rightLow":
             var position = { x : 0, y: 1, z:0}; var target = { x : 57, y: 5 ,z:2*20}; 
             var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:20-Math.random()*1.5}; 
             
             tweennala(balla,position,target,target2,pot,"+");
             break;

        case "rightHigh":
             var position = { x : 0, y: 1, z:0}; var target = { x : 57, y: 17 ,z:20}; 
             var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:20-Math.random()*1.5}; 
             
             tweennala(balla,position,target,target2,pot,"+");
             break;
        case "centerLow":
             var position = { x : 0, y: 1, z:0}; var target = { x : 57, y: 5 ,z:0}; 
             var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:-Math.random()*1.5+Math.random()*1.5}; 
             
             tweennala(balla,position,target,target2,pot,"=");
             break;
        case "centerHigh":
             var position = { x : 0, y: 1, z:0}; var target = { x : 57, y: 17 ,z:0}; 
             var target2 = {x:64-Math.random()*2-Math.random()*1.5, y: 1,z:-Math.random()*1.5+Math.random()*1.5};
             
             tweennala(balla,position,target,target2,pot,"=");
             break;
        case "leftHigh":
                var position = { x : 0, y: 1, z:0}; var target = { x : 57, y: 17 ,z:-20}; 
                var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:-20+Math.random()*1.5};
                
                tweennala(balla,position,target,target2,pot,"-");
                break;
        case "leftLow":
                    var position = { x : 0, y: 1, z:0}; var target = { x : 57, y: 5 ,z:-2*20}; 
                    var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:-20+Math.random()*1.5}; 
                    
                    tweennala(balla,position,target,target2,pot,"-");
                    break;
    }
   
}


function animate(time){
    var delta = clock.getDelta(); 
    requestAnimationFrame( animate );


    TWEEN.update(time);

    controls.update();
   for (var g in gif){
       gif[g].update(1000*delta);
   }
	renderer.render( scene, camera );
}


document.onkeypress=function(e){
    if(e.keyCode==115){
        renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
    }
}


