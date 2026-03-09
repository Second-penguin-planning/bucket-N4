let kanjiList = [];
let current;

fetch("kanji-n3.json")
.then(res => res.json())
.then(data => {

kanjiList = data;

loadProgress();

nextKanji();

});

function nextKanji(){

current = kanjiList[Math.floor(Math.random()*kanjiList.length)];

document.getElementById("kanji").innerText = current.kanji;

document.getElementById("reading").innerText = "";
document.getElementById("meaning").innerText = "";

updateBucketInfo();

}

function showAnswer(){

document.getElementById("reading").innerText = current.reading;

document.getElementById("meaning").innerText = current.meaning;

}

function correct(){

if(current.bucket < 5) current.bucket++;

saveProgress();

nextKanji();

}

function wrong(){

if(current.bucket > 1) current.bucket--;

saveProgress();

nextKanji();

}

function saveProgress(){

localStorage.setItem("kanjiProgress",JSON.stringify(kanjiList));

}

function loadProgress(){

let saved = localStorage.getItem("kanjiProgress");

if(saved){

kanjiList = JSON.parse(saved);

}

}

function updateBucketInfo(){

let buckets=[0,0,0,0,0];

kanjiList.forEach(k=>{

buckets[k.bucket-1]++;

});

document.getElementById("bucketInfo").innerText=

"Bucket1:"+buckets[0]+
"  Bucket2:"+buckets[1]+
"  Bucket3:"+buckets[2]+
"  Bucket4:"+buckets[3]+
"  Bucket5:"+buckets[4];

}
