# Echoes of Dusk | 暮色回响

[中文](README.md) | [English](README_EN.md)

An immersive 3D lighthouse and ocean scene built with Three.js and TypeScript.

## Project Overview

"Echoes of Dusk" is an interactive 3D web application featuring a serene lighthouse and ocean scene. Users can explore the scene in a twilight environment, interact with the lighthouse, listen to the sound of waves, and enjoy an immersive audiovisual experience.

### Key Features

- Realistic 3D lighthouse and ocean environment
- Dynamic sky system showing changes from dawn to dusk to night
- Interactive lighthouse light that can be toggled on/off
- Realistic cloud, starry sky, and moon effects
- Immersive audio experience including ocean waves and lighthouse sounds
- Responsive design that adapts to different screen sizes

## Tech Stack

- **TypeScript** - Provides type-safe JavaScript development experience
- **Vite** - Modern frontend build tool offering fast development experience
- **Three.js** - Powerful 3D graphics library for creating and displaying 3D content
- **Web Audio API** - Implemented through Three.js audio system for immersive sound effects

## Installation and Running

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/zym9863/echoes-of-dusk.git
cd echoes-of-dusk
```

2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be located in the `dist` directory.

## Usage Guide

- **Click on the lighthouse**: Makes the lighthouse glow
- **Drag the mouse**: Change perspective and explore the scene
- **Audio controls**: Use the control buttons on the interface to toggle audio and adjust volume

## Project Structure

```
echoes-of-dusk/
├── public/             # Static assets
├── src/                # Source code
│   ├── assets/         # Asset files (audio, etc.)
│   ├── audio/          # Audio management
│   ├── scene/          # Scene-related components
│   │   ├── components/ # Various scene components (lighthouse, sky, etc.)
│   │   └── SceneManager.ts # Scene manager
│   ├── main.ts         # Application entry
│   └── style.css       # Global styles
├── index.html          # HTML entry
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.js      # Vite configuration
```

## Main Components

### Scene Manager (SceneManager)

Responsible for initializing and managing the entire 3D scene, including camera, renderer, and various scene components.

### Lighthouse

The central element of the scene that users can interact with. Includes the lighthouse structure and toggleable light effects.

### Sky System

Dynamic sky system that changes color based on time, from dawn to dusk to night.

### Terrain

Includes ground, mountains, water surface, and the small hill where the lighthouse is located.

### Clouds

Dynamically moving clouds that enhance the realism of the scene.

### Stars

Stars and moon visible at night, with visibility changing over time.

### Audio Manager

Manages audio effects in the scene, including ambient sounds (ocean waves, wind) and lighthouse sounds.

## Contribution Guidelines

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

- [Three.js](https://threejs.org/) - Powerful 3D graphics library
- [Vite](https://vitejs.dev/) - Modern frontend build tool
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset
