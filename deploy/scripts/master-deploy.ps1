# deploy/scripts/master-deploy.ps1
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("staging", "production")]
    [string]$Environment,
    [string]$BuildPath = "..\..\packages\*\dist"
)

$ScriptsPath = $PSScriptRoot
$ConfigPath = Join-Path (Split-Path $ScriptsPath -Parent) "config"

# Source all deployment scripts
. "$ScriptsPath\deploy.ps1"
. "$ScriptsPath\iis-setup.ps1"
. "$ScriptsPath\iis-ssl-setup.ps1"
. "$ScriptsPath\security-config.ps1"
. "$ScriptsPath\rate-limit-config.ps1"
. "$ScriptsPath\monitoring-setup.ps1"

# Run deployment steps
try {
    Write-Host "Starting deployment process for $Environment environment"
    
    # 1. Setup IIS
    ./iis-setup.ps1 -Environment $Environment
    
    # 2. Configure SSL
    ./iis-ssl-setup.ps1 -Environment $Environment
    
    # 3. Deploy application
    ./deploy.ps1 -Environment $Environment -BuildPath $BuildPath
    
    # 4. Configure security
    ./security-config.ps1 -Environment $Environment
    
    # 5. Setup monitoring
    ./monitoring-setup.ps1 -Environment $Environment
    
    Write-Host "Deployment completed successfully"
}
catch {
    Write-Error "Deployment failed: $_"
    exit 1
}