const resetDialog = document.querySelector('#resetDialog')
const btnResetDialog = document.querySelector('#btnResetDialog')
const yesButton = document.querySelector('#resetDialog #yes')
const allButton = document.querySelector('#resetDialog #all')
const noButton = document.querySelector('#resetDialog #no')

btnResetDialog.onclick = ()=>{
    resetDialog.showModal()
}

yesButton.onclick = ()=>{
    resetCounts();
    resetDialog.close();
}
allButton.onclick = ()=>{
    resetCounts(true);
    resetDialog.close();
}

noButton.onclick = ()=>{
    resetDialog.close();
}

