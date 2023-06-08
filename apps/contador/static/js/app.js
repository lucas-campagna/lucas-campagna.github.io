const statsPanel = document.querySelector('.statsPanel');
const secondContent = document.querySelector('.secondContent');
const hasVibrate = 'vibrate' in navigator;

const categories = [
    {value: 'Mulheres', label: 'Mulheres'},
    {value: 'Homens', label: 'Homens'},
    {value: 'Adolescentes', label: 'Adolesc.'},
    {value: 'Jovens', label: 'Jovens'},
];
const places = ['Nave', 'Galeria']
const counts = Object.fromEntries(
    places.map(place => [place, Object.fromEntries(
        categories.map(({value}) => [value, 0])
    )]
))

var selectedPlaceIndex = 0;

function resetCounts(all=false){
    Object.keys(counts).forEach(place=>{
        if(all || place === places[selectedPlaceIndex]){
            Object.keys(counts[place]).forEach(category=>{
                counts[place][category] = 0;
            })
        }
    })
    drawStatsPanel()
}

const listToString = (o,n) => o + n;

function selectPlace(event){
    selectedPlaceIndex = places.map((p,i)=>[p,i]).filter(([p]) => p === event.target.innerText)[0][1] || 0;
}

function subtractCategory(event){
    if(clock){
        hasSubtracted = true;
        const selectedCategory = categories.filter(({value}) => value == event.target.getAttribute('value'))[0].value || categories[0].value;
        counts[places[selectedPlaceIndex]][selectedCategory]=Math.max(0, counts[places[selectedPlaceIndex]][selectedCategory]-1);
        drawStatsPanel();
        if(hasVibrate){
            navigator.vibrate(200);
        }
    }
}

function addCategory(event){
    if(clock === undefined && !hasSubtracted){
        hasSubtracted = false;
        const selectedCategory = categories.filter(({value}) => value == event.target.getAttribute('value'))[0].value || categories[0].value;
        counts[places[selectedPlaceIndex]][selectedCategory]++;
        drawStatsPanel();
        if(hasVibrate){
            navigator.vibrate(100);
        }
    }
}

function drawStatsPanel(){
    statsPanel.innerHTML = `
        ${places.map(place=>`
            <div class="statsPlaceWrapper">
                <button onclick="selectPlace(event)">${place}</button>
                <div class="statsContentWrapper">
                    ${categories.map(({value, label})=>
                        `<span>${label}: ${counts[place][value]}</span>`
                    ).reduce(listToString)}
                </div>
            </div>
        `).reduce(listToString)}
    `
}

secondContent.innerHTML = `
    ${categories.map(({value, label})=>
        `<button onclick="addCategory(event)" onmousedown="startLongPress(event)" onmouseup="stopLongPress(event)" value=${value}>${label}</button>`
    ).reduce(listToString)}
`

drawStatsPanel();

var clock = undefined;
var hasSubtracted = false;
function startLongPress(event){
    hasSubtracted = false;
    clock = setTimeout(()=>{
        subtractCategory(event);
        clock = undefined;
    },500);
}
function stopLongPress(event){
    clearTimeout(clock);
    clock = undefined;
}