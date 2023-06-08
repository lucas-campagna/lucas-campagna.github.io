const saveDialogOKButton = document.querySelector('#saveDialogOKButton')
const btnSaveDialog = document.querySelector('#btnSaveDialog')
const saveDialog = document.querySelector('#saveDialog')
const saveDialogContent = document.querySelector('#saveDialogContent')

const code='AKfycbxZ_R_7UJ4qw-3lLaqVQYaefr0jGieKJ9Qil3W7nBPNy1pbzdqdJjoaMEmt7EC9XV7tog'
const link_to_sheet = `https://script.google.com/macros/s/${code}/exec?action=addData`


var copyToClipboard = false;
saveDialogOKButton.onclick = ()=>{
    saveDialog.close()
    if(copyToClipboard && 'clipboard' in navigator){
        navigator.clipboard.writeText(generateResumeText())
        saveDialog.showModal()
        setDialogMsg('Dados copiados para área de transferência, cole no chat do whatsapp');
        setSaveDialogButton('OK')
        copyToClipboard = false
    }
}
setSaveDialogButton()
setDialogMsg()

btnSaveDialog.onclick = ()=>{
    saveDialog.showModal()
    fetchData();
}

function getCountsOnline(){
    return +document.querySelector('#btnOnlineDialog').innerText.match(/Online: (\d+)/)[1]
}

function fetchData(){
    copyToClipboard = true;
    if(navigator.onLine){

        const {data, horario} = gerarHorarioData();
        const body = {
            data,
            horario,
            nave_mulheres: counts.Nave.Mulheres,
            nave_homens: counts.Nave.Homens,
            nave_jovens: counts.Nave.Jovens,
            nave_adolescentes: counts.Nave.Adolescentes,
            galeria_mulheres: counts.Galeria.Mulheres,
            galeria_homens: counts.Galeria.Homens,
            galeria_jovens: counts.Galeria.Jovens,
            galeria_adolescentes: counts.Galeria.Adolescentes,
            online: getCountsOnline(),
        }
        try{
            setDialogMsg('Salvando dados ...');
            fetch(
                link_to_sheet,{
                    method:'POST',
                    headers: {
                        "Content-Type": "application/json",
                        // "Access-Control-Allow-Origin": "https://script.google.com",
                        // "Access-Control-Allow-Methods": "POST",
                        // "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                    },
                    body:JSON.stringify(body)
                }
            )
            .then(e=>e.text())
            .then(txt=>{
                setDialogMsg(`Valores ${txt == 'Append'? 'adicionados à' : 'atualizados na'} tabela`)
                setSaveDialogButton("OK")
            })
        }catch{
            setDialogMsg('Falha ao salvar dados na planilha')
            setSaveDialogButton("OK")
        }
    }else{
        setDialogMsg("Sem conexão com a internet")
        setSaveDialogButton("fechar")
    }

}

function setSaveDialogButton(msg=''){
    saveDialogOKButton.innerText = msg
    if(msg === '')
        saveDialogOKButton.style.visibility = 'hidden'
    else{
        saveDialogOKButton.style.visibility = 'visible'
    }
}

function setDialogMsg(msg=''){
    saveDialogContent.innerText = msg;
}

function gerarHorarioData(){
    function pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    let now = new Date();
    
    return {
        data: `${pad(now.getDate(),2)}/${pad(now.getMonth()+1,2)}/${pad(now.getFullYear(),4)}`,
        horario: now.getHours() < 12? 'manhã' : now.getHours() < 17? 'tarde' : 'noite'
    }
}


function generateResumeText(){
    const genTextPerCategory = (title,data)=>`${capitalize(title)}:\n${Object.entries(data).map(([label, qtd])=>`${capitalize(label)}: ${qtd}`).join('\n')}\n`
    const joinSumCategorias = (a,b)=>{
        let obj = {}
        for(k in a) obj[k] = a[k];
        for(k in b) obj[k] = k in obj ? obj[k] + b[k] : b[k];
        return obj
    }
    const {data, horario} = gerarHorarioData();
    
    const categoriaTotal = places.reduce((a,b)=>joinSumCategorias(a, counts[b]), {})
    let text = `${horario}: ${data}`
    text += '\n\n'
    text += places.map(c=>genTextPerCategory(c, counts[c])).join('\n')
    text += '\n'
    text += genTextPerCategory('Total',categoriaTotal)
    text += '\n'
    text += `Total: ${Object.keys(counts).map(p => Object.keys(counts[p]).map(c => counts[p][c]).reduce(reduceSum)).reduce(reduceSum)}`
    text += '\n'
    text += `Online: ${getCountsOnline()}`
    return text
}

function capitalize(text){
    return text.split(/\s+/).map(c=>c.charAt(0).toUpperCase() + c.slice(1)).join(' ')
}

const reduceSum = (o,n)=> o+n