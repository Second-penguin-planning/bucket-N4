let kanjiList=[]
let current=0

fetch("kanji.json")
.then(res=>res.json())
.then(data=>{
kanjiList=data
loadCard()
})

function loadCard(){

let k=kanjiList[current]

document.getElementById("kanji").innerText=k.kanji
document.getElementById("reading").innerText="Reading: "+k.reading
document.getElementById("meaning").innerText="Meaning: "+k.meaning

}
function showAnswer(){

document.getElementById("reading").style.display="block"
document.getElementById("meaning").style.display="block"

}
function answer(bucket){
function loadCard(){

let k=kanjiList[current]

document.getElementById("kanji").innerText=k.kanji
document.getElementById("reading").innerText="Reading: "+k.reading
document.getElementById("meaning").innerText="Meaning: "+k.meaning

document.getElementById("reading").style.display="none"
document.getElementById("meaning").style.display="none"

}
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
