let reviewList = [];
let kanjiList = [];
let current = 0;
let username = "";
let selectedLevel = "N4";


// --------------------
// 今日の日付
// --------------------
function getToday() {
    return new Date().toISOString().slice(0, 10);
}


// --------------------
// LocalStorageキー（レベルごとに分離）
// --------------------
function getStorageKey() {
    return "progress_" + username + "_" + selectedLevel;
}


// --------------------
// データ読み込み（レベル対応）
// --------------------
function loadData() {
    fetch(`bucket-${selectedLevel}.json`)
        .then(res => res.json())
        .then(data => {
            kanjiList = data;
            console.log("Loaded:", selectedLevel);

            buildReviewList();
            enableButtons();
            loadCard();
            updateProgress();
            updateBuckets();
            updateScore();
        })
        .catch(err => console.error("JSON load error:", err));
}


// --------------------
// 復習カード作成
// --------------------
function buildReviewList() {
    let key = getStorageKey();
    let data = JSON.parse(localStorage.getItem(key)) || {};
    let todayDate = getToday();

    reviewList = [];

    for (let i = 0; i < kanjiList.length; i++) {
        let k = kanjiList[i];

        if (!data[k.kanji] || data[k.kanji].next <= todayDate) {
            reviewList.push(k);
        }
    }
    current = 0;
}


// --------------------
// Start
// --------------------
function startUser() {
    username = document.getElementById("username").value;

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    selectedLevel = document.getElementById("level").value;

    loadData();
}


// --------------------
// ボタン有効化
// --------------------
function enableButtons() {
    document.getElementById("showBtn").disabled = false;

    document.querySelectorAll(".answerBtn").forEach(btn => {
        btn.disabled = false;
    });
}


// --------------------
// カード表示
// --------------------
function loadCard() {

    const kanjiEl = document.getElementById("kanji");
    const readingEl = document.getElementById("reading");
    const meaningEl = document.getElementById("meaning");

    if (reviewList.length === 0 || current >= reviewList.length) {
        kanjiEl.innerText = "All done today 🎉";
        readingEl.innerText = "";
        meaningEl.innerText = "";
        return;
    }

    let k = reviewList[current];

    kanjiEl.innerText = k.kanji;
    readingEl.innerText = "Reading: " + k.reading;
    meaningEl.innerText = "Meaning: " + k.meaning;

    readingEl.classList.add("hidden");
    meaningEl.classList.add("hidden");
}


// --------------------
// 答え表示
// --------------------
function showAnswer() {
    document.getElementById("reading").classList.remove("hidden");
    document.getElementById("meaning").classList.remove("hidden");
}


// --------------------
// 復習日数
// --------------------
function getReviewDays(bucket) {
    if (bucket == 1) return 7;
    if (bucket == 2) return 3;
    if (bucket == 3) return 1;
    if (bucket == 4) return 0;
}


// --------------------
// 回答処理
// --------------------
function answer(bucket) {
    if (reviewList.length === 0 || current >= reviewList.length) return;

    let k = reviewList[current];
    let key = getStorageKey();
    let data = JSON.parse(localStorage.getItem(key)) || {};

    let days = getReviewDays(bucket);
    let nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);

    data[k.kanji] = {
        bucket: bucket,
        next: nextDate.toISOString().slice(0, 10)
    };

    localStorage.setItem(key, JSON.stringify(data));

    current++;

    if (current >= reviewList.length) {
        alert("Finished today's study!");
    }

    loadCard();
    updateProgress();
    updateBuckets();
    updateScore();
}


// --------------------
// 進捗バー
// --------------------
function updateProgress() {

    if (reviewList.length === 0) {
        document.getElementById("progressBar").style.width = "0%";
        document.getElementById("progressText").innerText = "0 / 0";
        return;
    }

    let percent = (current / reviewList.length) * 100;

    document.getElementById("progressBar").style.width = percent + "%";
    document.getElementById("progressText").innerText =
        current + " / " + reviewList.length;
}


// --------------------
// バケツ表示
// --------------------
function updateBuckets() {

    let key = getStorageKey();
    let data = JSON.parse(localStorage.getItem(key)) || {};

    let b1 = [];
    let b2 = [];
    let b3 = [];
    let b4 = [];

    for (let k in data) {
        let bucket = data[k].bucket;

        if (bucket == 1) b1.push(k);
        if (bucket == 2) b2.push(k);
        if (bucket == 3) b3.push(k);
        if (bucket == 4) b4.push(k);
    }

    document.getElementById("bucket1").innerText = b1.join(" ");
    document.getElementById("bucket2").innerText = b2.join(" ");
    document.getElementById("bucket3").innerText = b3.join(" ");
    document.getElementById("bucket4").innerText = b4.join(" ");
}


// --------------------
// 正解率
// --------------------
function updateScore() {

    let key = getStorageKey();
    let data = JSON.parse(localStorage.getItem(key)) || {};

    let total = 0;
    let correct = 0;

    for (let k in data) {
        total++;
        if (data[k].bucket == 1 || data[k].bucket == 2) {
            correct++;
        }
    }

    if (total == 0) {
        document.getElementById("score").innerText = "";
        return;
    }

    let percent = Math.round((correct / total) * 100);

    document.getElementById("score").innerText =
        "Score: " + percent + "%";
}


// --------------------
// Teacher Mode
// --------------------
function showTeacher() {

    let out = "";

    for (let i = 0; i < localStorage.length; i++) {

        let key = localStorage.key(i);

        if (key.startsWith("progress_")) {

            let data = JSON.parse(localStorage.getItem(key));
            let total = Object.keys(data).length;

            out += "<p>" + key + " : " + total + " kanji</p>";
        }
    }

    document.getElementById("teacher").innerHTML = out;
}


// --------------------
// Swipe UI
// --------------------
window.onload = function () {

    let startX = 0;
    let startY = 0;

    let card = document.getElementById("card");

    card.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    card.addEventListener("touchend", e => {

        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;

        let dx = endX - startX;
        let dy = endY - startY;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 50) answer(1);
            if (dx < -50) answer(3);
        } else {
            if (dy < -50) answer(2);
            if (dy > 50) answer(4);
        }
    });
}


// --------------------
// ヘルプ表示
// --------------------
function toggleHelp() {

    let box = document.getElementById("helpBox");

    if (box.classList.contains("hidden")) {
        box.classList.remove("hidden");
    } else {
        box.classList.add("hidden");
    }
}
