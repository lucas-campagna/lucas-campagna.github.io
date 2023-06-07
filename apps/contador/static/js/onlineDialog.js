const onlineCountDialog = document.querySelector('#onlineCountDialog');
const onlineCountDialogInput = document.querySelector('#onlineCountDialog > input');
const btnOnlineDialog = document.querySelector('#btnOnlineDialog');

function updateButton(){
    btnOnlineDialog.innerText = `Online: ${onlineCountDialogInput.value}`
}

btnOnlineDialog.onclick = ()=>{
    onlineCountDialog.showModal();
    onlineCountDialogInput.select()
    if('virtualKeyboard' in navigator)
        navigator.virtualKeyboard.show();

}

onlineCountDialogInput.onkeyup = (event)=>{
    if(event.key === 'Enter'){
        onlineCountDialog.close();
        updateButton();
    }
}
onlineCountDialogInput.value = 0;
updateButton();

