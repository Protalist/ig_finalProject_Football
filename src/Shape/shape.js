
import * as THREE from '../node_modules/three/build/three.module.js'

export function streetLamp(){
    var bodymaterial = new THREE.MeshPhongMaterial({ color: 0x8B8381 } );
    var geometry=new THREE.BoxGeometry( 1, 1, 2 );
    var GeometryLamp = new THREE.CylinderBufferGeometry(0.5, 0.5, 30, 10);
   
    var pole= new THREE.Mesh( GeometryLamp, bodymaterial );
    pole.position.set(0,30/2,0)
   
    var pole2= new THREE.Mesh(geometry,bodymaterial);
    pole2.position.set(0.0,30.0,0.5);

    var sLight=new THREE.SpotLight(0xFFFFFF,0.3)
    sLight.position.set(0.0,30.0,1.0)
    sLight.angle=35*Math.PI/180
    sLight.target.position.set(0.0,0.0,12.0)
    sLight.castShadow = true;
    var street = new THREE.Group();

    street.add(pole);
    street.add(pole2);
    street.add(sLight);
    street.add(sLight.target)
 
    console.log("ciao")
    return street;
}

export function people(len){

    const loader = new THREE.TextureLoader();
    var ttxt=loader.load('../src/texture/stadium.gif');
    var  generalM = new THREE.MeshPhongMaterial({ color: 0x8B8381,
    map: ttxt } );
    var geometry = new THREE.CylinderBufferGeometry(10, 10, len, 3);
    
    var spalto1= new THREE.Mesh(geometry, generalM);
    spalto1.position.set(len/2+10,5,0)
    spalto1.rotateX(-90*Math.PI/180)

    var spalto2= new THREE.Mesh(geometry, generalM);
    spalto2.position.set(-(len/2+10),5,0)
    spalto2.rotateX(-90*Math.PI/180)

    var spalto3= new THREE.Mesh(geometry, generalM);
    spalto3.position.set(0,5,-(len/2+10))
    spalto3.rotateX(-90*Math.PI/180)
    spalto3.rotateZ(-90*Math.PI/180)

    var spalto4= new THREE.Mesh(geometry, generalM);
    spalto4.position.set(0,5,(len/2+10))
    spalto4.rotateX(-90*Math.PI/180)
    spalto4.rotateZ(-90*Math.PI/180)


    var spalto = new THREE.Group();
    spalto.add(spalto1)
    spalto.add(spalto2)
    spalto.add(spalto3)
    spalto.add(spalto4)
    return spalto;
}





export function portiere(){
    var shape = new THREE.Shape();

var x = 3;
var y = 0;
var heigh=5;
var radius=3;
var radius2=1;
// shape.moveTo(x + 2.5, y + 2.5);
// shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
// shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
// shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
// shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
// shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
// shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

shape.arc(0,heigh,radius,0,180*Math.PI/180,false)

shape.moveTo(x,y);
shape.lineTo(x,y+heigh);


shape.lineTo(-x,y+heigh);
shape.lineTo(-x,y);
shape.lineTo(x,y)



var shape2= new THREE.Shape();

shape2.moveTo(0,heigh+radius+radius2/2)
shape2.arc(0,0,radius2,0,360*Math.PI/180,false);


const curveSegments =  6;  
var g=new THREE.ShapeBufferGeometry(shape, curveSegments);
var m = new THREE.MeshPhongMaterial({ color: 0x8B8381 ,side: THREE.DoubleSide} );

var g2=new THREE.ShapeBufferGeometry(shape2, curveSegments);
var r= new THREE.Mesh(g,m);
r.add(new THREE.Mesh(g2,m))
return r;
}