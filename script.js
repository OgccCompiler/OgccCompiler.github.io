document.addEventListener('DOMContentLoaded', () => {
    const osSelect = document.getElementById('os-select');
    const archSelect = document.getElementById('arch-select');
    const downloadBtn = document.getElementById('download-btn');
    const infoText = document.getElementById('auto-detect-msg');
    const guideSection = document.getElementById('install-guide');
    const guideOsName = document.getElementById('guide-os-name');
    const guideSteps = document.getElementById('guide-steps');
    const guideCode = document.getElementById('guide-code');

    // 1. Auto-detect OS & Architecture
    function detectSystem() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        let os = 'windows';
        let arch = 'x64';

        // OS Detection
        if (userAgent.includes('mac')) os = 'macos';
        else if (userAgent.includes('linux')) os = 'linux';
        else if (userAgent.includes('win')) os = 'windows';

        // Architecture Detection
        if (userAgent.includes('arm') || userAgent.includes('aarch64') || userAgent.includes('applewebkit')) {
            // Apple Silicon or ARM
            if (os === 'macos' || userAgent.includes('arm64') || userAgent.includes('aarch64')) {
                arch = 'arm64';
            }
        } else if (userAgent.includes('x86_32') || userAgent.includes('i386') || userAgent.includes('i686')) {
            arch = 'x86';
        }

        osSelect.value = os;
        archSelect.value = arch;
        infoText.textContent = `We detected ${osSelect.options[osSelect.selectedIndex].text} (${archSelect.options[archSelect.selectedIndex].text}) on your system.`;
    }

    // Run immediately on page load
    detectSystem();

    // 2. Download and Install Guide Logic
    downloadBtn.addEventListener('click', (e) => {
        // Remove e.preventDefault() later if you want the actual link to trigger a file download.
        // We keep it here to simulate the process and show the guide.
        e.preventDefault(); // Verhindert das Neuladen der Seite
                
                const selectedOs = osSelect.value;
                const selectedArch = archSelect.value;

                // Dateiendung basierend auf dem Betriebssystem bestimmen
                let extension = '';
                if (selectedOs === 'windows') {
                    extension = 'exe';
                } else if (selectedOs === 'macos') {
                    extension = 'pkg';
                } else if (selectedOs === 'linux') {
                    extension = 'sh';
                }

                // Pfad zur Datei im 'assets' Ordner zusammenbauen
                const filePath = `assets/${selectedOs}-${selectedArch}.${extension}`;

                // Download dynamisch starten
                const downloadLink = document.createElement('a');
                downloadLink.href = filePath;
                // Optional: Gibt der Datei einen schönen Namen beim Herunterladen
                downloadLink.download = `ogcc-${selectedOs}-${selectedArch}.${extension}`; 
                
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Show Guide Section
        guideSection.classList.remove('hidden');
        guideOsName.textContent = osSelect.options[osSelect.selectedIndex].text;

        // Dynamically set instructions based on the OS
        guideSteps.innerHTML = ''; 
        let steps = [];
        let terminalCode = 'ogcc --version';

        switch (selectedOs) {
            case 'windows':
                steps = [
                    'Run the downloaded <code>ogcc-installer.exe</code> file.',
                    'Follow the instructions in the setup wizard.',
                    'Open a new Command Prompt (CMD) or PowerShell.',
                    'Verify the installation using the command below.'
                ];
                terminalCode = 'ogcc --version\nOGCC Version 1.0.0 (Windows)';
                break;
            case 'macos':
                steps = [
                    'Open the downloaded <code>ogcc-macos.pkg</code> file.',
                    'Follow the instructions in the Apple Installer.',
                    'Open your Terminal (found in Applications > Utilities).',
                    'Run the command below to ensure it was successful.'
                ];
                terminalCode = 'ogcc --version\nOGCC Version 1.0.0 (MacOS)';
                break;
            case 'linux':
                steps = [
                    'Open your terminal in the downloads directory.',
                    'Make the script executable: <code>chmod +x ogcc-install.sh</code>',
                    'Run the installer: <code>sudo ./ogcc-install.sh</code>',
                    'The compiler will automatically be added to your PATH.'
                ];
                terminalCode = '$ ogcc --version\nOGCC Version 1.0.0 (Linux)';
                break;
        }

        // Insert steps into the list
        steps.forEach(step => {
            const li = document.createElement('li');
            li.innerHTML = step;
            guideSteps.appendChild(li);
        });

        // Update the code box at the bottom
        guideCode.innerHTML = terminalCode;

        // Smooth scroll to the guide
        guideSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Update info text when the user manually changes the dropdown
    const updateInfoText = () => {
        infoText.textContent = "Selection manually changed.";
    }
    osSelect.addEventListener('change', updateInfoText);
    archSelect.addEventListener('change', updateInfoText);
});
