$deployJson = Get-Content -Raw -Path "deploy-data.json" -Encoding UTF8

# Parse deploy-data.json
$jsonObj = $deployJson | ConvertFrom-Json

# Remove meta keys
$jsonObj.PSObject.Properties.Remove('_version')
$jsonObj.PSObject.Properties.Remove('_note')
$jsonObj.PSObject.Properties.Remove('_exported_at')

$embeddedJson = $jsonObj | ConvertTo-Json -Depth 100 -Compress

$dataJsHeader = @"
const STORAGE_KEY = 'pixora_studio_data_v4';

// Emojis pour les cartes de services (icône de secours quand aucune image n'est uploadée)
const SERVICE_ICONS = {
    'Carte de visite': '🪪',
    'Flyer': '📄',
    'Affiche publicitaire': '🖼️',
    'Visuel publicitaire': '📸',
    'Affiche / Kakémono': '🏷️',
    'Étiquette': '🏷️',
    'Logo': '✨',
    'Autres': '📦'
};

const defaultData = 
"@

$dataJsFooter = @"
;

function initData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    } else {
        try {
            let parsed = JSON.parse(stored);
            let updated = false;

            // Si les données en localStorage n'ont pas de créations mais que defaultData en a
            if ((!parsed.creations || parsed.creations.length === 0) && (defaultData.creations && defaultData.creations.length > 0)) {
                parsed = JSON.parse(JSON.stringify(defaultData));
                updated = true;
            }
            if ((!parsed.settings || !parsed.settings.logoUrl) && (defaultData.settings && defaultData.settings.logoUrl)) {
                if (!parsed.settings) parsed.settings = {};
                parsed.settings.logoUrl = defaultData.settings.logoUrl;
                updated = true;
            }

            if (updated) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        }
    }
}

function getData() {
    initData();
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData;
    } catch(e) {
        return defaultData;
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    try {
        window.dispatchEvent(new CustomEvent('pixora-data-updated', { detail: data }));
    } catch(e) {}
}

(function loadDeployData() {
    if (window.location.protocol === 'file:') {
        initData();
        return;
    }

    fetch('deploy-data.json?v=' + Date.now())
        .then(r => {
            if (!r.ok) throw new Error('No deploy-data.json');
            return r.json();
        })
        .then(deployData => {
            delete deployData._version;
            delete deployData._note;
            delete deployData._exported_at;

            const deployHasCustom = (deployData.creations && deployData.creations.length > 0)
                                 || (deployData.settings && deployData.settings.logoUrl);

            if (deployHasCustom) {
                saveData(deployData);
                console.log('[Pixora] ✅ Données personnalisées chargées depuis deploy-data.json');
            } else {
                initData();
            }
        })
        .catch(() => {
            initData();
        });
})();
"@

$fullContent = $dataJsHeader + $embeddedJson + $dataJsFooter

[System.IO.File]::WriteAllText("js/data.js", $fullContent, [System.Text.Encoding]::UTF8)
Write-Output "Successfully updated js/data.js with complete defaultData, initData, getData, saveData, and loadDeployData!"
