
//import
import * as THREE from '../src/node_modules/three/build/three.module.js'//'https://unpkg.com/three@0.118.3/build/three.module.js';
import { OrbitControls } from '../src/node_modules/three/examples/jsm/controls/OrbitControls.js' // 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';

import { TDSLoader } from '../src/node_modules/three/examples/jsm/loaders/TDSLoader.js';
import {OBJLoader} from '../src/node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from '../src/node_modules/three/examples/jsm/loaders/FBXLoader.js';



import TWEEN from '../src/node_modules/@tweenjs/tween.js/dist/tween.esm.js'

import {streetLamp,audience, multipleAudience,portiere, ball, humanStructure,curveLine} from '../src/Shape/shape.js'
import {changeCanvas} from "../src/Util/Util.js"


var clock = new THREE.Clock();
//Ball and goal var
var errorSwitch=false,errorForShot=false;
var errorProb= 0.35;
var GOAL=false;
var point=0;
var pot={power:1000+500};
var collisions=[];
var attempts=[];
var pressed_key;
var tween1,tween2;
var notStartedSecondTween=false;
var notStarted = false;
var curve
var boxBall = new THREE.Box3();
var boxGoal = new THREE.Box3();
var boxPort= new THREE.Box3();

var port

//Airplane
var aereoStartPosition ={x:110,y:70,z:-200}

var airparts=[];
var aereoGoal;
var tweenplane;
var eli,eliCenter;
//three object
const loader = new THREE.TextureLoader();
var update =0.2;

var canvas2 = document.getElementById('textureCanvas')
var ctx = canvas2.getContext('2d');


var HumanGroup = new TWEEN.Group()

var audienceGroup= new TWEEN.Group() 

var tween,tween3;

var tweenIdleHuman2,tweenIdleHuman1

var tabellone;
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
    
    const planeGeo = new THREE.PlaneBufferGeometry(55,16,32,32);
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

function planeSpecchio(){

    return new THREE.Plane(new THREE.Vector3( 1, 0, 0 ),-9)
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


var matSel=0;
const mats = [new THREE.MeshPhongMaterial({color: 0xFF0000,
        side: THREE.DoubleSide}),new THREE.MeshPhongMaterial({color: 0xFF0000,
            side: THREE.DoubleSide}),new THREE.MeshPhongMaterial({color: 0x0000FF,
                side: THREE.DoubleSide}),]
function loadPlane(){
    var loaderPlane = new OBJLoader();
    loaderPlane.load(
        // resource URL
        '../src/Models/Airplane/p-47-plane-3d.obj',
        // called when resource is loaded
        function ( object ) {
            object.traverse(
                function (child){
                    if (child instanceof THREE.Mesh) {
                     
                //child.material.map =tt;
                child.material =  mats[(matSel++)%3]
                child.material.side = THREE.DoubleSide;
                child.castShadow = true; //default is false
                child.receiveShadow = true; //default       
                
                    }
                }
            )
    
             object.position.set(0,100,-100);
            object.rotateY(90*Math.PI/180)
            //object.rotateZ(90*Math.PI/180)
            object.scale.set(1.5,1.5,1.5);
            var striscia = striscione();
            eli = elica(object);
            
            object.attach(striscia);
            object.attach(eli);
            
           object.position.x = aereoStartPosition.x; 
           object.position.y = aereoStartPosition.y; 
           object.position.z = aereoStartPosition.z;
           
            object.name="Aereo";

            object.traverse(
                function (c){
                    if (c instanceof THREE.Mesh) {
                        c.material.transparent =true;
                        c.material.opacity = .0;
                        airparts.push(c);
                    }
                }
            );
            scene.add(object);
            
            
            
         
        },
        // called when loading is in progresses
        function ( xhr ) {
    
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
            
            console.log( 'An error happened', error );
    
        }
    );


}

function elica(Ob){
    var roundedRectShape = new THREE.Shape();

     function roundedRect( ctx, x, y, width, height, radius ) {

        ctx.moveTo( x, y + radius );
        ctx.lineTo( x, y + height - radius );
        ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
        ctx.lineTo( x + width - radius, y + height );
        ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
        ctx.lineTo( x + width, y + radius );
        ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
        ctx.lineTo( x + radius, y );
        ctx.quadraticCurveTo( x, y, x, y + radius );
        
    } 
    roundedRect( roundedRectShape, 0, 0, 0.8, 3, 0.5 );
    var g=new THREE.ShapeBufferGeometry(roundedRectShape, 2);
    var m = new THREE.MeshPhongMaterial({ color: 0xFFFFFF } );
    var r= new THREE.Mesh(g,m);

    var g1=new THREE.ShapeBufferGeometry(roundedRectShape, 2);
    var r1= new THREE.Mesh(g1,m);

    r.scale.set(1.0,2.0,1.0);
    r1.scale.set(1.0,2.0,1.0);
   
   r1.position.set(-0.75,1.0,0.0);
   r.position.set(-0.75,-7.0,0.0);
    var group = new THREE.Mesh();
    var geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
var material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
var cylinder = new THREE.Mesh( geometry, material );
cylinder.position.set(.0,0.0,0.0);
cylinder.rotateX(90*Math.PI/180);
group.add(r1);group.add(cylinder);group.add(r);
group.position.set(-0.1,100.25,-98.6);
group.scale.set(0.6,0.6,0.6);



    return group;


}

function striscione(){
    const texture = loader.load('../src/texture/goalTex.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    
    const ret = new THREE.PlaneBufferGeometry(35,10);
    const retMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        fog: false,
    });
    const mesh = new THREE.Mesh(ret, retMat);
    mesh.receiveShadow = true;
    mesh.position.set(0,0,-3);
    mesh.rotation.y = Math.PI/2;
    
    var bodymaterial = new THREE.MeshPhongMaterial({ color: 0x8B8381 } );
   
    var cyl2 = new THREE.CylinderBufferGeometry(0.25, 0.25, 4, 4);
    var sustain2= new THREE.Mesh( cyl2, bodymaterial );
    sustain2.position.set(0,0,15.5);
    sustain2.rotateX(90*Math.PI/180);

    var finalStriscione=new THREE.Object3D();
    finalStriscione.add(mesh); finalStriscione.add(sustain2);
    finalStriscione.position.set(0,101.5,-140);
    return finalStriscione;
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
                        tabellone= child
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
            
     
            GOAL=true;
        }
        else{
            if(GOAL)return;
            console.log("MISS");
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
    boxGoal.setFromObject(goal)
    // // var planeGoal=planeSpecchio();
    // planeGoal.applyMatrix4( goal.matrixWorld );
    
    var helperG = new THREE.Box3Helper( boxGoal, 0xD0EF0C );
    scene.add( helperG );

    scene.add(camera);
    fuoriDx=fuoridx();
    fuoriSx=fuorisx();
    fuoriUp=fuoriup();
   
    
    human=humanStructure()
    human.position.x=-15;
    human.rotation.y=Math.PI/2;
    scene.add(human);
    tweenIdleHuman1=new TWEEN.Tween(human.children[4].children[0].children[0].rotation,HumanGroup).to({x: 90*Math.PI/180},3000).repeat(1).yoyo(true).easing(TWEEN.Easing.Bounce.In).onStop(
        (obj) =>{
            obj.x=0
        }
    )
    tweenIdleHuman2=new TWEEN.Tween(human.children[5].children[0].children[0].rotation,HumanGroup).to({x: 90*Math.PI/180},3000).repeat(1).yoyo(true).easing(TWEEN.Easing.Bounce.In).onStop(
        (obj) =>{
            obj.x=0
        }
    )
    tweenIdleHuman1.chain(tweenIdleHuman2)
    tweenIdleHuman2.chain(tweenIdleHuman1)
    tweenIdleHuman1.start()
   
    balla = ball(1,32);
    balla.position.y=1;


    balla.geometry.computeBoundingBox();


    boxBall.copy( balla.geometry.boundingBox ).applyMatrix4( balla.matrixWorld );

    var helper = new THREE.Box3Helper( boxBall, 0xffff00 );
    scene.add( helper );

    scene.add(balla);

     port=portiere();
    port.translateX(planeA/2-10)
    port.translateZ(-20)
    port.rotateY(90*Math.PI/180)

    port.geometry.computeBoundingBox();


    boxPort.copy( port.geometry.boundingBox ).applyMatrix4( port.matrixWorld );
boxPort.max.y+=10
    var helperP = new THREE.Box3Helper( boxPort, 0xffff00 );
    scene.add( helperP );

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


    {
        curve=curveLine(a,b,c);
        scene.add(curve);
        console.log(a)
        console.log(curve)
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
    loadPlane();



{var ad =multipleAudience(6,6,-45,45,0,10,0,10,audienceGroup);
    ad.translateZ(40)
    ad.translateY(5)
  scene.add(ad);}
  {var ad =multipleAudience(6,6,-45,45,0,10,0,10,audienceGroup);
    ad.translateZ(-40)
    ad.translateY(5)
    ad.rotateY(180*Math.PI/180)
  scene.add(ad);}

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
    controls.enableKeys = false

    controls.target=human.position
    
    controls.update();
    console.log(airparts);
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
                 
                  tween3 = new TWEEN.Tween(balla.rotation).to({},3500).onUpdate(()=>{
                     
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
                 }).onComplete(()=>{newShot()});
                 aereoGoal = scene.getObjectByName("Aereo");
                 var startP = aereoGoal.position; var tarP = {z:600};
                 aereoGoal.traverse(
                    function (c){
                        if (c instanceof THREE.Mesh) {
                            c.material.transparent =true;
                            c.material.opacity = 1.0;
                            
                        }
                    }
                );
                 tweenplane = new TWEEN.Tween(startP).to({z:400},7000).onUpdate(()=>{
                     aereoGoal.position.z = startP.z; 
                     eli.rotation.z+=20.
                     if(aereoGoal.position.z>=200){
                        aereoGoal.traverse(
                            function (c){
                                if (c instanceof THREE.Mesh) {
                                    c.material.transparent =true;
                                    c.material.opacity -= 0.05;
                                    
                                }
                            }
                        );
                     }
                 }).onComplete(()=>{
                     aereoGoal.position.set(aereoStartPosition.x,aereoStartPosition.y,aereoStartPosition.z);

                 }).start();
                 
                tween2.chain(tween3);
             }
            }); 
            
           //tween1.easing(createNoisyEasing(0.1,TWEEN.Easing.
               //Back.Out));
               tween1.onComplete(
                   function(){
                   
                    if(goal){
                        point++
                    }
                   //newShot();
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


function animate(time){
    changeCanvas(ctx,canvas2,point)
    if (resizeRendererToDisplaySize(renderer)) {
        // document.getElementById("textureCanvas");
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }


      
    var delta = clock.getDelta(); 
    requestAnimationFrame( animate );
 
    boxBall.copy( balla.geometry.boundingBox ).applyMatrix4( balla.matrixWorld );
    boxPort.copy( port.geometry.boundingBox ).applyMatrix4( port.matrixWorld );
    texturePoint.needsUpdate = true;
    TWEEN.update(time);
    HumanGroup.update(time)
    audienceGroup.update(time)
    controls.update();
    
   for (var g in gif){
       gif[g].update(1000*delta);
   }
	renderer.render( scene, camera );
}


var timeZ=0;
var timeY=2;
var timeX=56;

var endZ=0;
var endY=1;

var a=new THREE.Vector3( 0, 1, 0 );
var b=new THREE.Vector3( 30, 2, 0 );
var c=new THREE.Vector3( 56, 2, 0 );

document.onkeydown=function(e){

    var dir=""
    pressed_key=event.code;
    if(e.keyCode==115){
        renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
    }
    else if (event.code == 'KeyK' && !notStarted) {
  
        dir="rightLow";
    }
    else if (event.code == 'KeyI'&& !notStarted ) {
        dir="rightHigh";
     }
     else if (event.code == 'KeyU' && !notStarted) {
  
        dir="centerHigh";
     }
     else if (event.code == 'KeyY'&& !notStarted ) {

        dir="leftHigh";
     }
     else if (event.code == 'KeyH' && !notStarted) {

        dir="leftLow";
     }
     else if (event.code == 'KeyJ' && !notStarted) {

        dir="centerLow";
     }
     else if (event.code == 'KeyE' && !notStarted) {
            
        errorSwitch=!errorSwitch;
        errorSwitch==true?alert("Robot Can miss"):alert("Robot won't miss ");
        
     }

     if(dir != ""){
    
        powerShot(pressed_key);
        dir=""
     }


     if(event.code== "ArrowLeft"){
        timeZ-=1;
        b.z-=1

     }
     if(event.code== "ArrowRight"){
        timeZ+=1;
        b.z+=1

     }

     if(event.code== "ArrowUp"){
        timeY+=1;
        b.y+=1
     }

     if(event.code== "ArrowDown"){
         if(timeY>=1){
            timeY-=1;
         }

         if(b.y>=1){
            b.y-=1
         }

     }

     if(event.code=="KeyD"){
        endZ+=1;
        timeZ+=0.5;
        c.z+=1
        b.z+=0.5
     }

     if(event.code=="KeyA"){
        endZ-=1;
        timeZ-=0.5;
        c.z-=1
        b.z-=0.5
     }

     if(event.code=="KeyW"){
        endY+=1;
        c.y+=1
        b.y+=0.5
     }

     if(event.code=="KeyS"){
        endY-=1;
        c.y-=1
        b.y-=0.5
     }

     if(event.code== "Enter"){
        powerShot(pressed_key);
        timeX+=1;
        b.x+=0.5;
        c.x+=1;
     }

     var curveg = new THREE.QuadraticBezierCurve3(
        a,b,c
           );
           
           var points = curveg.getPoints( 50 );
           var geometry = new THREE.BufferGeometry().setFromPoints( points );
curve.geometry=geometry
console.log(timeX)
}







function powerShot(){
            document.getElementById("power").value+=0.5;
            if(pot.power>500) pot.power-=50;
}





document.onkeyup=function(e){

    var dir=""
        if(e.code== "Enter" && !notStarted){
            console.log("spara")

            notStarted=true
                runAndKick("");


         }

    

         if(e.keyCode==115){
            renderer.shadowMap.enabled = !renderer.shadowMap.enabled;
        }
        else if (event.code == 'KeyK' && !notStarted) {
            notStarted=true
            dir="rightLow";
            runAndKick(dir);
        }
        else if (event.code == 'KeyI'&& !notStarted ) {
            notStarted=true
            dir="rightHigh";
            runAndKick(dir);
         }
         else if (event.code == 'KeyU' && !notStarted) {
            notStarted=true
            dir="centerHigh";
            runAndKick(dir);
         }
         else if (event.code == 'KeyY'&& !notStarted ) {
            notStarted=true
            dir="leftHigh";
            runAndKick(dir);
         }
         else if (event.code == 'KeyH' && !notStarted) {
            notStarted=true
            dir="leftLow";
            runAndKick(dir);
         }
         else if (event.code == 'KeyJ' && !notStarted) {
            notStarted=true
            dir="centerLow";
            runAndKick(dir);
         }
}

    
function runAndKick(dir=""){
    tweenIdleHuman1.stop()
    tweenIdleHuman2.stop()
   
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
    var runback=new TWEEN.Tween(human.children[4].rotation,HumanGroup).to({x: -90*Math.PI/180},time/2).repeat(3).yoyo(true).onRepeat((obj)=>{runback1.start()}).onStart(()=>{runback1_2.start(); tweenBodyN.start()}).onComplete(()=>{
        tweenIdleHuman1.start();

    })

   
        
    
    
    tweenLowerLeg1.chain(tweenkick)
    tweenkick.chain(runback)


    tweenArm1.chain(tweenArm1_1);
    tweenArm2.chain(tweenArm2_1);


    tweenArm1.start()
    tweenArm2.start()
    tweenLowerLeg2.start()
        if(dir!=""){
            var t=ShotBall(balla,dir);
            tweenLowerLeg2.chain(t)
        }
    else{
        var t=spara(balla)
        tweenLowerLeg2.chain(t)
    }
    
}





function tweenAereo(){
    aereoGoal = scene.getObjectByName("Aereo");
    var startP = aereoGoal.position; var tarP = {z:600};
    aereoGoal.traverse(
       function (c){
           if (c instanceof THREE.Mesh) {
               c.material.transparent =true;
               c.material.opacity = 1.0;
               
           }
       }
   );
    var tweenplane = new TWEEN.Tween(startP).to({z:400},7000).onUpdate((obj)=>{
        controls.target=obj;
        aereoGoal.position.z = startP.z; 
        eli.rotation.z+=20.
        if(aereoGoal.position.z>=200){
           aereoGoal.traverse(
               function (c){
                   if (c instanceof THREE.Mesh) {
                       c.material.transparent =true;
                       c.material.opacity -= 0.05;
                       
                   }
               }
           );
        }
    }).onComplete(()=>{
        controls.target=human.position;
        aereoGoal.position.set(aereoStartPosition.x,aereoStartPosition.y,aereoStartPosition.z);

    }).start();
    return tweenplane
}

var goalX,goalY,goalZ,goalRotation;
function spara(balla){
    console.log(timeZ)
    goalX = new TWEEN.Tween(balla.position).to({x:[0,b.x,c.x]},1000).onStart(
        () =>{
            goalY= new TWEEN.Tween(balla.position).to({y:[1,b.y,c.y]},1000).interpolation(TWEEN.Interpolation.Bezier).start()
            goalZ= new TWEEN.Tween(balla.position).to({z:[0,b.z,c.z]},1000).interpolation(TWEEN.Interpolation.Bezier).start()
            goalRotation= new TWEEN.Tween(balla.rotation).to({x: "+"+timeX/2,y:"+"+timeY/2},1000).repeat(10).start()
        }
    ).interpolation(TWEEN.Interpolation.Bezier)
    .onComplete(
        () => {
            console.log("not enogh")
            point=0;
            goalX.stop()
            goalZ.stop()
            goalY.stop()
            goalRotation.stop()
            new TWEEN.Tween({x:10, camera: controls}).to({x:100},3000).onStart((obj)=>{
                obj.camera.target=tabellone.position;
                //camera.position.set(tabellone.position.x,30,-20);
            
                point="NOOOOOOOOOO!!!!!!!"
            }).onComplete((obj)=>{
                obj.camera.target=human.position;
                point=0
            }).start()
            newShot()
        }
    ).onUpdate(
        (obj)=>{
            var goal=0
            if(boxBall.intersectsBox(boxGoal)){
                console.log("Goal")
                goal=1
            }
             if(boxBall.intersectsBox(boxPort)){
                console.log("No Goal")
                goal=2
            }
             if(obj.x>60 && goal==0){
                console.log("out")
                point=0;
                goalX.stop()
                goalZ.stop()
                goalY.stop()
                goalRotation.stop()
                new TWEEN.Tween({x:10, camera: controls}).to({x:100},3000).onStart((obj)=>{
                    obj.camera.target=tabellone.position;
                    //camera.position.set(tabellone.position.x,30,-20);
                
                    point="OUUUUTTT!!!!!"
                }).onComplete((obj)=>{
                    obj.camera.target=human.position;
                    point=0
                }).start()
                new TWEEN.Tween(balla.position).to({x:"-10"},1000).start()
                new TWEEN.Tween(balla.position).to({y:"-"+(balla.position.y-1)},2000).onComplete(()=>{
                    newShot()
                }).easing(TWEEN.Easing.Bounce.Out).start()
            }

            if (goal==1){
                point++;
                goalX.stop()
                goalZ.stop()
                goalY.stop()
                goalRotation.stop()
                tweenAereo().start();
                new TWEEN.Tween(balla.position).to({x:"+7"},1000).start()
                new TWEEN.Tween(balla.position).to({y:"-"+(balla.position.y-1)},2000).onComplete(()=>{
                    newShot()
                }).easing(TWEEN.Easing.Bounce.Out).start()

            }

            if (goal == 2){
                point=0;
                goalX.stop()
                goalZ.stop()
                goalY.stop()
                goalRotation.stop()
                new TWEEN.Tween({x:10, camera: controls}).to({x:100},3000).onStart((obj)=>{
                    obj.camera.target=tabellone.position;
                    //camera.position.set(tabellone.position.x,30,-20);
                
                    point="PARATA!!!!!!!"
                }).onComplete((obj)=>{
                    obj.camera.target=human.position;
                    point=0
                }).start()
                new TWEEN.Tween(balla.position).to({x:"-10"},1000).start()
                new TWEEN.Tween(balla.position).to({y:"-"+(balla.position.y-1)},2000).onComplete(()=>{
                    newShot()
                }).easing(TWEEN.Easing.Bounce.Out).start()
            }

            
            }

    )
    return goalX;
}

function newShot(){
    notStartedSecondTween=false;
    GOAL=false;
    notStarted=false;
    balla.position.set(0,1,0);
    document.getElementById("power").value=0.0;
    pot={power:1000+500};
    timeX=50;
    timeY=1;
    timeZ=0;
    b.x=25;
    b.y=1;
    b.z=0;
    c.x=50;
    c.y=1;
    c.z=0;
    var curveg = new THREE.QuadraticBezierCurve3(
        a,b,c
           );
           
           var points = curveg.getPoints( 50 );
           var geometry = new THREE.BufferGeometry().setFromPoints( points );
curve.geometry=geometry
}


