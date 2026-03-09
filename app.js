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

}
