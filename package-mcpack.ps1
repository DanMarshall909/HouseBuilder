# PowerShell script to build and package the HouseBuilder Minecraft mod as a .mcpack file
# Usage: Run this script from the root of your project (c:\Code\HouseBuilder)

# 0. Update manifest.json with a unique title and UUIDs for each build
$manifestPath = "behavior_packs/HouseBuilder/manifest.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath | ConvertFrom-Json
    $date = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
    $manifest.header.name = "House Builder ($date)"
    # Generate new UUIDs for header and module
    function New-Guid { [guid]::NewGuid().ToString() }
    $manifest.header.uuid = New-Guid
    $manifest.modules[0].uuid = New-Guid
    $manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath -Encoding UTF8
    Write-Host "Updated manifest.json with new name and UUIDs for this build."
}

# 1. Build the project
Write-Host "Building the project..."
npm run build

# 2. Ensure the scripts directory exists in the behavior pack
$behaviorPackScripts = "behavior_packs/HouseBuilder/scripts"
if (-not (Test-Path $behaviorPackScripts)) {
	Write-Host "Creating scripts directory in behavior pack..."
	New-Item -ItemType Directory -Path $behaviorPackScripts | Out-Null
}

# 3. Copy ALL compiled JS files (including subfolders) to the behavior pack scripts directory
Write-Host "Copying compiled JS files to behavior pack..."
# Remove old scripts first to avoid stale files
if (Test-Path $behaviorPackScripts) {
	Remove-Item "$behaviorPackScripts/*" -Recurse -Force
}
Copy-Item -Recurse -Force lib/* $behaviorPackScripts

# 4. Zip the behavior pack into a .mcpack file
$mcpackName = "HouseBuilder.mcpack"
if (Test-Path $mcpackName) { Remove-Item $mcpackName }
Write-Host "Packaging behavior pack as $mcpackName..."
Compress-Archive -Path "behavior_packs/HouseBuilder" -DestinationPath $mcpackName

# 5. Optionally open the .mcpack in Minecraft if build succeeded
if ($LASTEXITCODE -eq 0) {
	Write-Host "Opening $mcpackName in Minecraft..."
	Start-Process $mcpackName
}
else {
	Write-Host "Build failed. Please fix errors and re-run the script."
}

Write-Host "`nDone! Double-click $mcpackName to import into Minecraft Bedrock Edition."
Write-Host "If you update your code, just re-run this script."
