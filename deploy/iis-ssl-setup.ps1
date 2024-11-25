# iis-ssl-setup.ps1
param(
    [string]$Environment = "staging",
    [string]$DomainName = "pos.restaurant.local",
    [string]$CertPath = ".\certificates"
)

# Import required modules
Import-Module WebAdministration

# Application Pool Configuration
$appPoolName = "RestaurantPOS_$Environment"
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "processModel.idleTimeout" -Value "00:00:00"
Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "recycling.periodicRestart.time" -Value "00:00:00"

# Generate self-signed certificate for development
$cert = New-SelfSignedCertificate `
    -DnsName $DomainName `
    -CertStoreLocation "cert:\LocalMachine\My" `
    -NotAfter (Get-Date).AddYears(1) `
    -FriendlyName "RestaurantPOS $Environment"

# Export certificate
$certPassword = ConvertTo-SecureString -String "DevPassword123!" -Force -AsPlainText
$certPath = Join-Path $CertPath "$Environment.pfx"
Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $certPassword

# Add HTTPS binding
$siteName = "RestaurantPOS_$Environment"
New-WebBinding -Name $siteName -Protocol "https" -Port 443 -HostHeader $DomainName -SslFlags 1

# Bind certificate to HTTPS
$thumb = $cert.Thumbprint
$guid = [guid]::NewGuid().ToString("B")
netsh http add sslcert hostnameport="$($DomainName):443" certhash=$thumb appid="$guid"