import * as THREE from 'three';

export class Clouds {
  private clouds: THREE.Group;
  private cloudInstances: CloudInstance[] = [];
  private materials: THREE.Material[] = [];
  
  constructor(scene: THREE.Scene) {
    this.clouds = new THREE.Group();
    scene.add(this.clouds);
    
    // Create cloud instances
    this.createClouds();
  }
  
  private createClouds(): void {
    // Create different cloud shapes
    const cloudShapes = [
      this.createCloudShape1(),
      this.createCloudShape2(),
      this.createCloudShape3()
    ];
    
    // Create multiple cloud instances at different positions
    for (let i = 0; i < 30; i++) {
      const cloudShape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
      const scale = 5 + Math.random() * 15;
      
      const cloud = cloudShape.clone();
      cloud.scale.set(scale, scale * 0.6, scale);
      
      // Position clouds randomly in the sky
      const x = (Math.random() - 0.5) * 1000;
      const y = 100 + Math.random() * 100;
      const z = -300 - Math.random() * 400;
      cloud.position.set(x, y, z);
      
      // Random rotation
      cloud.rotation.y = Math.random() * Math.PI * 2;
      
      // Add to scene
      this.clouds.add(cloud);
      
      // Create cloud instance for animation
      this.cloudInstances.push({
        mesh: cloud,
        speed: 2 + Math.random() * 3,
        initialX: x
      });
    }
  }
  
  private createCloudShape1(): THREE.Group {
    const cloud = new THREE.Group();
    
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      roughness: 1,
      metalness: 0
    });
    this.materials.push(cloudMaterial);
    
    // Create several spheres to form a cloud
    const positions = [
      { x: 0, y: 0, z: 0, scale: 1 },
      { x: 1, y: 0.2, z: 0, scale: 0.8 },
      { x: -1, y: 0.1, z: 0, scale: 0.7 },
      { x: 0, y: 0.5, z: 0.5, scale: 0.6 },
      { x: 0.5, y: 0.2, z: -0.5, scale: 0.7 }
    ];
    
    const geometry = new THREE.SphereGeometry(1, 8, 8);
    
    positions.forEach(pos => {
      const sphere = new THREE.Mesh(geometry, cloudMaterial);
      sphere.position.set(pos.x, pos.y, pos.z);
      sphere.scale.set(pos.scale, pos.scale, pos.scale);
      cloud.add(sphere);
    });
    
    return cloud;
  }
  
  private createCloudShape2(): THREE.Group {
    const cloud = new THREE.Group();
    
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      roughness: 1,
      metalness: 0
    });
    this.materials.push(cloudMaterial);
    
    // Create a more elongated cloud
    const positions = [
      { x: 0, y: 0, z: 0, scale: 1 },
      { x: 1.5, y: 0, z: 0, scale: 0.9 },
      { x: -1.5, y: 0, z: 0, scale: 0.9 },
      { x: 3, y: -0.2, z: 0, scale: 0.7 },
      { x: -3, y: -0.1, z: 0, scale: 0.7 },
      { x: 0, y: 0.6, z: 0, scale: 0.8 }
    ];
    
    const geometry = new THREE.SphereGeometry(1, 8, 8);
    
    positions.forEach(pos => {
      const sphere = new THREE.Mesh(geometry, cloudMaterial);
      sphere.position.set(pos.x, pos.y, pos.z);
      sphere.scale.set(pos.scale, pos.scale, pos.scale);
      cloud.add(sphere);
    });
    
    return cloud;
  }
  
  private createCloudShape3(): THREE.Group {
    const cloud = new THREE.Group();
    
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      roughness: 1,
      metalness: 0
    });
    this.materials.push(cloudMaterial);
    
    // Create a more vertical cloud
    const positions = [
      { x: 0, y: 0, z: 0, scale: 1 },
      { x: 0.8, y: 0.8, z: 0, scale: 0.8 },
      { x: -0.8, y: 0.7, z: 0, scale: 0.7 },
      { x: 0, y: 1.5, z: 0, scale: 0.6 },
      { x: 0.5, y: -0.7, z: 0, scale: 0.7 },
      { x: -0.5, y: -0.8, z: 0, scale: 0.6 }
    ];
    
    const geometry = new THREE.SphereGeometry(1, 8, 8);
    
    positions.forEach(pos => {
      const sphere = new THREE.Mesh(geometry, cloudMaterial);
      sphere.position.set(pos.x, pos.y, pos.z);
      sphere.scale.set(pos.scale, pos.scale, pos.scale);
      cloud.add(sphere);
    });
    
    return cloud;
  }
  
  public animate(delta: number): void {
    // Move clouds slowly
    this.cloudInstances.forEach(cloud => {
      cloud.mesh.position.x += cloud.speed * delta;
      
      // Reset position when cloud moves out of view
      if (cloud.mesh.position.x > 600) {
        cloud.mesh.position.x = -600;
      }
    });
  }
  
  public dispose(): void {
    this.clouds.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
      }
    });
    
    this.materials.forEach(material => {
      material.dispose();
    });
  }
}

interface CloudInstance {
  mesh: THREE.Group;
  speed: number;
  initialX: number;
}
