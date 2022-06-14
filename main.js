import './tailwind.css'
import gsap from 'gsap'
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import { Float32BufferAttribute, Mesh } from 'three';
const canvasContainer = document.querySelector('#canvasContainer')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth/canvasContainer.offsetHeight,
  0.1,
  1000,
)

const render = new THREE.WebGL1Renderer({
  antialias: true,
  canvas: document.querySelector('canvas')
})
render.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
render.setPixelRatio(window.devicePixelRatio)


//creating a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50), 
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms:{
      globeTexture: {
        value: new THREE.TextureLoader().load('./image/earth2.jpeg')
      }
    }
  })
)

//create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50), 
  new THREE.ShaderMaterial({
    vertexShader:atmosphereVertexShader,
    fragmentShader:atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)
atmosphere.scale.set(1.1, 1.1, 1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.
PointsMaterial({
  color: 0xffffff,
})

const starVertices = []
for(let i=0; i<10000; i++){
  const x = (Math.random()-0.5)*2000
  const y = (Math.random()-0.5)*2000
  const z = -Math.random()*2000
  starVertices.push(x, y, z)
}


starGeometry.setAttribute(
  'position', 
  new THREE.Float32BufferAttribute(
    starVertices, 3)
  )

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)


camera.position.z = 15



function createPoint(lat, lng){
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.2, 0.8), 
    new THREE.MeshBasicMaterial({
      color: '#3BF7FF',
      opacity: 0.4,
      transparent: true
    })
  )
  const latitude = (lat/180)*Math.PI
  const longitude = (lng/180)*Math.PI
  const radius = 5
  
  const x = radius * Math.cos(latitude) * Math.sin(longitude)
  const y = radius * Math.sin(latitude)
  const z = radius * Math.cos(latitude) * Math.cos(longitude)
  box.position.x = x
  box.position.y = y
  box.position.z = z
  box.lookAt(0, 0, 0)
  box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.3))
  
  group.add(box)

  gsap.to(box.scale, {
    z: 1.4,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: 'linear',
    delay: Math.random()
  })
}
// 19.0760° N, 72.8777° E
// N +, E +, W -, S -

createPoint(25.2854, 51.5310)   //Doha
createPoint(26.4207, 50.0888)   //Dammam
createPoint(32.0853, 34.7818)   //Tel Aviv
createPoint(28.7041, 77.1025)   //Delhi
createPoint(19.0760, 72.8777)   //Mumbai
createPoint(22.3193, 114.1694)  //Hong Kong
createPoint(1.3521, 103.8198)   //Singapore
createPoint(-6.2088, 106.8456)  //Jakarta
createPoint(23.6978, 120.9605)  //Taiwan
createPoint(37.5665, 126.9780)  //Seoul
createPoint(34.6937, 135.5023)  //Osaka
createPoint(35.6762, 139.6503)  //Tokyo
createPoint(-33.8688, 151.2093) //Sydney
createPoint(-37.8136, 144.9631) //Melbourne
createPoint(61.9241, 25.7482)   //Finland
createPoint(52.2297, 21.0122)   //Warsaw
createPoint(52.5200, 13.4050)   //Berlin
createPoint(50.1109, 8.6821)    //Frankfurt
createPoint(47.3769, 8.5417)    //Zurich
createPoint(45.4642, 9.1900)    //Milan
createPoint(45.0703, 7.6869)    //Turin
createPoint(40.4168, -3.7038)   //Madrid
createPoint(48.8566, 2.3522)    //Paris
createPoint(50.5039, 4.4699)    //Belgium
createPoint(51.5072, -0.1276)   //London
createPoint(52.1326, 5.2913)    //Netherlands
createPoint(-33.4489, -70.6693) //Santiago
createPoint(-23.5558, -46.6396) //Sao Palo
createPoint(43.8041, -120.5542)//Oregon
createPoint(40.7608, -111.8910)//Salt Lake City 
createPoint(36.1699, -115.1398)//Las Vegas
createPoint(34.0522, -118.2437)//Los Angeles
createPoint(41.8780, -93.0977) //Iowa
createPoint(32.7767, -96.7970) //Dallas
createPoint(43.6532, -79.3832) //Toronto
createPoint(45.5017, -73.5673) //Montreal
createPoint(39.9612, -82.9988) //Columbus
createPoint(37.926868, -78.024902) //North Virginia
createPoint(33.8361, -81.1637) //South Carolina

sphere.rotation.y = -Math.PI/2

const mouse = {
  x: 0,
  y: 0
}

const raycaster = new THREE.Raycaster();
function animate(){
  requestAnimationFrame(animate)
  render.render(scene, camera)
  group.rotation.y += 0.002
  //group.rotation.y += 0.003
  //group.rotation.y += mouse.x*0.5
  // if(mouse.x){
  //   gsap.to(group.rotation, {
  //     x: -mouse.y*0.01,
  //     y: mouse.x * 1.8,
  //     duration: 2
  //   })
  // }
  // update the picking ray with the camera and pointer position
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	// const intersects = raycaster.intersectObjects( group.children.filter((mesh) => {
  //   return mesh.geometry.type === 'BoxGeometry'
  // }));
  const intersects = raycaster.intersectObjects(group.children)
  console.log(intersects)
	for (let i = 0; i<intersects.length; i++){
    console.log(intersects[i]);
    //intersects[i].object.material.opacity = 1;
	}
	render.render(scene, camera ); 
}
animate()


addEventListener('mousemove', (event)=>{
  mouse.x = ((event.clientX - innerWidth/2) / (innerWidth/2))*2-1
  //mouse.y = (event.clientY / innerHeight)*2+1
})
