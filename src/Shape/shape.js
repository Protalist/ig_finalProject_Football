
import * as THREE from '../node_modules/three/build/three.module.js'
import TWEEN from '../node_modules/@tweenjs/tween.js/dist/tween.esm.js'

import {getRndInteger} from "../Util/Util.js"

//dimension of the pivot
const radius = 0.5;
const widthSegments = 6;
const heightSegments = 6;

//dimension of the torso
const bodyWidth=3;
const bodyHeight=5.5;
const bodyDepth=1.5;


var roller_wheel=[];

export function humanStructure(){
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

export function streetLamp(){
var bodymaterial = new THREE.MeshPhongMaterial({ color: 0x8B8381 } );
var geometry=new THREE.BoxGeometry( 1, 1, 4 );
var GeometryLamp = new THREE.CylinderBufferGeometry(0.5, 0.5, 40, 10);

var pole= new THREE.Mesh( GeometryLamp, bodymaterial );
pole.position.set(0,40/2,0)

var pole2= new THREE.Mesh(geometry,bodymaterial);
pole2.position.set(0.0,40.0,0.5);

var sLight=new THREE.SpotLight(0xFFFFFF,0.3)
sLight.position.set(0.0,40.0,1.0)
sLight.angle=35*Math.PI/180
sLight.target.position.set(0.0,0.0,15.0)
sLight.castShadow = false;

sLight.shadow.camera.left = 50;  
sLight.shadow.camera.right = -50;  
sLight.shadow.camera.top=30;
sLight.shadow.camera.bottom=-30;

var street = new THREE.Group();

street.add(pole);
street.add(pole2);
street.add(sLight);
street.add(sLight.target)

console.log("ciao")
return street;
}

export function people(len, ani){

const loader = new THREE.TextureLoader();
var ttxt=loader.load('../src/texture/stadium.png');
ttxt.flipY=true
ttxt.rotation=90*Math.PI/180
 ani.push( new TextureAnimator( ttxt, 23, 1, 23, 75 ));
var  generalM = new THREE.MeshBasicMaterial({ color: 0x8B8381,
map: ttxt } );

var  generalM2 = new THREE.MeshBasicMaterial({ color: 0x8B8381} );
var geometry = new THREE.CylinderBufferGeometry(10, 10, len, 3);

var spalto1= new THREE.Mesh(geometry, [generalM,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2]);
spalto1.position.set(len/2+10,5,0)
spalto1.rotateX(-90*Math.PI/180)

var spalto2= new THREE.Mesh(geometry, [generalM,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2]);
spalto2.position.set(-(len/2+10),5,0)
spalto2.rotateX(-90*Math.PI/180)

var spalto3= new THREE.Mesh(geometry, [generalM,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2]);
spalto3.position.set(0,5,-(len/2+10))
spalto3.rotateX(-90*Math.PI/180)
spalto3.rotateZ(-90*Math.PI/180)

var spalto4= new THREE.Mesh(geometry, [generalM,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2,generalM2]);
spalto4.position.set(0,5,(len/2+10))
spalto4.rotateX(-90*Math.PI/180)
spalto4.rotateZ(-270*Math.PI/180)


var spalto = new THREE.Group();
//spalto.add(spalto1)
spalto.add(spalto2)
spalto.add(spalto3)
spalto.add(spalto4)
return spalto;
}





export function portiere(){
var shape = new THREE.Shape();

var x = 3;
var y = 0;
var heigh=9;
var radius=3;
var radius2=2;


shape.arc(0,heigh,radius,0,180*Math.PI/180,false)

shape.moveTo(x,y);
shape.lineTo(x,y+heigh);


shape.lineTo(-x,y+heigh);
shape.lineTo(-x,y);
shape.lineTo(x,y)



var port = new THREE.Group();
port.name="PORTIERE"
var shape2= new THREE.Shape();

shape2.moveTo(0,heigh+radius+radius2/2)
shape2.arc(0,0,radius2,0,360*Math.PI/180,false);


const curveSegments =  6;  
var extrudeSettings = {
    steps: 2,  
  
    depth:  1.5,  
  
    bevelEnabled: false,  
    bevelThickness: 0.65,  
  
    bevelSize: 0.80,  
  
    bevelSegments: 2,  
  
  };
  var extrudeSettings2 = {
    steps: 2,  
  
    depth:  1,  
  
    bevelEnabled: false,  
    bevelThickness: 0.65,  
  
    bevelSize: 0.80,  
  
    bevelSegments: 2,  
  
  };
var g=new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
var m = new THREE.MeshPhongMaterial({ color: 0x8B8381 ,side: THREE.DoubleSide} );

var g2=new THREE.ExtrudeBufferGeometry(shape2, extrudeSettings2);


  
var r= new THREE.Mesh(g,m);

r.name="Portiere"
r.add(new THREE.Mesh(g2,m))
port.add(r)
return r;
}


export function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
// note: texture passed by reference, will be updated by the update function.
    
this.tilesHorizontal = tilesHoriz;
this.tilesVertical = tilesVert;
// how many images does this spritesheet contain?
//  usually equals tilesHoriz * tilesVert, but not necessarily,
//  if there at blank tiles at the bottom of the spritesheet. 
this.numberOfTiles = numTiles;
texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

// how long should each image be displayed?
this.tileDisplayDuration = tileDispDuration;

// how long has the current image been displayed?
this.currentDisplayTime = 0;

// which image is currently being displayed?
this.currentTile = 0;
    
this.update = function( milliSec )
{
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration)
    {
        this.currentDisplayTime -= this.tileDisplayDuration;
        this.currentTile++;
        if (this.currentTile == this.numberOfTiles)
            this.currentTile = 0;
        var currentColumn = this.currentTile % this.tilesHorizontal;
        texture.offset.x = currentColumn / this.tilesHorizontal;
        var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
        texture.offset.y = currentRow / this.tilesVertical;
    }
};
}

export function ball(radius,howgooditlooks){
const geometry = new THREE.SphereGeometry(radius,howgooditlooks,howgooditlooks);
const material = new THREE.MeshPhongMaterial();
const mesh = new THREE.Mesh(geometry, material);
material.map = new THREE.TextureLoader().load('../src/texture/ballTex.jpg');
mesh.castShadow=true
mesh.name="palla"
return mesh;

}


export function audience(color=0xffffff){



    var loader = new THREE.TextureLoader();
    var ttxt=loader.load('../src/texture/audience_sprite.png');

    var obj={map: ttxt,
        color: color }

    var spriteMaterial = new THREE.SpriteMaterial( obj );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(5,5,5)
    return sprite
}






export function multipleAudience(N,M,xMin,xMax,yMin,yMax,zMin,zMax,t){
    var loader1 = new THREE.TextureLoader();
    var ttxt1=loader1.load('../src/texture/audience_sprite.png');

    var X=xMax-xMin;
    var Y=yMax-yMin;
    var Z=zMax-zMin;
    var xStep=X/M;
    var yStep=Y/N;
    var zStep=Z/N;




    var groupPeople=new THREE.Group();

    var person;



    var colors=[
        new THREE.SpriteMaterial(  {map: ttxt1,color: 0xD0EF0C }),
        new THREE.SpriteMaterial( {map: ttxt1,color: 0x0CEF7A }),
        new THREE.SpriteMaterial( {map: ttxt1,color: 0xE50CEF }),
        new THREE.SpriteMaterial( {map: ttxt1, color: 0x0CD3EF })
    ]
    

    //var spriteMaterial = new THREE.SpriteMaterial( obj );

    for(var j=0; j<M;j++){
        var x=xMin+j*xStep;
        for (var i=0;i<N;i++){
            var m=Math.random() < 0.5 ? -1 : 1

            var m2=m* Math.random()
            //spriteMaterial.color.set(0xffffff*Math.random())
  
            person=new THREE.Sprite( colors[getRndInteger(0,4)]);

            person.position.set(x+m2,yMin+i*yStep, zMin+i*zStep)
            person.scale.set(5,5,5)
            groupPeople.add(person)
            var tween= new TWEEN.Tween(person.position,t).to({y: "+1"},1000).delay(Math.random()*1000).repeat(Infinity).yoyo(true).start()
        }
    }
    return groupPeople;
}



export function curveLine(a,b,c){
    var curve = new THREE.QuadraticBezierCurve3(
 a,b,c
    );
    
    var points = curve.getPoints( 50 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    
    // Create the final object to add to the scene
    var curveObject = new THREE.Line( geometry, material );

    return curveObject;
}

export function light(a,b,c){
    var color = 0xFFFFFF;
    var intensity = 1.1;
    var light = new THREE.DirectionalLight(color, intensity);
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
    return light;
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