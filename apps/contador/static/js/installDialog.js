
async function install(){
    deferredPrompt.prompt()
    await deferredPrompt.userChoice;
    deferredPrompt = undefined;
    closeInstallDialog();
}

function closeInstallDialog(){
    const installDialog = document.querySelector('#installDialog')
    if(installDialog.open)
        installDialog.close();
}

function isInstalled(){
    // For iOS
    if(window.navigator.standalone)
        return true
    // For Android
    if(window.matchMedia('(display-mode: standalone)').matches)
        return true
        // If neither is true, it's not installed return false
}