# Innovation Website 2026 - 3D Interactive Experience

A cutting-edge 3D innovation website built with Three.js, featuring interactive drone models and immersive 3D graphics. This project showcases advanced web technologies for creating engaging visual experiences.

## 🚀 Features

- **Interactive 3D Graphics**: Powered by Three.js for stunning visual effects
- **3D Drone Models**: Custom drone visualizations with material support
- **Camera Controls**: Orbit controls for smooth navigation
- **3D Text Rendering**: Dynamic text geometry for enhanced UI
- **Multiple Model Formats**: Support for OBJ, FBX, Blender, and MTL files
- **Responsive Design**: Optimized for various screen sizes
- **Hot Module Replacement**: Fast development with Vite

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher)
  - Download from: [https://nodejs.org/](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
- **Git** (optional, for cloning)
  - Download from: [https://git-scm.com/](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd innovation-website-2026

# Or download and extract the ZIP file
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Or using yarn
yarn install
```

### 3. Start Development Server
```bash
# Start the development server
npm run dev

# Or using yarn
yarn dev
```

The application will open at `http://localhost:5173/`

## 📦 Dependencies & Libraries

### Core Dependencies
- **three** (^0.158.0): 3D graphics library for WebGL
  - Purpose: Core 3D rendering, geometries, materials, lighting
  - Official documentation: [threejs.org](https://threejs.org/)

### Three.js Extensions Used
- **OrbitControls**: Camera control for mouse/touch interaction
- **MTLLoader**: Material Template Library loader for material files
- **OBJLoader**: Wavefront OBJ file loader for 3D models
- **FontLoader**: Font loading for 3D text rendering
- **TextGeometry**: 3D text geometry creation

### Development Dependencies
- **@vitejs/plugin-react** (^5.1.1): React support for Vite
- **vite** (^7.2.4): Build tool and development server
- **eslint** (^9.39.1): Code linting and formatting
- **@eslint/js** (^9.39.1): ESLint JavaScript configurations
- **eslint-plugin-react-hooks** (^7.0.1): React hooks linting rules
- **eslint-plugin-react-refresh** (^0.4.24): React refresh linting
- **globals** (^16.5.0): Global variables for ESLint

### Type Support (Development)
- **@types/react** (^19.2.5): TypeScript definitions for React
- **@types/react-dom** (^19.2.3): TypeScript definitions for React DOM

## 📁 Asset Requirements

### 3D Models (Located in `src/Drone_Costum/Material/`)
- **drone_costum.obj**: 3D drone model (Wavefront OBJ format)
- **drone_costum.mtl**: Material file for drone textures and properties
- **drone_costum.fbx**: Alternative FBX format model
- **drone_costum.blend**: Source Blender file
- **drone_costum.blend1**: Blender backup file

### Supported 3D File Formats
- **.obj**: Wavefront OBJ (geometry data)
- **.mtl**: Material Template Library (material properties)
- **.fbx**: Autodesk FBX (geometry, materials, animations)
- **.blend**: Blender native format (source files)

## 🛠️ Available Scripts

```bash
# Development server with hot reload
npm run dev

# Create production build
npm run build

# Preview production build locally
npm run preview

# Run ESLint code analysis
npm run lint
```

## 🌐 Browser Support

### Minimum Requirements
- **WebGL Support**: Required for Three.js rendering
- **ES6 Modules**: Modern JavaScript features
- **Modern Browser**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+

### Recommended Browsers
- **Chrome** (latest): Best performance and debugging tools
- **Firefox** (latest): Good WebGL support
- **Safari** (latest): Apple device compatibility
- **Edge** (latest): Windows integration

## ⚡ Performance Considerations

### Hardware Requirements
- **GPU**: Dedicated graphics card recommended for complex scenes
- **RAM**: Minimum 4GB, 8GB+ recommended
- **WebGL 2.0**: Enhanced graphics capabilities

### Optimization Tips
- Use texture compression for large materials
- Implement LOD (Level of Detail) for complex models
- Monitor memory usage for large scenes
- Enable texture mipmapping for better performance

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to resolve import 'three'"**
   ```bash
   npm install three
   ```

2. **3D Models Not Loading**
   - Verify file paths in `src/Drone_Costum/Material/`
   - Check browser console for CORS errors
   - Ensure models are in correct format

3. **WebGL Context Lost**
   - Check GPU drivers are updated
   - Reduce scene complexity
   - Monitor memory usage

4. **Performance Issues**
   - Lower polygon count on models
   - Reduce texture sizes
   - Implement frustum culling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Platforms
- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag `dist` folder after build
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload `dist` contents to S3 bucket

## 🤝 Development Workflow

1. **Hot Reload**: Changes reflect immediately during development
2. **ESLint**: Maintains code quality standards
3. **Modular Architecture**: Organized file structure for scalability
4. **Asset Management**: Centralized 3D asset organization

## 📚 Learning Resources

### Three.js Documentation
- [Three.js Manual](https://threejs.org/manual/)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

### Vite Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [Vite Configuration](https://vitejs.dev/config/)

### 3D Modeling Tools
- [Blender](https://www.blender.org/) (Free, open-source)
- [WebGL Inspector](https://spector.babylonjs.com/) (Debugging)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the browser console for error messages
2. Verify all dependencies are installed correctly
3. Ensure 3D assets are in the correct directory
4. Test with different browsers for compatibility

---

**Built with ❤️ using Three.js and Vite**
