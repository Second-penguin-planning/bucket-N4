let reviewList = []
let kanjiList = []
let current = 0

let username = ""
let today = ""


// --------------------
// 漢字データ読み込み
// --------------------
fetch("bucket-N4.json")
.then(res => res.json())
.then(data => {

    kanjiList = data
    loadCard()
    updateProgress()

})


// --------------------
// 今日の日付
// --------------------
function getToday(){

    return new Date().toISOString().slice(0,10)

}


// --------------------
// LocalStorageキー
// --------------------
function getStorageKey(){

    return "progress_" + username + "_" + today

}


// --------------------
// 復習カード作成
// --------------------
function buildReviewList(){

let key = getStorageKey()

let data = JSON.parse(localStorage.getItem(key)) || {}

let todayDate = getToday()

reviewList = []

for(let i=0;i<kanjiList.length;i++){

let k = kanjiList[i]

if(!data[k.kanji]){

reviewList.push(k)
continue

}

if(data[k.kanji].next <= todayDate){

reviewList.push(k)

}

}

current = 0

}


// --------------------
// Start
// --------------------
function startUser(){

username = document.getElementById("username").value

if(username===""){
alert("Please enter your name")
return
}

today = getToday()

enableButtons()

buildReviewList()
loadCard()
updateProgress()
updateBuckets()
updateScore()

}


// --------------------
// ボタン有効化
// --------------------
function enableButtons(){

document.getElementById("showBtn").disabled = false

document.querySelectorAll(".answerBtn").forEach(btn=>{
btn.disabled = false
})

}


// --------------------
// カード表示
// --------------------
function loadCard(){

if(reviewList.length === 0){

document.getElementById("kanji").innerText="All done today 🎉"
document.getElementById("reading").innerText=""
document.getElementById("meaning").innerText=""

return

}

let k = reviewList[current]

document.getElementById("kanji").innerText = k.kanji
document.getElementById("reading").innerText = "Reading: " + k.reading
document.getElementById("meaning").innerText = "Meaning: " + k.meaning

document.getElementById("reading").classList.add("hidden")
document.getElementById("meaning").classList.add("hidden")

}


// --------------------
// 答え表示
// --------------------
function showAnswer(){

document.getElementById("reading").classList.remove("hidden")
document.getElementById("meaning").classList.remove("hidden")

}


// --------------------
// 復習日数
// --------------------
function getReviewDays(bucket){

if(bucket == 4) return 0
if(bucket == 3) return 1
if(bucket == 2) return 3
if(bucket == 1) return 7

}


// --------------------
// 回答処理
// --------------------
function answer(bucket){

if(reviewList.length === 0) return

let k = reviewList[current]

let key = getStorageKey()

let data = JSON.parse(localStorage.getItem(key)) || {}

let days = getReviewDays(bucket)

let next = new Date()
next.setDate(next.getDate() + days)

data[k.kanji] = {

bucket: bucket,
next: next.toISOString().slice(0,10)

}

localStorage.setItem(key, JSON.stringify(data))

current++

if(current >= reviewList.length){

alert("Finished today's study!")

buildReviewList()

}

loadCard()
updateProgress()
updateBuckets()
updateScore()

}


// --------------------
// 進捗バー
// --------------------
function updateProgress(){

if(reviewList.length === 0){

document.getElementById("progressBar").style.width = "0%"
document.getElementById("progressText").innerText = "0 / 0"

return

}

let percent = (current / reviewList.length) * 100

document.getElementById("progressBar").style.width = percent + "%"

document.getElementById("progressText").innerText =
current + " / " + reviewList.length

}


// --------------------
// バケツ表示
// --------------------
function updateBuckets(){

let key = getStorageKey()

let data = JSON.parse(localStorage.getItem(key)) || {}

let b1 = []
let b2 = []
let b3 = []
let b4 = []

for(let k in data){

let bucket = data[k].bucket

if(bucket == 1) b1.push(k)
if(bucket == 2) b2.push(k)
if(bucket == 3) b3.push(k)
if(bucket == 4) b4.push(k)

}

document.getElementById("bucket1").innerText = b1.join(" ")
document.getElementById("bucket2").innerText = b2.join(" ")
document.getElementById("bucket3").innerText = b3.join(" ")
document.getElementById("bucket4").innerText = b4.join(" ")

}


// --------------------
// 正解率
// --------------------
function updateScore(){

let key = getStorageKey()

let data = JSON.parse(localStorage.getItem(key)) || {}

let total = 0
let correct = 0

for(let k in data){

total++

if(data[k].bucket == 1 || data[k].bucket == 2){

correct++

}

}

if(total == 0){

document.getElementById("score").innerText=""
return

}

let percent = Math.round((correct / total) * 100)

document.getElementById("score").innerText =
"Score: " + percent + "%"

}


// --------------------
// Teacher Mode
// --------------------
function showTeacher(){

let out = ""

for(let i = 0; i < localStorage.length; i++){

let key = localStorage.key(i)

if(key.startsWith("progress_")){

let data = JSON.parse(localStorage.getItem(key))

let total = Object.keys(data).length

out += "<p>" + key + " : " + total + " kanji</p>"

}

}

document.getElementById("teacher").innerHTML = out

}


// --------------------
// Swipe UI
// --------------------
window.onload = function(){

let startX=0
let startY=0

let card=document.getElementById("card")

card.addEventListener("touchstart",e=>{

startX=e.touches[0].clientX
startY=e.touches[0].clientY

})

card.addEventListener("touchend",e=>{

let endX=e.changedTouches[0].clientX
let endY=e.changedTouches[0].clientY

let dx=endX-startX
let dy=endY-startY

if(Math.abs(dx)>Math.abs(dy)){

if(dx>50) answer(1)
if(dx<-50) answer(3)

}else{

if(dy<-50) answer(2)
if(dy>50) answer(4)

}

})

}
function toggleHelp(){

let box = document.getElementById("helpBox")

if(box.classList.contains("hidden")){
box.classList.remove("hidden")
}else{
box.classList.add("hidden")
}

}
