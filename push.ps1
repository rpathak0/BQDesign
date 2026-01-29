# One-command push to GitHub (node_modules excluded via .gitignore)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Optional: add safe.directory (suppress errors)
git config --global --add safe.directory $PWD.Path 2>&1 | Out-Null

# Remove origin only if it exists (avoid error when no remote yet)
$remotes = git remote 2>&1 | Out-String
if ($remotes -match 'origin') { git remote remove origin }
git remote add origin "https://github.com/BookingQube/BQDesign.git"

git add .
# Commit only if there are changes (suppress "nothing to commit" message)
git commit -m "Push BQDesign" 2>&1 | Out-Null
git branch -M main 2>&1 | Out-Null
git push -u origin main
