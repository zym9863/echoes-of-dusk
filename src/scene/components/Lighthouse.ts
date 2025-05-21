import * as THREE from 'three';

export class Lighthouse {
  private lighthouse: THREE.Group;
  private lightBeam: THREE.SpotLight | null = null;
  private lightOn: boolean = false;
  private rotationSpeed: number = 0.5; // Radians per second
  private materials: THREE.Material[] = [];
  private lightHouseTop: THREE.Mesh | null = null;
  private lightGlow: THREE.PointLight | null = null;
  
  constructor(scene: THREE.Scene) {
    this.lighthouse = new THREE.Group();
    scene.add(this.lighthouse);
    
    // Create lighthouse structure
    this.createLighthouse();
    
    // Create light beam (initially off)
    this.createLightBeam();
  }
  
  private createLighthouse(): void {
    // Base of the lighthouse
    const baseGeometry = new THREE.CylinderGeometry(5, 6, 3, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.7,
      metalness: 0.2
    });
    this.materials.push(baseMaterial);
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 1.5;
    base.castShadow = true;
    base.receiveShadow = true;
    this.lighthouse.add(base);
    
    // Main tower
    const towerGeometry = new THREE.CylinderGeometry(3, 5, 20, 32);
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1
    });
    this.materials.push(towerMaterial);
    
    // Create red stripes on the tower
    const towerTexture = this.createStripedTexture();
    towerMaterial.map = towerTexture;
    
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = 13;
    tower.castShadow = true;
    tower.receiveShadow = true;
    this.lighthouse.add(tower);
    
    // Top of the lighthouse (lantern room)
    const topGeometry = new THREE.CylinderGeometry(3.5, 3, 4, 16);
    const topMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.5
    });
    this.materials.push(topMaterial);
    
    this.lightHouseTop = new THREE.Mesh(topGeometry, topMaterial);
    this.lightHouseTop.position.y = 25;
    this.lightHouseTop.castShadow = true;
    this.lightHouseTop.receiveShadow = true;
    this.lighthouse.add(this.lightHouseTop);
    
    // Lantern glass
    const glassGeometry = new THREE.CylinderGeometry(3, 3, 3, 16);
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.9
    });
    this.materials.push(glassMaterial);
    
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.y = 25;
    this.lighthouse.add(glass);
    
    // Roof of the lantern room
    const roofGeometry = new THREE.ConeGeometry(3.5, 3, 16);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.5
    });
    this.materials.push(roofMaterial);
    
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 28.5;
    roof.castShadow = true;
    roof.receiveShadow = true;
    this.lighthouse.add(roof);
    
    // Add a small point light inside the lantern (always on but dim)
    const ambientLight = new THREE.PointLight(0xffffcc, 0.5, 10);
    ambientLight.position.y = 25;
    this.lighthouse.add(ambientLight);
    
    // Position the lighthouse
    this.lighthouse.position.set(0, 0, 0);
  }
  
  private createStripedTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Texture();
    
    // Fill with white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add red stripes
    context.fillStyle = '#cc0000';
    const stripeHeight = canvas.height / 8;
    for (let i = 0; i < 4; i++) {
      context.fillRect(0, i * stripeHeight * 2, canvas.width, stripeHeight);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
  }
  
  private createLightBeam(): void {
    // Create spotlight for the light beam
    this.lightBeam = new THREE.SpotLight(0xffffcc, 0, 200, Math.PI / 12, 0.5, 2);
    this.lightBeam.position.y = 25;
    this.lightBeam.castShadow = true;
    this.lightBeam.shadow.mapSize.width = 1024;
    this.lightBeam.shadow.mapSize.height = 1024;
    this.lighthouse.add(this.lightBeam);
    
    // Create target for the spotlight
    const target = new THREE.Object3D();
    target.position.set(50, 0, 0);
    this.lighthouse.add(target);
    this.lightBeam.target = target;
    
    // Create a glow light
    this.lightGlow = new THREE.PointLight(0xffffcc, 0, 20);
    this.lightGlow.position.y = 25;
    this.lighthouse.add(this.lightGlow);
  }
  
  public toggleLight(): void {
    this.lightOn = !this.lightOn;
    
    if (this.lightOn) {
      if (this.lightBeam) this.lightBeam.intensity = 5;
      if (this.lightGlow) this.lightGlow.intensity = 2;
      
      // Change lantern room color when light is on
      if (this.lightHouseTop) {
        (this.lightHouseTop.material as THREE.MeshStandardMaterial).emissive.set(0xffcc66);
        (this.lightHouseTop.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
      }
    } else {
      if (this.lightBeam) this.lightBeam.intensity = 0;
      if (this.lightGlow) this.lightGlow.intensity = 0;
      
      // Reset lantern room color when light is off
      if (this.lightHouseTop) {
        (this.lightHouseTop.material as THREE.MeshStandardMaterial).emissive.set(0x000000);
        (this.lightHouseTop.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
      }
    }
  }
  
  public animate(delta: number): void {
    if (this.lightOn) {
      // Rotate the light beam
      this.lighthouse.rotation.y += this.rotationSpeed * delta;
    }
  }
  
  public getObject(): THREE.Group {
    return this.lighthouse;
  }
  
  public dispose(): void {
    this.lighthouse.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    this.materials.forEach(material => {
      material.dispose();
    });
  }
}
