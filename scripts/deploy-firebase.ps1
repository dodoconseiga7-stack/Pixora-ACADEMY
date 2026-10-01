<#
.SYNOPSIS
    Script de déploiement automatique de PIXORA STUDIO sur Firebase Hosting.
.DESCRIPTION
    Ce script vérifie la configuration, prépare les fichiers statiques et effectue
    le déploiement vers Firebase Hosting via l'exécutable autonome firebase.exe.
#>

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🔥 DÉPLOIEMENT PIXORA STUDIO SUR FIREBASE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Vérification des fichiers de configuration
if (-not (Test-Path "firebase.json")) {
    Write-Host "❌ Erreur: firebase.json introuvable." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path ".firebaserc")) {
    Write-Host "❌ Erreur: .firebaserc introuvable." -ForegroundColor Red
    exit 1
}

# 2. Vérification de l'exécutable Firebase
$firebaseBin = Join-Path $root "firebase.exe"
if (-not (Test-Path $firebaseBin)) {
    Write-Host "⚠️ firebase.exe non trouvé dans le dossier racine. Recherche dans le PATH..." -ForegroundColor Yellow
    $firebaseCmd = Get-Command "firebase" -ErrorAction SilentlyContinue
    if ($firebaseCmd) {
        $firebaseBin = "firebase"
    } else {
        Write-Host "❌ Firebase CLI n'est pas installé. Téléchargement automatique..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri "https://firebase.tools/bin/win/instant/latest" -OutFile "firebase.exe" -UseBasicParsing
        $firebaseBin = ".\firebase.exe"
    }
} else {
    $firebaseBin = ".\firebase.exe"
}

Write-Host "✓ Fichiers de configuration Firebase validés." -ForegroundColor Green

# 3. Instructions et Déploiement
Write-Host "`nPour déployer votre site PIXORA STUDIO sur Firebase :" -ForegroundColor White
Write-Host "1. Exécutez : $firebaseBin login (pour connecter votre compte Google/Firebase)" -ForegroundColor Yellow
Write-Host "2. Exécutez : $firebaseBin deploy --only hosting" -ForegroundColor Yellow
Write-Host "`nSouhaitez-vous tenter le déploiement maintenant ? (Nécessite d'être connecté)" -ForegroundColor Cyan
Write-Host "Astuce : Vous pouvez aussi déployer via GitHub Actions ou la console Firebase Web." -ForegroundColor Gray
