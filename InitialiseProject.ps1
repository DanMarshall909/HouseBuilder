# PowerShell script to automate setup and initialization of a Minecraft TypeScript project.
$TemplateRepoUrl = "https://github.com/DanMarshall909/minecraft-template"

# Ensure GitHub CLI is authenticated.
function Test-GitHubAuthentication {
	try {
		$AuthStatus = gh auth status
		if (-not $AuthStatus -match "Logged in") {
			Write-Error "GitHub CLI is not authenticated. Please authenticate using `gh auth login`."
			exit
		}
	}
 catch {
		Write-Error "Error checking GitHub CLI authentication: $_"
		exit
	}
}

# Clone the repository and prepare the local environment.
function Setup-Project {
	param(
		[string]$RepoUrl,
		[string]$ProjectPath,
		[string]$ProjectName
	)
	try {
		git clone $RepoUrl $ProjectPath
		Push-Location -Path $ProjectPath
		Remove-Item .git -Recurse -Force
		git init
		git add .
		git commit -m "Initial commit from template"

		# Renaming folders to match project name and updating GUIDs
		Rename-ProjectFolders -ProjectPath $ProjectPath -NewRepoName $ProjectName

		# Update .env file with correct project configuration
		Update-EnvFile -ProjectPath $ProjectPath -ProjectName $ProjectName

		# Update package.json with project-specific details
		Update-PackageJson -ProjectPath $ProjectPath -ProjectName $ProjectName

		# Node.js setup and package installation
		Write-Host "Installing Node.js dependencies..."
		npm install

		Pop-Location
		Write-Output "Project setup complete. Navigate to $ProjectPath to start working."
	}
 catch {
		Write-Error "Failed to set up project: $_"
		exit
	}
}

# Update the .env file with project-specific settings
function Update-EnvFile {
	param(
		[string]$ProjectPath,
		[string]$ProjectName
	)
	$envFilePath = Join-Path -Path $ProjectPath -ChildPath ".env"
    (Get-Content $envFilePath) -replace 'PROJECT_NAME=".*"', "PROJECT_NAME=`"$ProjectName`"" |
	Set-Content $envFilePath
}

# Update package.json with project-specific details
function Update-PackageJson {
	param(
		[string]$ProjectPath,
		[string]$ProjectName
	)
	$packageJsonPath = Join-Path -Path $ProjectPath -ChildPath "package.json"
    
	# Load and modify package.json
	$packageJson = Get-Content -Path $packageJsonPath | ConvertFrom-Json
	$packageJson.name = $ProjectName.ToLower() -replace '\s+', '-' # Ensure name is lowercase and hyphenated
	$packageJson.productName = "$ProjectName TypeScript Project"
	$packageJson.description = "$ProjectName TypeScript Project for Minecraft"

	# Save updated package.json
	$packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJsonPath
}

# Rename 'starter' directories and update manifest files
function Rename-ProjectFolders {
	param(
		[string]$ProjectPath,
		[string]$NewRepoName
	)
	$behaviorPackPath = Join-Path -Path $ProjectPath -ChildPath "behavior_packs\starter"
	$resourcePackPath = Join-Path -Path $ProjectPath -ChildPath "resource_packs\starter"
	$newBehaviorPackPath = $behaviorPackPath -replace 'starter', $NewRepoName
	$newResourcePackPath = $resourcePackPath -replace 'starter', $NewRepoName
    
	Rename-Item -Path $behaviorPackPath -NewName $NewRepoName
	Rename-Item -Path $resourcePackPath -NewName $NewRepoName

	Update-GUIDs -ManifestPath (Join-Path -Path $newBehaviorPackPath -ChildPath "manifest.json")
	Update-GUIDs -ManifestPath (Join-Path -Path $newResourcePackPath -ChildPath "manifest.json")
}

# Update GUIDs in manifest.json if exists
function Update-GUIDs {
	param(
		[string]$ManifestPath
	)
	if (Test-Path $ManifestPath) {
		$Json = Get-Content $ManifestPath | ConvertFrom-Json
		$Json.header.uuid = [guid]::NewGuid().ToString()
		$Json.modules[0].uuid = [guid]::NewGuid().ToString()
		$Json | ConvertTo-Json -Depth 10 | Set-Content $ManifestPath
	}
 else {
		Write-Warning "manifest.json not found at $ManifestPath"
	}
}

# Main script execution
Test-GitHubAuthentication
$ProjectName = Read-Host "Enter the new project name"
$ProjectPath = "C:\Code\Projects\$ProjectName"
Setup-Project -RepoUrl $TemplateRepoUrl -ProjectPath $ProjectPath -ProjectName $ProjectName
Write-Output "Setup complete. Review the local project at $ProjectPath and start developing!"
