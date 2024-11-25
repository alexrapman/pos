# iis-setup.ps1
param(
    [string]$Environment = "staging",
    [string]$Port = "8080"
)

# Import IIS module
Import-Module WebAdministration -ErrorAction Stop

# Create Application Pool
$appPoolName = "RestaurantPOS_$Environment"
if (!(Test-Path "IIS:\AppPools\$appPoolName")) {
    New-WebAppPool -Name $appPoolName
    Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "managedRuntimeVersion" -Value ""
    Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "startMode" -Value "AlwaysRunning"
}

# Create Website
$siteName = "RestaurantPOS_$Environment"
$physicalPath = "C:\inetpub\wwwroot\$Environment"

if (!(Test-Path "IIS:\Sites\$siteName")) {
    New-Website -Name $siteName -PhysicalPath $physicalPath -ApplicationPool $appPoolName -Port $Port
}