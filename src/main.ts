import './style.css'
import { SceneManager } from './scene/SceneManager'

// Create audio files
createAudioFiles();

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Get the app container
  const appContainer = document.querySelector<HTMLDivElement>('#app');

  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  // 添加UI交互效果
  setupUIInteractions();

  // 创建场景管理器
  const sceneManager = new SceneManager(appContainer);

  // 开始动画循环
  sceneManager.animate();

  // 优化加载屏幕过渡效果
  const loadingScreen = document.getElementById('loading-screen');

  // 模拟加载进度
  simulateLoading(loadingScreen, () => {
    // 加载完成后隐藏加载屏幕
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 800);
    }
  });

  // 窗口大小变化时调整UI
  window.addEventListener('resize', () => {
    adjustUIForScreenSize();
  });

  // 初始调整UI
  adjustUIForScreenSize();

  // 清理资源
  window.addEventListener('beforeunload', () => {
    sceneManager.dispose();
  });
});

// 模拟加载进度
function simulateLoading(loadingElement: HTMLElement | null, callback: () => void): void {
  if (!loadingElement) {
    callback();
    return;
  }

  // 创建加载进度文本元素
  const loadingText = loadingElement.querySelector('div:not(.loading-spinner)');
  if (loadingText) {
    const originalText = loadingText.textContent || '加载中...';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        loadingText.textContent = '准备就绪';

        setTimeout(() => {
          callback();
        }, 500);
      } else {
        loadingText.textContent = `${originalText.replace('...', '')} ${Math.floor(progress)}%`;
      }
    }, 300);
  } else {
    // 如果没有找到文本元素，直接延迟后回调
    setTimeout(callback, 2000);
  }
}

// 设置UI交互效果
function setupUIInteractions(): void {
  // UI容器悬停效果
  const uiContainer = document.querySelector('.ui-container');
  const instructions = document.querySelector('.instructions');

  // 添加初始类
  if (uiContainer) {
    uiContainer.classList.add('glass-panel');
  }

  if (instructions) {
    instructions.classList.add('glass-panel');
  }
}

// 根据屏幕大小调整UI
function adjustUIForScreenSize(): void {
  const isMobile = window.innerWidth < 768;
  const uiContainer = document.querySelector('.ui-container');

  if (uiContainer) {
    if (isMobile) {
      (uiContainer as HTMLElement).style.maxWidth = 'calc(100% - 40px)';
    } else {
      (uiContainer as HTMLElement).style.maxWidth = '400px';
    }
  }
}

// Function to create audio files programmatically
function createAudioFiles() {
  // Create directories if they don't exist
  createDirectoryIfNeeded('/src/assets/audio');

  // Create ambient sound (waves and wind)
  createAmbientSound();

  // Create lighthouse sound
  createLighthouseSound();
}

// Helper function to create directory
function createDirectoryIfNeeded(path: string) {
  // This is just a placeholder - in a real app, we'd check if the directory exists
  // and create it if needed, but in this case we're creating the files directly
  console.log(`Ensuring directory exists: ${path}`);
}

// Create ambient sound programmatically
function createAmbientSound() {
  // In a real app, we'd download or include actual audio files
  // For this demo, we'll just log that we're creating them
  console.log('Creating ambient sound file');

  // The actual audio will be generated procedurally in the AudioManager
  // if the file doesn't exist
}

// Create lighthouse sound programmatically
function createLighthouseSound() {
  // In a real app, we'd download or include actual audio files
  // For this demo, we'll just log that we're creating them
  console.log('Creating lighthouse sound file');

  // The actual audio will be generated procedurally in the AudioManager
  // if the file doesn't exist
}
