# monitoring-setup.ps1
param(
    [string]$Environment = "staging",
    [string]$LogPath = "C:\Logs\RestaurantPOS"
)

# Create log directories
$logDirs = @(
    "$LogPath\Application",
    "$LogPath\IIS",
    "$LogPath\Performance"
)

foreach ($dir in $logDirs) {
    New-Item -Path $dir -ItemType Directory -Force
}

# Create new Event Log source
New-EventLog -LogName Application -Source "RestaurantPOS_$Environment"

# Configure IIS logging
$siteName = "RestaurantPOS_$Environment"
Set-WebConfigurationProperty -pspath "MACHINE/WEBROOT/APPHOST/$siteName" `
    -filter "system.applicationHost/sites/site[@name='$siteName']/logFile" `
    -name "directory" `
    -value "$LogPath\IIS"

# Create Performance Counters
$counterCategory = "RestaurantPOS_$Environment"
[System.Diagnostics.PerformanceCounterCategory]::Create(
    $counterCategory,
    "Restaurant POS Performance Counters",
    [System.Diagnostics.PerformanceCounterCategoryType]::MultiInstance,
    @(
        "Orders Per Second",
        "Average Order Processing Time",
        "Active Sessions"
    )
)