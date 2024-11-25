# security-config.ps1
param(
    [string]$Environment = "staging",
    [string]$SiteName = "RestaurantPOS_$Environment"
)

# Add custom headers
$headers = @{
    "X-Frame-Options"         = "SAMEORIGIN"
    "X-XSS-Protection"        = "1; mode=block"
    "X-Content-Type-Options"  = "nosniff"
    "Referrer-Policy"         = "strict-origin-when-cross-origin"
    "Content-Security-Policy" = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
}

foreach ($header in $headers.GetEnumerator()) {
    Add-WebConfigurationProperty -PSPath "IIS:\Sites\$SiteName" -Filter "system.webServer/httpProtocol/customHeaders" -Name "." -Value @{name = $header.Key; value = $header.Value }
}

# Configure CORS
$corsXml = @"
<configuration>
    <system.webServer>
        <cors enabled="true" failUnlistedOrigins="true">
            <add origin="https://*.restaurant.local"
                 allowCredentials="true"
                 maxAge="120">
                <allowHeaders allowAllRequestedHeaders="true">
                    <add header="Authorization" />
                </allowHeaders>
                <allowMethods>
                    <add method="GET" />
                    <add method="POST" />
                    <add method="PUT" />
                    <add method="DELETE" />
                    <add method="OPTIONS" />
                </allowMethods>
                <exposeHeaders>
                    <add header="X-Powered-By" />
                </exposeHeaders>
            </add>
        </cors>
    </system.webServer>
</configuration>
"@

$corsXml | Out-File -FilePath "C:\inetpub\wwwroot\$Environment\cors.config" -Encoding UTF8

# Add request filtering rules
Set-WebConfigurationProperty -PSPath "IIS:\Sites\$SiteName" -Filter "system.webServer/security/requestFiltering" -Name "allowDoubleEscaping" -Value "false"
Set-WebConfigurationProperty -PSPath "IIS:\Sites\$SiteName" -Filter "system.webServer/security/requestFiltering/requestLimits" -Name "maxUrl" -Value "4096"
Set-WebConfigurationProperty -PSPath "IIS:\Sites\$SiteName" -Filter "system.webServer/security/requestFiltering/requestLimits" -Name "maxQueryString" -Value "2048"