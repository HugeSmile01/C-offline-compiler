// C# Compiler Pro - Site JavaScript
// PWA installation prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    const installBtn = document.createElement('button');
    installBtn.className = 'install-pwa-btn';
    installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
    installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: var(--shadow);
        z-index: 1000;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            installBtn.remove();
        }
    });
    
    document.body.appendChild(installBtn);
}

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('App is online');
    showConnectionStatus('online');
});

window.addEventListener('offline', () => {
    console.log('App is offline');
    showConnectionStatus('offline');
});

function showConnectionStatus(status) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `connection-status ${status}`;
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 0.75rem 1.5rem;
        background: ${status === 'online' ? 'var(--success)' : 'var(--warning)'};
        color: white;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    statusDiv.innerHTML = `
        <i class="fas fa-${status === 'online' ? 'wifi' : 'exclamation-triangle'}"></i>
        ${status === 'online' ? 'Back online' : 'Working offline'}
    `;
    document.body.appendChild(statusDiv);
    
    setTimeout(() => {
        statusDiv.style.opacity = '0';
        setTimeout(() => statusDiv.remove(), 300);
    }, 3000);
}

