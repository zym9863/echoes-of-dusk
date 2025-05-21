import * as THREE from 'three';

export class AudioManager {
  private listener: THREE.AudioListener;
  private ambientSound: THREE.Audio | null = null;
  private lighthouseSound: THREE.Audio | null = null;
  private audioLoader: THREE.AudioLoader;
  private isAudioEnabled: boolean = false;
  private volume: number = 0.5;

  constructor() {
    this.listener = new THREE.AudioListener();
    this.audioLoader = new THREE.AudioLoader();

    // Create audio elements
    this.createAmbientSound();
    this.createLighthouseSound();

    // Set up event listeners for UI controls
    this.setupEventListeners();
  }

  private createAmbientSound(): void {
    this.ambientSound = new THREE.Audio(this.listener);

    // Load ambient sound (waves, wind, etc.)
    this.audioLoader.load(
      '/ambient.mp3',
      (buffer: AudioBuffer) => {
        if (this.ambientSound) {
          this.ambientSound.setBuffer(buffer);
          this.ambientSound.setLoop(true);
          this.ambientSound.setVolume(0);
        }
      },
      (xhr: ProgressEvent) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error: unknown) => {
        console.error('Error loading ambient sound:', error);
        // Create a fallback audio buffer if loading fails
        this.createFallbackAmbientSound();
      }
    );
  }

  private createLighthouseSound(): void {
    this.lighthouseSound = new THREE.Audio(this.listener);

    // Load lighthouse sound (mechanical sound, bell, etc.)
    this.audioLoader.load(
      '/lighthouse.mp3',
      (buffer: AudioBuffer) => {
        if (this.lighthouseSound) {
          this.lighthouseSound.setBuffer(buffer);
          this.lighthouseSound.setLoop(false);
          this.lighthouseSound.setVolume(0);
        }
      },
      (xhr: ProgressEvent) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error: unknown) => {
        console.error('Error loading lighthouse sound:', error);
        // Create a fallback audio buffer if loading fails
        this.createFallbackLighthouseSound();
      }
    );
  }

  private createFallbackAmbientSound(): void {
    // Create a procedural ambient sound (wind/waves-like noise)
    if (!this.ambientSound) return;

    const audioContext = this.listener.context;
    const bufferSize = audioContext.sampleRate * 10; // 10 seconds
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with noise that sounds like waves/wind
    for (let i = 0; i < bufferSize; i++) {
      // Create a mix of different frequencies
      const t = i / audioContext.sampleRate;
      const noise = Math.random() * 2 - 1;
      const wave1 = Math.sin(t * 0.5) * 0.5;
      const wave2 = Math.sin(t * 0.2) * 0.3;

      // Mix noise and waves with varying amplitude
      data[i] = noise * 0.2 + wave1 * 0.4 + wave2 * 0.4;
    }

    this.ambientSound.setBuffer(buffer);
    this.ambientSound.setLoop(true);
    this.ambientSound.setVolume(0);
  }

  private createFallbackLighthouseSound(): void {
    // Create a procedural lighthouse sound (mechanical click)
    if (!this.lighthouseSound) return;

    const audioContext = this.listener.context;
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Create a mechanical click sound
    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioContext.sampleRate;

      if (t < 0.1) {
        // Initial click
        data[i] = Math.sin(t * 440 * Math.PI * 2) * Math.exp(-t * 20);
      } else if (t > 0.5 && t < 0.6) {
        // Second click
        data[i] = Math.sin((t - 0.5) * 330 * Math.PI * 2) * Math.exp(-(t - 0.5) * 15);
      } else if (t > 1.0 && t < 1.2) {
        // Mechanical whirring
        data[i] = Math.sin(t * 110 * Math.PI * 2) * Math.exp(-(t - 1.0) * 5) * 0.5;
      }
    }

    this.lighthouseSound.setBuffer(buffer);
    this.lighthouseSound.setLoop(false);
    this.lighthouseSound.setVolume(0);
  }

  private setupEventListeners(): void {
    // Toggle audio button
    const toggleAudioButton = document.getElementById('toggle-audio');
    if (toggleAudioButton) {
      toggleAudioButton.addEventListener('click', () => {
        this.toggleAudio();
      });
    }

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        this.setVolume(parseFloat(target.value));
      });
    }
  }

  public toggleAudio(): void {
    this.isAudioEnabled = !this.isAudioEnabled;

    if (this.isAudioEnabled) {
      // Start ambient sound
      if (this.ambientSound && !this.ambientSound.isPlaying) {
        this.ambientSound.setVolume(this.volume * 0.5);
        this.ambientSound.play();
      }
    } else {
      // Stop ambient sound
      if (this.ambientSound && this.ambientSound.isPlaying) {
        this.ambientSound.setVolume(0);
        this.ambientSound.stop();
      }
    }
  }

  public setVolume(volume: number): void {
    this.volume = volume;

    if (this.ambientSound) {
      this.ambientSound.setVolume(this.isAudioEnabled ? volume * 0.5 : 0);
    }

    if (this.lighthouseSound) {
      this.lighthouseSound.setVolume(this.isAudioEnabled ? volume : 0);
    }
  }

  public playLighthouseSound(): void {
    if (this.isAudioEnabled && this.lighthouseSound && !this.lighthouseSound.isPlaying) {
      this.lighthouseSound.setVolume(this.volume);
      this.lighthouseSound.play();
    }
  }

  public getListener(): THREE.AudioListener {
    return this.listener;
  }

  public dispose(): void {
    // Stop and dispose of sounds
    if (this.ambientSound) {
      this.ambientSound.stop();
      this.ambientSound.disconnect();
    }

    if (this.lighthouseSound) {
      this.lighthouseSound.stop();
      this.lighthouseSound.disconnect();
    }
  }
}
