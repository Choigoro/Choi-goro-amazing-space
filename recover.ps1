$historyPath = "$env:APPDATA\Code\User\History"
$entries = Get-ChildItem -Path $historyPath -Recurse -Filter entries.json

foreach ($entry in $entries) {
    if ($entry.FullName -notmatch "\\History\\[^\\]+\\entries\.json$") { continue }
    $data = Get-Content $entry.FullName -Raw | ConvertFrom-Json
    if ($data.resource -notmatch '\.tsx$') { continue }
    
    $sourcePath = [uri]::UnescapeDataString($data.resource.Substring(8))
    if ($sourcePath -notlike "*choigoro*") { continue }
    
    $bestFile = $null
    for ($i = 0; $i -lt $data.entries.Count; $i++) {
        $id = $data.entries[$i].id
        $filePath = Join-Path $entry.DirectoryName $id
        if (Test-Path $filePath) {
            $contentBytes = [System.IO.File]::ReadAllBytes($filePath)
            $hexStr = [System.BitConverter]::ToString($contentBytes) -replace "-"
            
            # Check for EF-BF-BD (uFFFD) or 3F-EB-AC-8E (UTF-8 bytes for '?묎' assuming it was written as UTF8!)
            # Actually, standard EF-BF-BD is what we want!
            # And also, "accept=`"image/*, image/webp`"" means it's one of the files we just wrote (or the recent history that broke).
            # Wait, if we use the OLDEST file (first entry in history) that DOES NOT contain FFFD, that might be too old!
            # Let's find the NEWEST file that DOES NOT contain EF-BF-BD!
            if ($hexStr.Contains("EFBFBD") -or $hexStr.Contains("3FEB")) {
                break
            } else {
                $bestFile = $filePath
            }
        }
    }
    
    if ($bestFile) {
        Copy-Item $bestFile $sourcePath -Force
        Write-Host "Restored $sourcePath from $bestFile"
    } else {
        Write-Host "No valid original found for $sourcePath"
    }
}


