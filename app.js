let kanjiList = []
let current = 0

let username = ""
let today = ""

// ----------------------
// データ読み込み
// ----------------------
fetch("bucket-N4.json")
.then(res => res.json())
.then(data => {
    kanjiList = data
    loadCard()
    updateProgress()
})

// ----------------------
// 今日の日付
// ----------------------
function getToday(){
    return new Date().toISOString().slice(0,10)
}

// ----------------------
// 保存キー
// ----------------------
function getStorageKey(){
    return "progress_" + username + "_" + today
}

// ----------------------
// ユーザー開始
// ----------------------
function startUser(){

    username = document.getElementById("username").value

    if(username === ""){
        alert("名前を入力してください")
        return
    }

    today = getToday()

    loadProgress()
}
function getReviewDays(bucket){

if(bucket==4) return 0
if(bucket==3) return 1
if(bucket==2) return 3
if(bucket==1) return 7

}
// ----------------------
// 保存データ読み込み
// ----------------------
function loadProgress(){

    let key = getStorageKey()

    let data = JSON.parse(localStorage.getItem(key)) || {}

    updateBuckets(data)

}

// ----------------------
// カード表示
// ----------------------
function loadCard(){

    if(kanjiList.length === 0) return

    let k = kanjiList[current]

    document.getElementById("kanji").innerText = k.kanji
    document.getElementById("reading").innerText = "Reading: " + k.reading
    document.getElementById("meaning").innerText = "Meaning: " + k.meaning

    document.getElementById("reading").classList.add("hidden")
    document.getElementById("meaning").classList.add("hidden")

}

// ----------------------
// 答え表示
// ----------------------
function showAnswer(){

    document.getElementById("reading").classList.remove("hidden")
    document.getElementById("meaning").classList.remove("hidden")

}

// ----------------------
// 回答処理
// ----------------------
function answer(bucket){

let k = kanjiList[current]

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

loadCard()
updateProgress()
updateBuckets()
updateScore()

}
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

if(total==0) return

let percent = Math.round((correct/total)*100)

document.getElementById("score").innerText =
"Score: " + percent + "%"

}
function showTeacher(){

let out=""

for(let key in localStorage){

if(key.startsWith("progress_")){

let data = JSON.parse(localStorage.getItem(key))

let total = Object.keys(data).length

out += "<p>"+key+" : "+total+" kanji</p>"

}

}

document.getElementById("teacher").innerHTML = out

}
// ----------------------
// 進捗バー
// ----------------------
function updateProgress(){

    if(kanjiList.length === 0) return

    let percent = (current / kanjiList.length) * 100

    document.getElementById("progressBar").style.width = percent + "%"

    document.getElementById("progressText").innerText =
        current + " / " + kanjiList.length

}

// ----------------------
// バケツ表示
// ----------------------
function updateBuckets(){

    let key = getStorageKey()

    let data = JSON.parse(localStorage.getItem(key)) || {}

    let b1 = []
    let b2 = []
    let b3 = []
    let b4 = []

    for(let k in data){

        if(data[k] == 1) b1.push(k)
        if(data[k] == 2) b2.push(k)
        if(data[k] == 3) b3.push(k)
        if(data[k] == 4) b4.push(k)

    }

    document.getElementById("bucket1").innerText = b1.join(" ")
    document.getElementById("bucket2").innerText = b2.join(" ")
    document.getElementById("bucket3").innerText = b3.join(" ")
    document.getElementById("bucket4").innerText = b4.join(" ")

}
