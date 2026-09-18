# Deploy to Vercel using token from environment variable VERCEL_TOKEN
# Usage: $env:VERCEL_TOKEN="..."; .\scripts\deploy-vercel.ps1

$ErrorActionPreference = "Stop"
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Remove-Item Env:npm_config_devdir -ErrorAction SilentlyContinue

if (-not $env:VERCEL_TOKEN) {
  Write-Host "Set VERCEL_TOKEN first."
  exit 1
}

$npx = "C:\Program Files\nodejs\npx.cmd"
if (-not (Test-Path $npx)) {
  Write-Host "Node.js npx not found."
  exit 1
}

Write-Host "Deploying production..."
& $npx vercel deploy --prod --yes --token $env:VERCEL_TOKEN
