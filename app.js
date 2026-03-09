let kanjiList=[]
let current=0

fetch("bucket-N4.json")
.then(res=>res.json())
.then(data=>{
kanjiList=data
loadCard()
})

function loadCard(){

if(kanjiList.length===0) return

let k=kanjiList[current]

document.getElementById("kanji").innerText=k.kanji
document.getElementById("reading").innerText="Reading: "+k.reading
document.getElementById("meaning").innerText="Meaning: "+k.meaning

document.getElementById("reading").classList.add("hidden")
document.getElementById("meaning").classList.add("hidden")

}

function showAnswer(){

document.getElementById("reading").classList.remove("hidden")
document.getElementById("meaning").classList.remove("hidden")

}

function answer(bucket){

let k=kanjiList[current]

let data=JSON.parse(localStorage.getItem("progress"))||{}

data[k.kanji]=bucket

localStorage.setItem("progress",JSON.stringify(data))

current++

if(current>=kanjiList.length){
alert("Finished today's study!")
current=0
}

loadCard()

updateProgress()
updateBuckets()

}
function updateProgress(){

let percent = (current / kanjiList.length) * 100

document.getElementById("progressBar").style.width = percent + "%"

document.getElementById("progressText").innerText =
current + " / " + kanjiList.length

}

function updateBuckets(){

let data = JSON.parse(localStorage.getItem("progress")) || {}

let b1=0,b2=0,b3=0,b4=0

for(let k in data){

if(data[k]==1) b1++
if(data[k]==2) b2++
if(data[k]==3) b3++
if(data[k]==4) b4++

}

document.getElementById("b1").innerText=b1
document.getElementById("b2").innerText=b2
document.getElementById("b3").innerText=b3
document.getElementById("b4").innerText=b4

}
