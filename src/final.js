
//import
import * as THREE from '../src/node_modules/three/build/three.module.js'//'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from '../src/node_modules/three/examples/jsm/controls/OrbitControls.js' // 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';

import { TDSLoader } from '../src/node_modules/three/examples/jsm/loaders/TDSLoader.js';

import { FBXLoader } from '../src/node_modules/three/examples/jsm/loaders/FBXLoader.js';



import TWEEN from '../src/node_modules/@tweenjs/tween.js/dist/tween.esm.js'

import {streetLamp,people, portiere, ball, humanStructure,TextureAnimator} from '../src/Shape/shape.js'
import {changeCanvas} from "../src/Util/Util.js"
var clock = new THREE.Clock();

var errorSwitch=false,errorForShot=false;
var errorProb= 0.35;
var GOAL=false;
var point=0;
var pot={power:1000+500};

var attempts=[];
var pressed_key;

//trhee object
const loader = new THREE.TextureLoader();
var update =0.2;

var canvas2 = document.getElementById('textureCanvas')
var ctx = canvas2.getContext('2d');



var collisions=[];
//main object in the scene
var renderer;
var scene,Bscene;
var bgMesh;
var balla,goal,fuoriDx,fuoriSx,fuoriUp;
var camera;
var human;
var light_a=[];
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
    light.shadow.camera.bottom=-30;
    light.shadow.mapSize.width = 300;  // default
    light.shadow.mapSize.height = 300; // default
    light.shadow.camera.near = -50.5;    // default
    light.shadow.camera.far = 50;     // default
    light.shadow.camera.left = 50;  
    light.shadow.camera.right = -50;  
    scene.add(light);
    light_a.push(light)
//     var helper = new THREE.CameraHelper( light.shadow.camera );
//    scene.add( helper );

    
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





function loadModel(){
    var loader3 = new TDSLoader();
    var r=loader3.load( '../src/Models/p/Gate.3ds', function ( object ) {

        console.log(object)
        // apply texture
        object.traverse(
            function (child){
                if (child instanceof THREE.Mesh) {
                    var tt= loader.load('../src/Models/p/texture.jpg')
                    tt.wrapS = THREE.RepeatWrapping;
                    tt.wrapT = THREE.RepeatWrapping;
            child.material.map =tt;
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

    } );
    
}

var texturePoint= new THREE.Texture(canvas2);
function loadModel2(){
    var loader3 = new FBXLoader();
    var sp=["Line007","Line008",
            "Line018","Line019","Line015","Line017",
            "Line023","Line025","Line026","Line027",
            "Line021","Line022",
            ]

    const loader = new THREE.TextureLoader();
    var ttxt=loader.load('../src/texture/stadium.png');
    
    ttxt.rotation=90*Math.PI/180
    ttxt.wrapS = THREE.RepeatWrapping;
    ttxt.wrapT = THREE.RepeatWrapping;

    ttxt.repeat.set(0.5, 1);
     //gif.push( new TextureAnimator( ttxt, 23, 1, 23, 75 ));
     var  generalM = new THREE.MeshPhongMaterial({ color: 0x1961BD,
        } );
    var r=loader3.load( '../src/Models/statuim/stadium1.FBX', function ( object ) {
        // object.rotateX(90*Math.PI/180)
        //  object.rotateY(-90*Math.PI/180)
        // object.position.set(-planeA/2,0,0);
        console.log(object)
        // apply texture
        object.traverse(
            function (child){
                if (child.name == "004" || child.name == "005" ){
                    console.log(child)
                    child.visible =false
                }

                if (child instanceof THREE.Mesh) {
                    if (child.name=="Box001"){
                        var tt= loader.load('../src/texture/erba.jpg')
                        tt.wrapS = THREE.RepeatWrapping;
                        tt.wrapT = THREE.RepeatWrapping;
                        tt.repeat.x=3
                        tt.repeat.y=3
                        child.material.map =tt;
                    }

                    if(sp.includes(child.name)){
                        
                        child.material=generalM;
                    }

                    if(child.name=="Box016"){
                        
                        child.material.map=texturePoint;
                    }
            child.material.needsUpdate = true;
             child.material.side = THREE.DoubleSide;
            child.castShadow = true; //default is false
            child.receiveShadow = true; //default
                }
            }
        )

        //  object.position.set(planeA/2-2,10,0);
         object.rotateZ(-90*Math.PI/180)
        // object.rotateZ(-180*Math.PI/180)
        object.scale.set(0.5,0.5,0.5)

        scene.add( object );
        


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
            
            if(!GOAL)point++;
            GOAL=true;
        }
        else{
            if(GOAL)return;
            console.log("MISS");
            point=0
            tween1.stop();
            var pos = {x:collisions[0].xMax-0.5,y:collisions[0].yMax-0.5,z:collisions[0].zMax-0.5};
            var tar = {x:pos.x - (5+Math.random()*10),y:1,z:pos.z-Math.random()*2.5+Math.random()*2.5};
            
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

  return GOAL;
}



window.onload= function(){
    
// b <3 g :)
    scene = new THREE.Scene();
    //scene.fog=new THREE.Fog( 'skyblue' , 1, 2);
    background()
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(-60,30,-13)
    scene.background = new THREE.Color( 'skyblue' );

    //var helper = new THREE.CameraHelper( camera );
   // scene.add( helper );
    
    light(-2, 4, -8);

    plane(planeA,planeB);
    fondoCampo();
    goal = specchio();
    
    scene.add(camera);
    fuoriDx=fuoridx();
    fuoriSx=fuorisx();
    fuoriUp=fuoriup();
   
    
    human=humanStructure()
    human.position.x=-15;
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


    
    
     tween= new TWEEN.Tween(port.position).to({z:"+40"},3000).repeat(Infinity).yoyo(true).onUpdate(()=>{
        calculateCollisionPoints(port,"collision",2);
     }).start()
    

var d=-1
for(var i=0;i<3;i++){
    var sre=streetLamp()
    sre.position.set(d*(planeA/2-10),15,planeA/2-7)
    sre.rotateY(180*Math.PI/180)

    // var helper = new THREE.CameraHelper( sre.children[2].shadow.camera );
    // scene.add( helper );
    scene.add(sre)

    var sre2=streetLamp()
    sre2.position.set(d*(planeA/2-10),15,-planeA/2)
    sre2.rotateY(0*Math.PI/180)
    // var helper = new THREE.CameraHelper( sre2.children[2].shadow.camera );
    // scene.add( helper );
    scene.add(sre2)
    d++
}
    // var spalto=people(planeA,gif)
    // scene.add(spalto)
    loadModel();
    loadModel2();



  
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

    controls.keys = {
        LEFT: 65, //a
        UP: 87, // w
        RIGHT: 68, // d 
        BOTTOM: 83 // s 
    }

    controls.target=human.position

    controls.update();

    animate(0.00);
 
}


function tweennala(balla,position,target,target2,pot,rot){
            var goal=false
            tween1 = new TWEEN.Tween(position).to(target, pot.power); //Now update the 3D mesh accordingly 
            tween1.onUpdate(function(){ 
                console.log(pot.power);
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
                if(detectCollisions()){
                    goal=true
                }
            }
             if(balla.position.x>=56.5 &&!notStartedSecondTween&&GOAL){
                 notStartedSecondTween=true;
                 tween2 =new TWEEN.Tween(balla.position).to(target2, 1500).onUpdate(()=>{
                     balla.rotation.y +=0.05+Math.random()*0.1;  
                    if(balla.position.z>28.5){
                        balla.position.z=28.5;
                    } 
                    else if  (balla.position.z<-28.5){
                        balla.position.z=-28.5;
                    }
                }).start();
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
               tween1.onComplete(
                   function(){
                    notStarted=false;
                    console.log(goal)
                   }
               )
            return tween1
}

function createNoisyEasing(randomProportion, easingFunction) {
    var normalProportion = 1.0 - randomProportion
    return function (k) {
        return 0.9*easingFunction(k)
    }
}

function randomSign(){
    return Math.random()>=0.5?-1:1;
}

function mapPowerError(){
    var r=0;
    for(var i=1500;i>=500;i-=100){
        r+=0.05;
        if(i==pot.power)break;
    }
    return r;
}
function ShotBall(balla,dir){
    console.log(pot.power);
    if(errorSwitch){
       if(Math.random()<(errorProb+mapPowerError())){
            errorForShot=true;
            console.log("Not So precise");
        }
   }
    
    var t;
    switch(dir){
        
        case "rightLow":
             var target,finalZ = Math.random()*2*20;;
             var position = { x : 0, y: 1, z:0}; errorForShot==true?  target = { x : 57, y: 5+Math.random()*1.5 ,z:finalZ}:(target={ x : 57, y: 5 ,z:20},finalZ=20); 
             
             var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:finalZ-Math.random()*1.5}; 
             
             t=tweennala(balla,position,target,target2,pot,"+");
             break;

        case "rightHigh":
            var target, finalZ = Math.random()*2*20;
             var position = { x : 0, y: 1, z:0}; errorForShot==true? target = { x : 57, y: 17+randomSign()*Math.random()*2.5 ,z:finalZ}:(target = { x : 57, y: 17 ,z:20},finalZ=20);
             var target2 = { x:64-Math.random()*2, y: 1,z:finalZ-Math.random()*1.5}; 
             
             t=tweennala(balla,position,target,target2,pot,"+");
             break;
        case "centerLow":
            var target,finalZ=randomSign()*Math.random()*1.5*3;
             var position = { x : 0, y: 1, z:0}; errorForShot==true? target = { x : 57, y: 5+Math.random()*2.5 ,z:finalZ}:(target = { x : 57, y: 5 ,z:0},finalZ=0);
             var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:finalZ-Math.random()*1.5+Math.random()*1.5}; 
             
             t=tweennala(balla,position,target,target2,pot,"=");
             break;
        case "centerHigh":
            var target,finalZ=randomSign()*Math.random()*1.5*3;
            var position = { x : 0, y: 1, z:0}; errorForShot==true? target = { x : 57, y: 17+randomSign()*Math.random()*2.5 ,z:finalZ}:(target = { x : 57, y: 17 ,z:0},finalZ=0);
             var target2 = {x:64-Math.random()*2-Math.random()*1.5, y: 1,z:finalZ-Math.random()*1.5+Math.random()*1.5};
             
             t=tweennala(balla,position,target,target2,pot,"=");
             break;
        case "leftHigh":
            var target,finalZ=-(Math.random()*2*20)
            var position = { x : 0, y: 1, z:0}; errorForShot==true? target = { x : 57, y: 17+randomSign()*Math.random()*2.5 ,z:finalZ}:(target = { x : 57, y: 17 ,z:-20},finalZ=-20);
            var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:finalZ+Math.random()*1.5};
                
                t=tweennala(balla,position,target,target2,pot,"-");
                break;
        case "leftLow":
            var target,finalZ=-(Math.random()*2*20)
            var position = { x : 0, y: 1, z:0}; errorForShot==true? target = { x : 57, y: 5+Math.random()*2 ,z:finalZ}:(target = { x : 57, y: 5 ,z:-20},finalZ=-20);
            var target2 = { x:64-Math.random()*2-Math.random()*1.5, y: 1,z:finalZ+Math.random()*1.5}; 
                    

                    t=tweennala(balla,position,target,target2,pot,"-");
                    break;
    }
    errorForShot=false;
   return t;

}


function animate(time){
    changeCanvas(ctx,canvas2,point)
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }


      
    var delta = clock.getDelta(); 
    requestAnimationFrame( animate );
 

    texturePoint.needsUpdate = true;
    TWEEN.update(time);
    HumanGroup.update(time)
    controls.update();
   for (var g in gif){
       gif[g].update(1000*delta);
   }
	renderer.render( scene, camera );
}

var kciking=false;

var d = new Date();

var timeZ=0;
var timeY=0;
var timeX=0;

document.onkeydown=function(e){

    var dir=""
    pressed_key=event.code;
    if(e.keyCode==115){
        renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
    }
    else if (event.code == 'KeyK' && !notStarted) {
        notStarted=true;
        dir="rightLow";
    }
    else if (event.code == 'KeyI'&& !notStarted ) {
        notStarted=true;
        dir="rightHigh";
     }
     else if (event.code == 'KeyU' && !notStarted) {
        notStarted=true;
        dir="centerHigh";
     }
     else if (event.code == 'KeyY'&& !notStarted ) {
        notStarted=true;
        dir="leftHigh";
     }
     else if (event.code == 'KeyH' && !notStarted) {
        notStarted=true;
        dir="leftLow";
     }
     else if (event.code == 'KeyJ' && !notStarted) {
        notStarted=true;
        dir="centerLow";
     }
     else if (event.code == 'KeyE' && !notStarted) {
            
        errorSwitch=!errorSwitch;
        errorSwitch==true?alert("Robot Can miss"):alert("Robot won't miss ");
        
     }

     if(dir != "" && !kciking){
        kciking=true
        runAndKick(dir);
        powerShot(pressed_key);
        dir=""
     }


     if(event.code== "ArrowLeft"){
        timeZ-=1;
     }
     if(event.code== "ArrowRight"){
        timeZ+=1;
     }

     if(event.code== "ArrowUp"){
        timeY+=1;
     }

     if(event.code== "ArrowDown"){
         if(timeY>=0){
            timeY-=1;
         }

     }


     if(event.code== "Enter"){
        timeX+=1;
     }
console.log(timeX)
}




function powerShot(pressedKey){
    var stop=false;
    
    window.setInterval(()=>{
        if(!stop){
            document.onkeyup=(a)=>{
                
                
                if(a.code==pressedKey){
                    stop=true;
                }
            };
            document.getElementById("power").value+=0.5;
            if(pot.power>500)pot.power-=50;
            
            
        }
    },75/2)
    
 
    
}

function runAndKick(dir=""){
    var time=3000/4;
    var first=true;
    var tweenBody= new TWEEN.Tween(human.position,HumanGroup).to({x:"+3.4"},time).repeat(3).yoyo(false).start()
    var tweenLowerLeg1= new TWEEN.Tween(human.children[4].rotation,HumanGroup).to({x: [-45*Math.PI/180,45*Math.PI/180]},time).repeat(3).yoyo(true).start()
    var tweenLowerLeg2= new TWEEN.Tween(human.children[5].rotation,HumanGroup).to({x:  [45*Math.PI/180,-45*Math.PI/180]},time).repeat(3).yoyo(true)
    var tweenLowerLeg1_2= new TWEEN.Tween(human.children[4].children[0].children[0].rotation,HumanGroup).to({x: [45*Math.PI/180,0]},time).repeat(3).yoyo(true).start()
    var tweenLowerLeg2_2= new TWEEN.Tween(human.children[5].children[0].children[0].rotation,HumanGroup).to({x: [0*Math.PI/180,45*Math.PI/180]},time).repeat(3).yoyo(true).start()
    var tweenkick=new TWEEN.Tween(human.children[5].rotation,HumanGroup).to({x: [-90*Math.PI/180]},time/2).repeat(1).yoyo(true)
 
    
    var tweenArm1= new TWEEN.Tween(human.children[2].rotation,HumanGroup).to({x: [-45*Math.PI/180,45*Math.PI/180]},time).repeat(3).yoyo(true)
    var tweenArm2= new TWEEN.Tween(human.children[3].rotation,HumanGroup).to({x: [45*Math.PI/180,-45*Math.PI/180]},time).repeat(3).yoyo(true)
    var tweenArm1_1= new TWEEN.Tween(human.children[2].rotation,HumanGroup).to({x: [-45*Math.PI/180]},time/2).repeat(1).yoyo(true)
    var tweenArm2_1= new TWEEN.Tween(human.children[3].rotation,HumanGroup).to({x: [45*Math.PI/180]},time/2).repeat(1).yoyo(true)
    
    var tweenBodyN= new TWEEN.Tween(human.position,HumanGroup).to({x:"-3.4"},time/2).repeat(3).yoyo(false)
    var runback1_2= new TWEEN.Tween(human.children[4].children[0].children[0].rotation,HumanGroup).to({x: 90*Math.PI/180},time/2).repeat(3).yoyo(true)
    var runback_2= new TWEEN.Tween(human.children[5].children[0].children[0].rotation,HumanGroup).to({x: 90*Math.PI/180},time/2).repeat(1).yoyo(true)
    var runback1=new TWEEN.Tween(human.children[5].rotation,HumanGroup).to({x: -90*Math.PI/180},time/2).repeat(1).yoyo(true).onStart(()=>{runback_2.start()}).onRepeat(()=>{runback_2.start()})
    var runback=new TWEEN.Tween(human.children[4].rotation,HumanGroup).to({x: -90*Math.PI/180},time/2).repeat(3).yoyo(true).onRepeat((obj)=>{runback1.start()}).onStart(()=>{runback1_2.start(); tweenBodyN.start()}).onComplete(()=>{kciking=false})

   
        
    
    
    tweenLowerLeg1.chain(tweenkick)
    tweenkick.chain(runback)


    tweenArm1.chain(tweenArm1_1);
    tweenArm2.chain(tweenArm2_1);


    tweenArm1.start()
    tweenArm2.start()
    tweenLowerLeg2.start()
    setTimeout(()=>{
        if(dir!=""){
            var t=ShotBall(balla,dir);
            tweenLowerLeg2.chain(t)
        }
    },740);
    
}

var HumanGroup = new TWEEN.Group()






function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }