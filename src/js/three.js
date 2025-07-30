// STOPPED AT 58mm https://www.youtube.com/watch?v=MnKKetZZi8g

import * as T from 'three';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import fragment from '../shaders/fragment.glsl';
import vertex from '../shaders/vertex.glsl';

import im from "/image.jpg"

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

export default class Three {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = new T.Scene();
    this.scene.background = new T.Color(0x1e1e1e);

    this.camera = new T.PerspectiveCamera(
      75,
      device.width / device.height,
      100,
      10000
    );
    this.camera.position.set(0, 0, 600);
    this.scene.add(this.camera);

    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.clock = new T.Clock();
    
    this.getData()
    this.setLights();
    this.addObjects();
    this.render();
    this.setResize();
  }

  getData() {
    this.svg = [...document.querySelectorAll('.cls-1')]

    this.lines = []

    this.svg.forEach((path, i) => {
      let len = path.getTotalLength()
      let numberOfPoints = Math.floor( len / 5 )

      // console.log('len ', len)
      // console.log('numberOfPoints ', numberOfPoints)

      let points = [];

      for (let i = 0; i < numberOfPoints; i++) {
        let pointAt = len * i/numberOfPoints;
        let p = path.getPointAtLength(pointAt);
        // console.log('p ', p)
        points.push(new T.Vector3(p.x - 1024, p.y - 512, 0))

        // let randX = (Math.random() - 0.5) * 5;  // makes the snake have more random particle spread
        // let randY = (Math.random() - 0.5) * 5;  // makes the snake have more random particle spread
        // points.push(new T.Vector3(p.x - 1024 + randX, p.y - 512 + randY, 0))
      }
      // console.log('points ', points)

      this.lines.push({
        id: i,
        path: path,
        length: len,
        number: numberOfPoints,
        points: points,
        currentPos: 0,
        speed: 1
        // speed: 0.5
      })
    })
    console.log('this.lines ', this.lines)
  }

  setLights() {
    this.ambientLight = new T.AmbientLight(new T.Color(1, 1, 1, 1));
    this.scene.add(this.ambientLight);
  }

  addObjects() {
    let that = this;
    this.material = new T.ShaderMaterial({
      side: T.DoubleSide,
      wireframe: true,
      uniforms: {
        // progress: { type: 'f', value: 0 },
        time: { value: 0 },
        resolution: { value: new T.Vector4() }
      },
      transparent: true,
      depthTest: true,
      depthWrite: true,
      blending: T.AdditiveBlending,
      fragmentShader: fragment,
      vertexShader: vertex,
    });

    this.geometry = new T.PlaneGeometry(1, 1, 10, 10);
    this.geometry = new T.BufferGeometry();
    this.max = this.lines.length * 100;
    this.positions = new Float32Array(this.max * 3);
    this.opacity = new Float32Array(this.max);

    // this.lines.forEach((line) => {
    //   // console.log('line ', line)
    //   line.points.forEach((p) => {
    //     this.positions.push(p.x, p.y, p.z);
    //     this.opacity.push(Math.random() / 5)
    //   })
    // })
    // console.log('this.opacity ', this.opacity)

    for (let i = 0; i < this.max; i++) {
      this.opacity.set([Math.random() / 5], i);
      this.positions.set([Math.random() * 100, Math.random() * 1000, 0], i * 3)
    }

    this.geometry.setAttribute( 'position', new T.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute( 'opacity', new T.BufferAttribute(this.opacity, 1));

    this.plane = new T.Points(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  updateThings() {
    let j = 0;
    this.lines.forEach(line => {
      line.currentPos += line.speed;
      line.currentPos = line.currentPos % line.number;

      // 100 : DETERMINES # OF PARTICLES PER SNAKE
      for (let i = 0; i < 100; i++) {
        let index = (line.currentPos + i) % line.number;
        let p = line.points[index];
        if (!p) continue; // skip undefined points. Allows "speed: 0.5"

        this.positions.set([p.x, p.y, p.z], j * 3)
        this.opacity.set([i/100], j)  // [ i / changes thickness of the snake ]. 100 thicker than 500
        j++;
      }
    })
    this.geometry.attributes.position.array = this.positions;
    this.geometry.attributes.position.needsUpdate = true;
  }

  render() {
    // if (!this.isPlaying) return;
    // this.time += 0.05;

    this.updateThings();

    const elapsedTime = this.clock.getElapsedTime();

    // this.planeMesh.rotation.x = 0.2 * elapsedTime;
    // this.planeMesh.rotation.y = 0.1 * elapsedTime;

    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);    
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
