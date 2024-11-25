# build.ps1
$env:NODE_ENV = "production"

# Build React app
Write-Host "Building React application..."
npm run build

# Build Electron app
Write-Host "Building Electron application..."
npm run electron-builder

# Create installer
Write-Host "Creating Windows installer..."
electron-builder --win