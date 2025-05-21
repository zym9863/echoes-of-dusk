import * as THREE from 'three';

export class Terrain {
  private terrain: THREE.Group;
  private materials: THREE.Material[] = [];
  
  constructor(scene: THREE.Scene) {
    this.terrain = new THREE.Group();
    scene.add(this.terrain);
    
    // Create ground plane
    this.createGround();
    
    // Create distant mountains
    this.createMountains();
    
    // Create water
    this.createWater();
    
    // Create small hill for lighthouse
    this.createLighthouseHill();
  }
  
  private createGround(): void {
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 128, 128);
    groundGeometry.rotateX(-Math.PI / 2);
    
    // Apply some noise to the ground
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];
      
      // Skip center area where lighthouse will be
      const distFromCenter = Math.sqrt(x * x + z * z);
      if (distFromCenter < 30) continue;
      
      // Apply simplex-like noise
      const scale = 0.02;
      const noiseHeight = this.simpleNoise(x * scale, z * scale) * 5;
      vertices[i + 1] = noiseHeight;
    }
    
    groundGeometry.computeVertexNormals();
    
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x336633,
      roughness: 0.8,
      metalness: 0.1,
    });
    this.materials.push(groundMaterial);
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.position.y = -2;
    this.terrain.add(ground);
  }
  
  private createMountains(): void {
    // Create distant mountains as silhouettes
    const mountainGeometry = new THREE.BufferGeometry();
    const mountainPoints: number[] = [];
    
    // Create mountain ranges at different distances
    this.createMountainRange(mountainPoints, -800, 0.3, 100, 150);
    this.createMountainRange(mountainPoints, -600, 0.5, 80, 120);
    this.createMountainRange(mountainPoints, -400, 0.7, 60, 90);
    
    mountainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mountainPoints, 3));
    mountainGeometry.computeVertexNormals();
    
    const mountainMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
    });
    this.materials.push(mountainMaterial);
    
    const mountains = new THREE.Mesh(mountainGeometry, mountainMaterial);
    this.terrain.add(mountains);
  }
  
  private createMountainRange(points: number[], zPosition: number, noiseScale: number, minHeight: number, maxHeight: number): void {
    const width = 2000;
    const segments = 100;
    const segmentWidth = width / segments;
    
    // Bottom vertices (at ground level)
    for (let i = 0; i <= segments; i++) {
      const x = -width / 2 + i * segmentWidth;
      points.push(x, 0, zPosition);
    }
    
    // Top vertices (mountain peaks)
    for (let i = segments; i >= 0; i--) {
      const x = -width / 2 + i * segmentWidth;
      const noise = this.simpleNoise(x * noiseScale, zPosition * noiseScale);
      const height = minHeight + noise * (maxHeight - minHeight);
      points.push(x, height, zPosition);
    }
  }
  
  private createWater(): void {
    const waterGeometry = new THREE.PlaneGeometry(2000, 2000);
    waterGeometry.rotateX(-Math.PI / 2);
    
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0066aa,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    this.materials.push(waterMaterial);
    
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = -1;
    water.position.z = -200;
    this.terrain.add(water);
  }
  
  private createLighthouseHill(): void {
    const hillGeometry = new THREE.ConeGeometry(30, 10, 32);
    hillGeometry.translate(0, 5, 0);
    
    const hillMaterial = new THREE.MeshStandardMaterial({
      color: 0x555544,
      roughness: 0.9,
      metalness: 0.1,
    });
    this.materials.push(hillMaterial);
    
    const hill = new THREE.Mesh(hillGeometry, hillMaterial);
    hill.position.set(0, -7, 0);
    hill.receiveShadow = true;
    hill.castShadow = true;
    this.terrain.add(hill);
  }
  
  // Simple noise function for terrain generation
  private simpleNoise(x: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    z -= Math.floor(z);
    
    const u = this.fade(x);
    const v = this.fade(z);
    
    const A = (X) & 15;
    const B = (X + 1) & 15;
    const AA = (A + Z) & 15;
    const BA = (B + Z) & 15;
    const AB = (A + Z + 1) & 15;
    const BB = (B + Z + 1) & 15;
    
    return this.lerp(v, 
      this.lerp(u, this.grad(AA, x, z), this.grad(BA, x-1, z)),
      this.lerp(u, this.grad(AB, x, z-1), this.grad(BB, x-1, z-1))
    );
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, x: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : z;
    const v = h < 4 ? z : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  public dispose(): void {
    this.terrain.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
      }
    });
    
    this.materials.forEach(material => {
      material.dispose();
    });
  }
}
