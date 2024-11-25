# rate-limit-config.ps1
param(
    [string]$Environment = "staging",
    [string]$SiteName = "RestaurantPOS_$Environment"
)

# Install required IIS modules if not present
$modules = @(
    "RequestFiltering",
    "IpSecurity",
    "DynamicIpSecurity"
)

foreach ($module in $modules) {
    if (!(Get-WindowsFeature "Web-$module").Installed) {
        Install-WindowsFeature "Web-$module"
    }
}

# Configure Dynamic IP Security
Set-WebConfigurationProperty -pspath "MACHINE/WEBROOT/APPHOST/$SiteName" -filter "system.webServer/security/dynamicIpSecurity/denyByConcurrentRequests" -name "enabled" -value "True"
Set-WebConfigurationProperty -pspath "MACHINE/WEBROOT/APPHOST/$SiteName" -filter "system.webServer/security/dynamicIpSecurity/denyByConcurrentRequests" -name "maxConcurrentRequests" -value "10"

# Configure request rate limiting
Set-WebConfigurationProperty -pspath "MACHINE/WEBROOT/APPHOST/$SiteName" -filter "system.webServer/security/dynamicIpSecurity/denyByRequestRate" -name "enabled" -value "True"
Set-WebConfigurationProperty -pspath "MACHINE/WEBROOT/APPHOST/$SiteName" -filter "system.webServer/security/dynamicIpSecurity/denyByRequestRate" -name "maxRequests" -value "30"
Set-WebConfigurationProperty -pspath "MACHINE/WEBROOT/APPHOST/$SiteName" -filter "system.webServer/security/dynamicIpSecurity/denyByRequestRate" -name "requestIntervalInMilliseconds" -value "5000"

# Add allowed IP addresses (replace with your actual IPs)
$allowedIPs = @(
    "127.0.0.1",
    "::1",
    "10.0.0.0/24"
)

foreach ($ip in $allowedIPs) {
    Add-WebConfiguration -pspath "MACHINE/WEBROOT/APPHOST/$SiteName" -filter "system.webServer/security/ipSecurity" -value @{ipAddress = $ip; allowed = "true" }
}