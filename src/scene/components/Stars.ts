import * as THREE from 'three';

export class Stars {
  private stars: THREE.Points;
  private starsMaterial: THREE.PointsMaterial;
  private moon: THREE.Mesh;
  private moonLight: THREE.DirectionalLight;
  
  constructor(scene: THREE.Scene) {
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    
    // Generate random stars
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = Math.random() * 1000;
      const z = (Math.random() - 0.5) * 2000 - 500; // Push stars back
      
      starVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    
    // Create stars material
    this.starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      transparent: true,
      opacity: 0,
      sizeAttenuation: false
    });
    
    // Create stars mesh
    this.stars = new THREE.Points(starsGeometry, this.starsMaterial);
    scene.add(this.stars);
    
    // Create moon
    const moonGeometry = new THREE.SphereGeometry(20, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffcc,
      transparent: true,
      opacity: 0
    });
    
    this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
    this.moon.position.set(200, 150, -300);
    scene.add(this.moon);
    
    // Create moon light
    this.moonLight = new THREE.DirectionalLight(0xaaaaff, 0);
    this.moonLight.position.copy(this.moon.position);
    scene.add(this.moonLight);
  }
  
  public updateVisibility(time: number): void {
    // Stars and moon should only be visible at night
    // time: 0 = dawn, 0.5 = noon, 0.75 = dusk, 1 = night
    
    let starsOpacity = 0;
    let moonOpacity = 0;
    let moonLightIntensity = 0;
    
    if (time > 0.8 || time < 0.2) {
      // Night time - stars fully visible
      starsOpacity = time > 0.8 ? 
        (time - 0.8) * 5 : // Fade in from dusk to night
        1 - time * 5;      // Fade out from night to dawn
      
      moonOpacity = starsOpacity;
      moonLightIntensity = starsOpacity * 0.5;
    }
    
    // Update materials
    this.starsMaterial.opacity = starsOpacity;
    (this.moon.material as THREE.MeshBasicMaterial).opacity = moonOpacity;
    this.moonLight.intensity = moonLightIntensity;
    
    // Update moon position based on time
    const angle = (time - 0.75) * Math.PI * 2;
    const radius = 500;
    this.moon.position.x = Math.cos(angle) * radius;
    this.moon.position.y = Math.sin(angle) * radius;
    this.moonLight.position.copy(this.moon.position);
  }
  
  public dispose(): void {
    (this.stars.geometry as THREE.BufferGeometry).dispose();
    this.starsMaterial.dispose();
    (this.moon.geometry as THREE.SphereGeometry).dispose();
    (this.moon.material as THREE.MeshBasicMaterial).dispose();
  }
}
