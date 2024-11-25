# deploy.ps1# deploy.ps1
param(
    [string]$Environment = "staging",
    [string]$BuildPath = ".\packages\*\dist"
)

# Function to check and install prerequisites
function Install-Prerequisites {
    # Check if IIS is installed
    if (-not (Get-WindowsFeature -Name Web-Server).Installed) {
        Write-Host "Installing IIS..."
        Install-WindowsFeature -Name Web-Server -IncludeManagementTools
    }    # deploy.ps1
    param(
        [string]$Environment = "staging",
        [string]$BuildPath = ".\packages\*\dist",
        [switch]$Force
    )
    
    # Setup logging
    $logPath = ".\deployment_logs"
    $logFile = Join-Path $logPath "deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
    New-Item -Path $logPath -ItemType Directory -Force | Out-Null
    
    function Write-Log {
        param($Message)
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        "$timestamp - $Message" | Tee-Object -FilePath $logFile -Append
    }
    
    function Test-AdminPrivileges {
        $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($identity)
        return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    }
    
    # Check for admin privileges
    if (-not (Test-AdminPrivileges)) {
        Write-Log "ERROR: This script requires administrator privileges"
        exit 1
    }
    
    try {
        Write-Log "Starting deployment to $Environment environment"
    
        # Create required directories
        $directories = @(
            ".\packages",
            "C:\Backups\$Environment",
            "C:\inetpub\wwwroot\$Environment"
        )
    
        foreach ($dir in $directories) {
            if (-not (Test-Path $dir)) {
                New-Item -Path $dir -ItemType Directory -Force
                Write-Log "Created directory: $dir"
            }
        }
    
        # Import IIS module
        if (Get-Module -ListAvailable -Name WebAdministration) {
            Import-Module WebAdministration
        }
        else {
            Write-Log "ERROR: WebAdministration module not found. Installing IIS..."
            Install-WindowsFeature Web-Server, Web-Mgmt-Tools
            Import-Module WebAdministration
        }
    
        # Backup and deploy
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupPath = "C:\Backups\$Environment\$timestamp"
        
        Write-Log "Creating backup at $backupPath"
        Copy-Item "C:\inetpub\wwwroot\$Environment\*" $backupPath -Recurse -Force -ErrorAction SilentlyContinue
    
        Write-Log "Deploying new files"
        Copy-Item $BuildPath "C:\inetpub\wwwroot\$Environment" -Recurse -Force
    
        Write-Log "Deployment completed successfully"
    }
    catch {
        Write-Log "ERROR: Deployment failed - $($_.Exception.Message)"
        Write-Log "Rolling back to previous version..."
        
        if (Test-Path $backupPath) {
            Copy-Item "$backupPath\*" "C:\inetpub\wwwroot\$Environment" -Recurse -Force
            Write-Log "Rollback completed"
        }
        
        exit 1
    }

    # Install WebAdministration module if not present
    if (-not (Get-Module -ListAvailable -Name WebAdministration)) {
        Write-Host "Installing WebAdministration module..."
        Install-Module -Name WebAdministration -Force
    }
}

# Function to create directory structure
function Initialize-Directories {
    $directories = @(
        ".\packages",
        "C:\Backups\$Environment",
        $config[$Environment].iisPath
    )

    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -Path $dir -ItemType Directory -Force
            Write-Host "Created directory: $dir"
        }
    }
}

# Deployment configuration
$config = @{
    staging    = @{
        iisPath = "C:\inetpub\wwwroot\staging"
        appPool = "RestaurantPOS_Staging"
    }
    production = @{
        iisPath = "C:\inetpub\wwwroot\production"
        appPool = "RestaurantPOS_Production"
    }
}

try {
    Write-Host "Starting deployment to $Environment..."
    
    # Initialize prerequisites and directories
    Install-Prerequisites
    Initialize-Directories
    
    # Stop IIS app pool if exists
    if (Test-Path "IIS:\AppPools\$($config[$Environment].appPool)") {
        Stop-WebAppPool -Name $config[$Environment].appPool
    }
    
    # Backup existing deployment
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "C:\Backups\$Environment\$timestamp"
    if (Test-Path $config[$Environment].iisPath) {
        Copy-Item $config[$Environment].iisPath $backupPath -Recurse -Force
    }
    
    # Deploy new files
    if (Test-Path $BuildPath) {
        Copy-Item $BuildPath $config[$Environment].iisPath -Recurse -Force
    }
    else {
        throw "Build path not found: $BuildPath"
    }
    
    # Start IIS app pool
    if (Test-Path "IIS:\AppPools\$($config[$Environment].appPool)") {
        Start-WebAppPool -Name $config[$Environment].appPool
    }
    
    Write-Host "Deployment completed successfully!"
}
catch {
    Write-Error "Deployment failed: $_"
    exit 1
}# deploy.ps1
param(
    [string]$Environment = "staging",
    [string]$BuildPath = ".\packages\*\dist",
    [switch]$Force
)

# Setup logging
$logPath = ".\deployment_logs"
$logFile = Join-Path $logPath "deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
New-Item -Path $logPath -ItemType Directory -Force | Out-Null

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Tee-Object -FilePath $logFile -Append
}

function Test-AdminPrivileges {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check for admin privileges
if (-not (Test-AdminPrivileges)) {
    Write-Log "ERROR: This script requires administrator privileges"
    exit 1
}

try {
    Write-Log "Starting deployment to $Environment environment"

    # Create required directories
    $directories = @(
        ".\packages",
        "C:\Backups\$Environment",
        "C:\inetpub\wwwroot\$Environment"
    )

    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -Path $dir -ItemType Directory -Force
            Write-Log "Created directory: $dir"
        }
    }

    # Import IIS module
    if (Get-Module -ListAvailable -Name WebAdministration) {
        Import-Module WebAdministration
    }
    else {
        Write-Log "ERROR: WebAdministration module not found. Installing IIS..."
        Install-WindowsFeature Web-Server, Web-Mgmt-Tools
        Import-Module WebAdministration
    }

    # Backup and deploy
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "C:\Backups\$Environment\$timestamp"
    
    Write-Log "Creating backup at $backupPath"
    Copy-Item "C:\inetpub\wwwroot\$Environment\*" $backupPath -Recurse -Force -ErrorAction SilentlyContinue

    Write-Log "Deploying new files"
    Copy-Item $BuildPath "C:\inetpub\wwwroot\$Environment" -Recurse -Force

    Write-Log "Deployment completed successfully"
}
catch {
    Write-Log "ERROR: Deployment failed - $($_.Exception.Message)"
    Write-Log "Rolling back to previous version..."
    
    if (Test-Path $backupPath) {
        Copy-Item "$backupPath\*" "C:\inetpub\wwwroot\$Environment" -Recurse -Force
        Write-Log "Rollback completed"
    }
    
    exit 1
}

# Define variables
$sourcePath = "C:\Users\Usuario\Desktop\pos\restaurant-pos\source"
$destinationPath = "C:\inetpub\wwwroot\restaurant-pos"
$backupPath = "C:\inetpub\wwwroot\restaurant-pos-backup"

# Stop the web server
Write-Host "Stopping IIS..."
Stop-Service -Name 'W3SVC'

# Backup the current deployment
if (Test-Path $destinationPath) {
    Write-Host "Backing up current deployment..."
    if (Test-Path $backupPath) {
        Remove-Item -Recurse -Force $backupPath
    }
    Rename-Item -Path $destinationPath -NewName $backupPath
}

# Copy new files to the destination
Write-Host "Deploying new version..."
Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse

# Start the web server
Write-Host "Starting IIS..."
Start-Service -Name 'W3SVC'

Write-Host "Deployment completed successfully."
param(
    [string]$Environment = "staging",
    [string]$BuildPath = ".\packages\*\dist"
)

# Check prerequisites
if (-not (Get-Module -ListAvailable -Name WebAdministration)) {
    Write-Host "Installing I