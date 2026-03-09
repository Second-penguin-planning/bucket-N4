let kanjiList=[]
let current=0

fetch("bucket-N4.json")
.then(res=>res.json())
.then(data=>{
kanjiList=data
loadCard()
updateProgress()
updateBuckets()
})

function getToday(){
return new Date().toISOString().slice(0,10)
}
let username=""
let today=""
function getStorageKey(){
return "progress_"+username+"_"+today
}
function startUser(){

username=document.getElementById("username").value

today=getToday()

loadProgress()

}
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

let b1=[]
let b2=[]
let b3=[]
let b4=[]

for(let k in data){

if(data[k]==1) b1.push(k)
if(data[k]==2) b2.push(k)
if(data[k]==3) b3.push(k)
if(data[k]==4) b4.push(k)

}

document.getElementById("bucket1").innerText=b1.join(" ")
document.getElementById("bucket2").innerText=b2.join(" ")
document.getElementById("bucket3").innerText=b3.join(" ")
document.getElementById("bucket4").innerText=b4.join(" ")

}
