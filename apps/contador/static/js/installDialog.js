
async function install(){
    // alert('Instalando App')
    deferredPrompt.prompt()
    const {outcome} = await deferredPrompt.userChoice;
    deferredPrompt = undefined;
    alert(outcome)
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