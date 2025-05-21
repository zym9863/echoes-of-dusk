import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from './components/Sky';
import { Terrain } from './components/Terrain';
import { Clouds } from './components/Clouds';
import { Lighthouse } from './components/Lighthouse';
import { Stars } from './components/Stars';
import { AudioManager } from '../audio/AudioManager';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock: THREE.Clock;

  private sky: Sky;
  private terrain: Terrain;
  private clouds: Clouds;
  private lighthouse: Lighthouse;
  private stars: Stars;

  private audioManager: AudioManager;

  private timeOfDay: number = 0.75; // 0 = dawn, 0.5 = noon, 0.75 = dusk, 1 = night
  private timeSpeed: number = 0.005; // Speed of time passing
  private animateTime: boolean = false; // Whether time should automatically progress

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private interactiveObjects: THREE.Object3D[] = [];

  constructor(container: HTMLElement) {
    // Initialize clock
    this.clock = new THREE.Clock();

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x58434c, 0.01);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 10, 50);
    this.camera.lookAt(0, 0, 0);

    // Add camera to scene for audio listener
    this.scene.add(this.camera);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    container.appendChild(this.renderer.domElement);

    // Initialize controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
    this.controls.minPolarAngle = 0.1; // Prevent going too high
    this.controls.target.set(0, 0, -50);

    // Initialize raycaster for interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Initialize audio manager
    this.audioManager = new AudioManager();

    // Add audio listener to camera
    this.camera.add(this.audioManager.getListener());

    // Initialize scene components
    this.sky = new Sky(this.scene);
    this.terrain = new Terrain(this.scene);
    this.clouds = new Clouds(this.scene);
    this.lighthouse = new Lighthouse(this.scene);
    this.stars = new Stars(this.scene);

    // Add lighthouse to interactive objects
    this.interactiveObjects.push(this.lighthouse.getObject());

    // Set up event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('click', this.onMouseClick.bind(this));

    // Initial update of all components
    this.updateTimeOfDay(this.timeOfDay);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseClick(event: MouseEvent): void {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with interactive objects
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      // If lighthouse is clicked
      if (intersects[0].object.parent === this.lighthouse.getObject()) {
        this.lighthouse.toggleLight();
        this.audioManager.playLighthouseSound();
      }
    }
  }

  public updateTimeOfDay(time: number): void {
    this.timeOfDay = time;

    // Update sky colors based on time of day
    this.sky.updateTime(time);

    // Update lighting
    this.updateLighting(time);

    // Update stars visibility
    this.stars.updateVisibility(time);
  }

  private updateLighting(time: number): void {
    // Adjust scene ambient light based on time
    const ambientIntensity = Math.max(0.1, 1 - Math.abs(time - 0.5) * 1.5);
    this.scene.remove(...this.scene.children.filter(child => child instanceof THREE.AmbientLight));

    const ambientLight = new THREE.AmbientLight(
      time < 0.5 ? 0xffffff : (time < 0.8 ? 0xffa366 : 0x334466),
      ambientIntensity
    );
    this.scene.add(ambientLight);

    // Adjust directional light (sun/moon)
    this.scene.remove(...this.scene.children.filter(child => child instanceof THREE.DirectionalLight));

    const sunPosition = new THREE.Vector3(
      Math.cos((time - 0.25) * Math.PI * 2) * 100,
      Math.sin((time - 0.25) * Math.PI * 2) * 100,
      0
    );

    const directionalLight = new THREE.DirectionalLight(
      time < 0.5 ? 0xffffff : (time < 0.8 ? 0xff7733 : 0x8888ff),
      Math.max(0.1, 1 - Math.abs(time - 0.5) * 1.8)
    );
    directionalLight.position.copy(sunPosition);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;

    this.scene.add(directionalLight);
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Update controls
    this.controls.update();

    // Animate clouds
    this.clouds.animate(delta);

    // Animate lighthouse light if on
    this.lighthouse.animate(delta);

    // Progress time if animation is enabled
    if (this.animateTime) {
      this.timeOfDay += this.timeSpeed * delta;
      if (this.timeOfDay > 1) this.timeOfDay = 0;
      this.updateTimeOfDay(this.timeOfDay);
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  public toggleTimeAnimation(): void {
    this.animateTime = !this.animateTime;
  }

  public setTimeSpeed(speed: number): void {
    this.timeSpeed = speed;
  }

  public getAudioManager(): AudioManager {
    return this.audioManager;
  }

  public dispose(): void {
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    window.removeEventListener('click', this.onMouseClick.bind(this));

    // Dispose of resources
    this.renderer.dispose();
    this.controls.dispose();

    // Dispose of components
    this.sky.dispose();
    this.terrain.dispose();
    this.clouds.dispose();
    this.lighthouse.dispose();
    this.stars.dispose();

    // Dispose of audio
    this.audioManager.dispose();
  }
}
