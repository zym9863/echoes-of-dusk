import * as THREE from 'three';

export class Sky {
  private sky: THREE.Mesh;
  private skyMaterial: THREE.ShaderMaterial;
  
  constructor(scene: THREE.Scene) {
    // Create sky dome geometry
    const skyGeometry = new THREE.SphereGeometry(1000, 32, 32);
    
    // Create sky shader material
    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 20 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        
        varying vec3 vWorldPosition;
        
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    
    // Create sky mesh
    this.sky = new THREE.Mesh(skyGeometry, this.skyMaterial);
    scene.add(this.sky);
  }
  
  public updateTime(time: number): void {
    // Update sky colors based on time of day
    // time: 0 = dawn, 0.5 = noon, 0.75 = dusk, 1 = night
    
    let topColor: THREE.Color;
    let bottomColor: THREE.Color;
    
    if (time < 0.25) { // Dawn
      const t = time / 0.25;
      topColor = new THREE.Color().lerpColors(
        new THREE.Color(0x000033), // Night blue
        new THREE.Color(0x0077ff), // Day blue
        t
      );
      bottomColor = new THREE.Color().lerpColors(
        new THREE.Color(0x000000), // Night black
        new THREE.Color(0xff9966), // Dawn orange
        t
      );
    } else if (time < 0.5) { // Morning to noon
      const t = (time - 0.25) / 0.25;
      topColor = new THREE.Color(0x0077ff); // Day blue
      bottomColor = new THREE.Color().lerpColors(
        new THREE.Color(0xff9966), // Dawn orange
        new THREE.Color(0xffffff), // Day white
        t
      );
    } else if (time < 0.75) { // Noon to dusk
      const t = (time - 0.5) / 0.25;
      topColor = new THREE.Color().lerpColors(
        new THREE.Color(0x0077ff), // Day blue
        new THREE.Color(0x0033aa), // Dusk deep blue
        t
      );
      bottomColor = new THREE.Color().lerpColors(
        new THREE.Color(0xffffff), // Day white
        new THREE.Color(0xff7733), // Dusk orange
        t
      );
    } else { // Dusk to night
      const t = (time - 0.75) / 0.25;
      topColor = new THREE.Color().lerpColors(
        new THREE.Color(0x0033aa), // Dusk deep blue
        new THREE.Color(0x000033), // Night blue
        t
      );
      bottomColor = new THREE.Color().lerpColors(
        new THREE.Color(0xff7733), // Dusk orange
        new THREE.Color(0x000000), // Night black
        t
      );
    }
    
    // Update shader uniforms
    this.skyMaterial.uniforms.topColor.value = topColor;
    this.skyMaterial.uniforms.bottomColor.value = bottomColor;
    
    // Adjust exponent based on time (sharper gradient at dawn/dusk)
    const exponent = time < 0.25 || (time > 0.5 && time < 0.85) ? 0.8 : 0.6;
    this.skyMaterial.uniforms.exponent.value = exponent;
  }
  
  public dispose(): void {
    this.sky.geometry.dispose();
    this.skyMaterial.dispose();
  }
}
