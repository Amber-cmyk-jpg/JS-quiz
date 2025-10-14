// Full rewritten quiz.js — copy & paste to replace current file

// ---------------- VARIABLES ----------------
var startContainer = document.getElementById('start-container');
var quizContainer = document.getElementById('quiz-container');
var leaderboardContainer = document.getElementById('leaderboard-container');
var resultScreen = document.querySelector('.result-screen');
var playerNameInput = document.getElementById('player-name');
var startBtn = document.getElementById('start-btn');
var restartBtn = document.getElementById('restart-btn');
var playAgainBtn = document.getElementById('play-again-btn');
var leaderboardList = document.getElementById('leaderboard-list');
var greeting = document.getElementById('greeting');
var scoreEl = document.getElementById('score');
var trophyEl = document.querySelector('.result-screen .trophy');
var bgMusic = document.getElementById('bg-music');
var musicToggle = document.getElementById('music-toggle');
var timerCount = document.getElementById('timer-count');
var progress = document.querySelector('.progress');
var bgCanvas = document.getElementById('bg-canvas');
var bgCtx = bgCanvas && bgCanvas.getContext ? bgCanvas.getContext('2d') : null;
var lightningOverlay = document.getElementById('lightning-overlay');
var optionsContainer = document.getElementById('options');
var diffButtons = document.querySelectorAll('.diff-btn');

var musicVolume = 0.45;

// ---------------- CANVAS PARTICLES ----------------
function resizeCanvas() {
  if (!bgCanvas) return;
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

var particles = [];
if (bgCanvas && bgCtx) {
  for (var i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }
  function drawParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    for (var pIndex = 0; pIndex < particles.length; pIndex++) {
      var p = particles[pIndex];
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      bgCtx.fillStyle = 'rgba(255,255,255,0.6)';
      bgCtx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x > bgCanvas.width) p.x = 0;
      if (p.x < 0) p.x = bgCanvas.width;
      if (p.y > bgCanvas.height) p.y = 0;
      if (p.y < 0) p.y = bgCanvas.height;
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ---------------- QUESTION SETS ----------------
var beginnerQuestions = [
  { q:"Which keyword declares a variable in JavaScript?", options:["const","let","var","All of the above"], answer:3 },
  { q:"How do you write a single-line comment?", options:["<!-- -->","# comment","// comment","/* comment */"], answer:2 },
  { q:"What is the type of 'Hello'?", options:["String","Number","Boolean","Object"], answer:0 },
  { q:"Which operator is used for assignment?", options:["==","=","===","=>"], answer:1 },
  { q:"What does console.log() do?", options:["Prints to console","Opens console","Alerts page","Closes console"], answer:0 },
  { q:"Which terminates a statement usually?", options:[";","|",",","."], answer:0 },
  { q:"Which converts a string to integer?", options:["Number()","parseInt()","toInteger()","parse()"], answer:1 },
  { q:"What is NaN short for?", options:["Not a Number","Null and Null","Name and Number","No a Number"], answer:0 },
  { q:"Which method adds to end of array?", options:["pop()","push()","shift()","unshift()"], answer:1 },
  { q:"How to check type of a variable?", options:["typeOf","typeof","getType","typeof()"], answer:1 },
  { q:"Which is falsy value?", options:["1","'0'","0","'false'"], answer:2 },
  { q:"How to declare a function named f?", options:["function f(){}","def f(){}","func f(){}","f function(){}"], answer:0 },
  { q:"Which is used to create objects?", options:["{}","[]","()","<>"], answer:0 },
  { q:"What does === check?", options:["Value only","Type only","Value and type","Reference"], answer:2 },
  { q:"Which converts object to JSON string?", options:["JSON.parse","JSON.stringify","toJSON","toString"], answer:1 },
  { q:"Which gets length of array a?", options:["a.len","a.length","length(a)","a.size"], answer:1 },
  { q:"Which loops over array elements?", options:["for","foreach","while","for...of"], answer:3 },
  { q:"Which accesses first array element a?", options:["a[0]","a.first","a(0)","a.get(0)"], answer:0 },
  { q:"Which method removes first element?", options:["pop()","shift()","splice(0,1)","slice(1)"], answer:1 },
  { q:"Which keyword prevents reassignment?", options:["let","const","var","static"], answer:1 }
];

var intermediateQuestions = [
  { q:"What will console.log(typeof typeof 1) print?", options:["'number'","'string'","'object'","'undefined'"], answer:1 },
  { q:"What is a closure?", options:["Function that returns another function","Function with access to outer scope","A loop pattern","A type of object"], answer:1 },
  { q:"What does Array.from('abc') return?", options:["['a','b','c']","'abc'","['abc']","undefined"], answer:0 },
  { q:"Which method filters elements?", options:["map()","filter()","reduce()","forEach()"], answer:1 },
  { q:"What does Object.assign({}, obj) do?", options:["Deep clone","Shallow copy properties","Delete properties","Freeze object"], answer:1 },
  { q:"What does Promise.all([...]) return?", options:["First resolved","Promise that resolves when all resolve","Array immediately","Undefined"], answer:1 },
  { q:"Which operator spreads elements?", options:["..","...",".","spread()"], answer:1 },
  { q:"Which returns index of item or -1?", options:["find()","filter()","indexOf()","includes()"], answer:2 },
  { q:"What does 'use strict' do?", options:["No difference","Enables stricter parsing/runtime checks","Disables JS","Makes code faster"], answer:1 },
  { q:"Which converts string to number safely?", options:["+str","Number(str)","parseInt(str)","All of the above"], answer:3 },
  { q:"What value typeof null returns?", options:["'null'","'object'","'undefined'","'value'"], answer:1 },
  { q:"How to create an arrow function?", options:["() => {}", "function => {}", "=> function {}", "fn => ()"], answer:0 },
  { q:"Which array method returns a single value?", options:["map()","filter()","reduce()","forEach()"], answer:2 },
  { q:"What does event delegation help with?", options:["Performance by using single handler on parent","Makes events async","Copies events","Stops events"], answer:0 },
  { q:"What is the purpose of try/catch?", options:["Looping","Error handling","Variable declaration","Promise resolution"], answer:1 },
  { q:"What does JSON.parse do?", options:["Parse JSON string to object","Stringify object","Clone object","Validate JSON only"], answer:0 },
  { q:"Which method checks if array contains value?", options:["indexOf()","includes()","find()","some()"], answer:1 },
  { q:"Which keyword creates block scope?", options:["var", "let","function","const"], answer:1 },
  { q:"What is hoisting in JS?", options:["Variables and functions moved to top of scope at runtime","IO operation","Network request","Compiler optimization"], answer:0 },
  { q:"Which creates generator function?", options:["function* name() {}", "async function name() {}", "gen function() {}", "function^ name() {}"], answer:0 }
];

var advancedQuestions = [
  { q:"What does [1,2,3].map(parseInt) produce?", options:["[1,2,3]","[NaN, NaN, NaN]","[1, NaN, NaN]","[1,2,3] with parseInt applied"], answer:2 },
  { q:"Which returns first resolved/rejected in Promise.race?", options:["All resolved array","First settled promise","Never resolves","Array of results"], answer:1 },
  { q:"What is tail call optimization?", options:["Optimization that reuses stack for tail calls","Loop optimization","Nothing in JS","Error handling"], answer:0 },
  { q:"What is the result of 0.1+0.2===0.3?", options:["true","false","TypeError","undefined"], answer:1 },
  { q:"Which structure allows weakly-held keys?", options:["Map","Object","WeakMap","Set"], answer:2 },
  { q:"How to implement module import default?", options:["import X from 'm';","require('m')","import {X} from 'm';","export default X;"], answer:0 },
  { q:"What is event loop's microtask queue used for?", options:["setTimeout callbacks","Promise callbacks (then/catch)","Rendering only","IO only"], answer:1 },
  { q:"Which returns iterator for object entries?", options:["Object.entries(obj)","Object.keys(obj)","Object.values(obj)","obj.entries()"], answer:0 },
  { q:"How to deep clone object with functions not lost?", options:["structuredClone","JSON.parse(JSON.stringify())","Object.assign","slice()"], answer:0 },
  { q:"Which method prevents function from being called too often (throttle)?", options:["debounce","throttle","delay","bind"], answer:1 },
  { q:"What is proxy used for?", options:["Intercept operations on objects","Proxy server","Performance boost","Style manipulation"], answer:0 },
  { q:"Which makes code run asynchronously but sequentially (async/await)?", options:["Promise chaining","async/await","callbacks only","EventEmitter"], answer:1 },
  { q:"What does Reflect.apply do?", options:["Applies function with arguments array","Reflects object keys","Creates new reflect object","No such method"], answer:0 },
  { q:"What will 'this' be inside arrow function created inside object method?", options:["Lexical 'this' from outer scope","Object itself","Window/global","Undefined"], answer:0 },
  { q:"Which allows zero-copy transfer between threads (Web Workers)?", options:["SharedArrayBuffer","JSON","postMessage string","localStorage"], answer:0 },
  { q:"What is currying?", options:["Transform function with multiple args into chain of single-arg functions","Optimization","Cloning","Promise pattern"], answer:0 },
  { q:"Which avoids main-thread blocking for heavy computation?", options:["Web Worker","setTimeout","requestAnimationFrame","localStorage"], answer:0 },
  { q:"What is Symbol() used for?", options:["Unique property keys","String conversion","Number conversion","Array indexing"], answer:0 },
  { q:"Which detects engine-specific features safely?", options:["Feature detection","Browser sniffing","UA string parse","Hardcode"], answer:0 },
  { q:"Which is the best practice for memory leaks?", options:["Remove unused references, deregister events", "Ignore", "Keep global references", "Over-allocate"], answer:0 }
];

function pick20(pool) {
  return pool.slice().sort(function(){ return 0.5 - Math.random(); }).slice(0, 20);
}

// ---------------- STATE ----------------
var questions = [];
var currentQuestion = 0;
var score = 0;
var totalTime = 20 * 60;
var timeLeft = totalTime;
var timerInterval = null;
var highlightedOptionIndex = 0;
var keyboardEnabled = false;
var selectedDifficulty = localStorage.getItem('difficulty') || 'mixed';

// ---------------- UTILITIES ----------------
function formatTime(s) {
  var m = Math.floor(s / 60);
  var sec = s % 60;
  return m + ":" + (sec < 10 ? '0' : '') + sec;
}
function saveProgress() {
  try {
    var name = localStorage.getItem('currentPlayer');
    if (!name) return;
    var data = { name: name, score: score, currentQuestion: currentQuestion, timeLeft: timeLeft, difficulty: localStorage.getItem('difficulty') };
    localStorage.setItem('quizProgress', JSON.stringify(data));
  } catch (e) {}
}
function loadSavedProgressFor(name) {
  try {
    var saved = JSON.parse(localStorage.getItem('quizProgress'));
    if (saved && saved.name === name && typeof saved.currentQuestion === 'number') return saved;
  } catch (e) {}
  return null;
}

// ---------------- UI: difficulty buttons ----------------
diffButtons.forEach(function(btn) {
  btn.addEventListener('click', function() {
    diffButtons.forEach(function(b){ b.classList.remove('selected'); });
    this.classList.add('selected');
    selectedDifficulty = this.dataset.diff;
  });
  if (btn.dataset.diff === selectedDifficulty) btn.classList.add('selected');
});

// ---------------- SHOW QUESTION ----------------
function clearOptionHighlights() {
  var opts = document.querySelectorAll('.option-btn');
  for (var i = 0; i < opts.length; i++) {
    var el = opts[i];
    el.classList.remove('selected-by-keyboard');
    el.style.outline = '';
    el.style.boxShadow = '';
    el.setAttribute('aria-selected', 'false');
  }
}
function visuallyHighlightOption(index) {
  clearOptionHighlights();
  var opts = document.querySelectorAll('.option-btn');
  if (!opts || opts.length === 0) return;
  index = ((index % opts.length) + opts.length) % opts.length;
  highlightedOptionIndex = index;
  var el = opts[index];
  el.classList.add('selected-by-keyboard');
  el.style.outline = '3px solid rgba(0,255,150,0.9)';
  el.style.boxShadow = '0 10px 30px rgba(0,255,150,0.12)';
  el.setAttribute('aria-selected', 'true');
  el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function showQuestion() {
  if (currentQuestion >= questions.length) { showResult(); return; }
  var q = questions[currentQuestion];
  var qEl = document.getElementById('question');
  if (qEl) qEl.textContent = (currentQuestion + 1) + ". " + q.q;
  if (optionsContainer) optionsContainer.innerHTML = '';
  q.options.forEach(function(opt, idx) {
    var li = document.createElement('li');
    li.textContent = opt;
    li.className = 'option-btn';
    li.setAttribute('role','button');
    li.setAttribute('data-index', idx);
    li.style.animationDelay = (idx * 0.06) + 's';
    li.onclick = function(){ selectAnswer(idx); };
    li.addEventListener('mouseenter', function(){ highlightedOptionIndex = idx; visuallyHighlightOption(idx); });
    optionsContainer.appendChild(li);
  });
  highlightedOptionIndex = 0;
  visuallyHighlightOption(0);
  keyboardEnabled = true;
  saveProgress();
}

// ---------------- SELECT ANSWER ----------------
function selectAnswer(idx) {
  var correct = questions[currentQuestion].answer;
  var options = Array.prototype.slice.call(document.querySelectorAll('.option-btn'));
  keyboardEnabled = false;
  for (var i = 0; i < options.length; i++) options[i].onclick = null;
  if (lightningOverlay) {
    lightningOverlay.classList.add('lightning-flash');
    setTimeout(function(){ lightningOverlay.classList.remove('lightning-flash'); }, 350);
  }
  if (idx === correct) {
    score++;
    if (options[idx]) options[idx].classList.add('correct');
    launchMiniConfetti(idx);
  } else {
    if (options[idx]) options[idx].classList.add('wrong');
    if (options[correct]) options[correct].classList.add('correct');
  }
  setTimeout(function(){
    currentQuestion++;
    showQuestion();
  }, 650);
}

// ---------------- TIMER ----------------
function startTimer() {
  updateTimerDisplay(timeLeft);
  if (progress) progress.style.width = (timeLeft / totalTime * 100) + "%";
  clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    timeLeft--;
    updateTimerDisplay(timeLeft);
    if (progress) progress.style.width = (timeLeft / totalTime * 100) + "%";
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    } else {
      saveProgress();
    }
  }, 1000);
}
function updateTimerDisplay(s) { if (timerCount) timerCount.textContent = formatTime(s); }

// ---------------- CONFETTI ----------------
function launchMiniConfetti(optionIndex) {
  var optionBtn = document.querySelectorAll('.option-btn')[optionIndex];
  if (!optionBtn) return;
  var rect = optionBtn.getBoundingClientRect();
  for (var i = 0; i < 22; i++) {
    var c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = (rect.left + Math.random()*rect.width) + 'px';
    c.style.top = (rect.top + Math.random()*rect.height) + 'px';
    c.style.backgroundColor = 'hsl(' + (Math.random()*360) + ',80%,60%)';
    var size = 4 + Math.random()*6;
    c.style.width = c.style.height = size + 'px';
    c.style.animationDuration = (0.8 + Math.random()*1) + 's';
    document.body.appendChild(c);
    setTimeout((function(el){ return function(){ el.remove(); }; })(c), 1500);
  }
}
function launchFullConfetti(){
  for (var i = 0; i < 150; i++){
    var c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = (Math.random()*100) + 'vw';
    c.style.backgroundColor = 'hsl(' + (Math.random()*360) + ',80%,60%)';
    c.style.animationDuration = (1 + Math.random()*3) + 's';
    document.body.appendChild(c);
    setTimeout((function(el){ return function(){ el.remove(); }; })(c), 3500);
  }
}

// ---------------- LEADERBOARD ----------------
function updateLeaderboard(name, playerScore, difficulty) {
  if (!name) name = localStorage.getItem('currentPlayer') || 'Player';
  if (typeof playerScore !== 'number') playerScore = parseInt(playerScore, 10) || 0;
  if (!difficulty) difficulty = localStorage.getItem('difficulty') || 'beginner';

  var key = "leaderboard_" + difficulty;
  var lastKey = "leaderboard_last_" + difficulty;
  var ts = Date.now();

  var lb = [];
  try { lb = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { lb = []; }

  lb.push({ name: name, score: playerScore, ts: ts });

  lb.sort(function(a, b) {
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    return (b.ts || 0) - (a.ts || 0);
  });

  var top = lb.slice(0, 5);
  try { localStorage.setItem(key, JSON.stringify(top)); } catch (e) {}

  try { localStorage.setItem(lastKey, JSON.stringify({ name: name, score: playerScore, ts: ts })); } catch (e) {}

  try { localStorage.setItem("newHighScore", name); } catch (e) {}

  var isTop = false;
  if (top.length > 0) {
    if (top[0].name === name && top[0].score === playerScore && top[0].ts === ts) isTop = true;
    if (!isTop && top[0].name === name && top[0].score === playerScore) isTop = true;
  }
  return isTop;
}

function renderLeaderboard(difficulty) {
  difficulty = difficulty || localStorage.getItem('difficulty') || 'beginner';

  leaderboardList = document.getElementById('leaderboard-list');
  if (!leaderboardList) {
    if (!leaderboardContainer) {
      leaderboardContainer = document.getElementById('leaderboard-container') || document.createElement('div');
      leaderboardContainer.id = 'leaderboard-container';
      document.body.appendChild(leaderboardContainer);
    }
    leaderboardList = document.createElement('ol');
    leaderboardList.id = 'leaderboard-list';
    leaderboardContainer.appendChild(leaderboardList);
  }

  leaderboardList.innerHTML = '';

  var lbKey = 'leaderboard_' + difficulty;
  var lastKey = 'leaderboard_last_' + difficulty;
  var lb = [];
  try { lb = JSON.parse(localStorage.getItem(lbKey) || '[]'); } catch (e) { lb = []; }

  lb.sort(function(a, b){
    if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
    return (b.ts || 0) - (a.ts || 0);
  });

  var MAX = 5;
  var newHighName = localStorage.getItem('newHighScore') || '';
  var currentPlayer = localStorage.getItem('currentPlayer') || '';

  for (var i = 0; i < MAX; i++) {
    var e = lb[i];
    var li = document.createElement('li');
    li.classList.add('leader-item');
    li.style.animationDelay = (i * 0.06) + 's';

    var crown = '';
    if (i === 0) crown = '<span class="crown gold">👑</span>';
    else if (i === 1) crown = '<span class="crown silver">🥈</span>';
    else if (i === 2) crown = '<span class="crown bronze">🥉</span>';

    if (e && e.name) {
      li.innerHTML = '<span class="rank">' + crown + ' #' + (i + 1) + '</span>' +
                     '<span class="player-name">' + e.name + '</span>' +
                     '<span class="player-score">' + e.score + '</span>';
      if (e.name === newHighName || e.name === currentPlayer) {
        li.classList.add('new-high-score');
        li.style.boxShadow = '0 0 20px 2px #00ff88, 0 0 35px 4px #00cfff';
      }
    } else {
      li.innerHTML = '<span class="rank">#' + (i + 1) + '</span>' +
                     '<span class="player-name">—</span>' +
                     '<span class="player-score">0</span>';
      li.style.opacity = '0.6';
    }
    leaderboardList.appendChild(li);
  }

  try {
    var last = JSON.parse(localStorage.getItem(lastKey) || 'null');
    if (last && last.name) {
      var inTop = lb.some(function(item){ return item.name === last.name && item.score === last.score && item.ts === last.ts; });
      if (!inTop) {
        var sep = document.createElement('li');
        sep.className = 'leader-item';
        sep.style.opacity = '0.5';
        sep.style.marginTop = '14px';
        sep.innerHTML = '<span class="player-name">Your score</span>';
        leaderboardList.appendChild(sep);

        var li = document.createElement('li');
        li.classList.add('leader-item', 'new-high-score');
        li.style.boxShadow = '0 0 18px 2px rgba(0,255,136,0.25)';
        li.style.marginTop = '6px';
        li.innerHTML = '<span class="rank">#</span>' +
                       '<span class="player-name">' + last.name + ' <small style="opacity:.7; font-weight:600; margin-left:8px;">(you)</small></span>' +
                       '<span class="player-score">' + last.score + '</span>';
        leaderboardList.appendChild(li);
      }
    }
  } catch (e) {}

  try { localStorage.removeItem('newHighScore'); } catch (e) {}
}

function showLeaderboard(difficulty, celebrate) {
  if (typeof celebrate === 'undefined') celebrate = false;
  difficulty = difficulty || localStorage.getItem('difficulty') || 'beginner';

  if (!leaderboardContainer) {
    leaderboardContainer = document.getElementById('leaderboard-container') || document.createElement('div');
    leaderboardContainer.id = 'leaderboard-container';
    document.body.appendChild(leaderboardContainer);
  }

  leaderboardList = document.getElementById('leaderboard-list');
  if (!leaderboardList) {
    leaderboardList = document.createElement('ol');
    leaderboardList.id = 'leaderboard-list';
    leaderboardContainer.appendChild(leaderboardList);
  }

  if (startContainer) startContainer.style.display = 'none';
  if (quizContainer) quizContainer.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'none';
  leaderboardContainer.style.display = 'block';

  try { if (trophyEl) trophyEl.style.display = 'none'; } catch (e) {}
  try { if (restartBtn) restartBtn.style.display = 'none'; } catch (e) {}

  renderLeaderboard(difficulty);

  if (playAgainBtn) playAgainBtn.style.display = 'inline-block';

  if (celebrate) {
    try { launchFullConfetti(); } catch (e) {}
  }
}

// ...existing code...

// ---------------- CELEBRATION (15s) ----------------
var _celebrationInterval = null;
function startLongCelebration(durationMs) {
  try { launchFullConfetti(); } catch (e) {}
  if (_celebrationInterval) clearInterval(_celebrationInterval);
  _celebrationInterval = setInterval(function(){ try { launchFullConfetti(); } catch (e) {} }, 1200);
  setTimeout(function(){ if (_celebrationInterval) { clearInterval(_celebrationInterval); _celebrationInterval = null; } }, durationMs);
}

// ---------------- SHOW RESULT ----------------
function showResult() {
  clearInterval(timerInterval);

  if (quizContainer) quizContainer.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'block';

  var playerName = (playerNameInput && playerNameInput.value.trim()) || localStorage.getItem('currentPlayer') || 'Player';
  try { localStorage.setItem('currentPlayer', playerName); } catch (e) {}

  var difficulty = localStorage.getItem('difficulty') || 'beginner';

  var isTop = updateLeaderboard(playerName, score, difficulty);

  if (greeting) greeting.textContent = 'Well done, ' + playerName + '!';
  if (scoreEl) scoreEl.textContent = 'Score: ' + score + ' / ' + questions.length;
  try { if (trophyEl) { trophyEl.style.display = 'block'; trophyEl.classList.add('celebrate'); } } catch (e) {}
  try { if (restartBtn) restartBtn.style.display = 'none'; } catch (e) {}

  var celebrate = !!isTop || (score === questions.length);
  if (celebrate) {
    try { startLongCelebration(7000); } catch (e) {} 
  }

  setTimeout(function(){
    showLeaderboard(difficulty, false);
  }, 7000);
}

// ...existing code...

// ---------------- START HANDLER ----------------
startBtn.onclick = function() {
  var name = playerNameInput && playerNameInput.value.trim();
  if (!name) { alert('Enter your name to start!'); return; }

  var selected = selectedDifficulty || (document.querySelector('.diff-btn.selected') || {}).dataset && (document.querySelector('.diff-btn.selected') || {}).dataset.diff;
  if (!selected) selected = 'mixed';
  localStorage.setItem('difficulty', selected);

  if (selected === 'beginner') questions = pick20(beginnerQuestions);
  else if (selected === 'intermediate') questions = pick20(intermediateQuestions);
  else if (selected === 'advanced') questions = pick20(advancedQuestions);
  else questions = pick20(beginnerQuestions.concat(intermediateQuestions));

  var saved = loadSavedProgressFor(name);
  if (saved && saved.difficulty === selected && saved.currentQuestion < questions.length) {
    if (confirm('Resume your last quiz progress?')) {
      currentQuestion = saved.currentQuestion;
      score = saved.score;
      timeLeft = saved.timeLeft;
    } else {
      localStorage.removeItem('quizProgress');
      currentQuestion = 0; score = 0; timeLeft = totalTime;
    }
  } else {
    currentQuestion = 0; score = 0; timeLeft = totalTime;
  }

  try { localStorage.setItem('currentPlayer', name); } catch (e) {}
  if (startContainer) startContainer.style.display = 'none';
  if (quizContainer) quizContainer.style.display = 'block';

  try { fadeInMusic(); } catch (e) {}
  startTimer();
  showQuestion();
};

// ---------------- AMBIENT LIGHTNING ----------------
setInterval(function(){
  try {
    if (quizContainer && quizContainer.style.display === 'block' && Math.random() > 0.78 && lightningOverlay) {
      lightningOverlay.classList.add('lightning-flash');
      setTimeout(function(){ lightningOverlay.classList.remove('lightning-flash'); }, 400);
    }
  } catch (e) {}
}, 16000);

// ---------------- SOCIAL SHARE ----------------
function shareSocial(platform){
  var text = 'I scored ' + score + ' in Lightning Quiz! Try to beat me! ⚡';
  var url = '';
  if (platform === 'whatsapp') url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
  else if (platform === 'twitter') url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
  else if (platform === 'facebook') url = 'https://www.facebook.com/sharer/sharer.php?u=&quote=' + encodeURIComponent(text);
  window.open(url, '_blank');
}
var wa = document.getElementById('whatsapp-share');
var tw = document.getElementById('twitter-share');
var fb = document.getElementById('facebook-share');
if (wa) wa.onclick = function(){ shareSocial('whatsapp'); };
if (tw) tw.onclick = function(){ shareSocial('twitter'); };
if (fb) fb.onclick = function(){ shareSocial('facebook'); };

// ---------------- KEYBOARD NAVIGATION ----------------
document.addEventListener('keydown', function(e){
  if (!keyboardEnabled) return;
  var key = e.key;
  var opts = document.querySelectorAll('.option-btn');
  if (!opts || opts.length === 0) return;
  if (key === 'ArrowUp' || key === 'w' || key === 'W') {
    e.preventDefault();
    highlightedOptionIndex = (highlightedOptionIndex - 1 + opts.length) % opts.length;
    visuallyHighlightOption(highlightedOptionIndex);
    return;
  }
  if (key === 'ArrowDown' || key === 's' || key === 'S') {
    e.preventDefault();
    highlightedOptionIndex = (highlightedOptionIndex + 1) % opts.length;
    visuallyHighlightOption(highlightedOptionIndex);
    return;
  }
  if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
    e.preventDefault();
    var idx = highlightedOptionIndex;
    if (opts[idx]) opts[idx].click();
    return;
  }
});
var uiObserver = new MutationObserver(function(){ keyboardEnabled = (quizContainer && quizContainer.style.display === 'block'); });
if (quizContainer) uiObserver.observe(quizContainer, { attributes:true, attributeFilter:['style'] });

// ---------------- MUSIC (simple + safe) ----------------
(function(){
  var audio = bgMusic;
  var toggle = musicToggle;
  var MUSIC_KEY = 'quiz_music_vol';
  var ON_KEY = 'quiz_music_on';
  var targetVol = musicVolume || 0.45;
  if (!audio) { if (toggle) toggle.style.display = 'none'; return; }

  try {
    var saved = parseFloat(localStorage.getItem(MUSIC_KEY));
    if (!isNaN(saved)) targetVol = saved;
  } catch (e) {}

  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;

  audio.addEventListener('error', function(){
    var local = 'assets/audio/bg-music.mp3';
    if (!audio.src || audio.src.indexOf(local) === -1) {
      audio.src = local; audio.load();
    } else { if (toggle) toggle.style.display = 'none'; }
  });

  function fadeTo(target, duration) {
    if (!audio) return;
    audio.play().catch(function(){});
    var step = 50;
    var steps = Math.max(1, Math.round(duration / step));
    var diff = (target - audio.volume) / steps;
    var i = 0;
    var iv = setInterval(function(){
      i++;
      audio.volume = Math.max(0, Math.min(1, audio.volume + diff));
      if (i >= steps) { clearInterval(iv); if (audio.volume === 0) audio.pause(); }
    }, step);
  }
  window.fadeInMusic = function(target, duration){
    try { localStorage.setItem(MUSIC_KEY, String(target || targetVol)); localStorage.setItem(ON_KEY, '1'); } catch (e) {}
    if (toggle) { toggle.classList.add('active'); toggle.setAttribute('aria-pressed','true'); toggle.innerText = '🔊'; }
    fadeTo(typeof target === 'number' ? target : targetVol, duration || 900);
  };
  window.fadeOutMusic = function(duration){
    try { localStorage.setItem(ON_KEY, '0'); } catch (e) {}
    if (toggle) { toggle.classList.remove('active'); toggle.setAttribute('aria-pressed','false'); toggle.innerText = '🔈'; }
    fadeTo(0, duration || 600);
  };

  if (toggle) {
    toggle.addEventListener('click', function(e){
      e.preventDefault();
      if (audio.paused || audio.volume === 0) window.fadeInMusic();
      else window.fadeOutMusic();
    });
    try {
      var wasOn = localStorage.getItem(ON_KEY) === '1';
      toggle.setAttribute('aria-pressed', wasOn ? 'true' : 'false');
      toggle.innerText = wasOn ? '🔊' : '🔈';
      toggle.classList.toggle('active', wasOn);
    } catch (e) {}
  }

  if (startBtn) {
    startBtn.addEventListener('click', function(){ var previouslyOn = localStorage.getItem('quiz_music_on') === '1'; window.fadeInMusic(previouslyOn ? targetVol : targetVol); }, { once: true });
  }
})();

// Safe autoplay after first explicit click
document.addEventListener('click', function enableMusicOnce() { try { window.fadeInMusic(); } catch (e) {} document.removeEventListener('click', enableMusicOnce); });

// ---------------- RESET / PLAY AGAIN ----------------
function resetToStart(){
  if (quizContainer) quizContainer.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'none';
  if (leaderboardContainer) leaderboardContainer.style.display = 'none';
  if (startContainer) startContainer.style.display = 'block';
  if (playerNameInput) playerNameInput.value = '';
  currentQuestion = 0; score = 0; timeLeft = totalTime;
  if (progress) progress.style.width = '100%';
  if (timerCount) timerCount.textContent = formatTime(totalTime);
  keyboardEnabled = false;
  diffButtons.forEach(function(btn){ btn.classList.remove('selected'); });
  var storedDiff = localStorage.getItem('difficulty') || 'beginner';
  var btnToSelect = document.querySelector('.diff-btn[data-diff="' + storedDiff + '"]');
  if (btnToSelect) btnToSelect.classList.add('selected');
  selectedDifficulty = storedDiff;
}
if (restartBtn) restartBtn.onclick = resetToStart;

function playAgainNewDifficulty(){
  if (quizContainer) quizContainer.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'none';
  if (leaderboardContainer) leaderboardContainer.style.display = 'none';
  if (startContainer) startContainer.style.display = 'block';
  var storedName = localStorage.getItem('currentPlayer') || '';
  if (playerNameInput) playerNameInput.value = storedName;
  currentQuestion = 0; score = 0; timeLeft = totalTime;
  if (progress) progress.style.width = '100%';
  if (timerCount) timerCount.textContent = formatTime(totalTime);
  keyboardEnabled = false;
  diffButtons.forEach(function(btn){ btn.classList.remove('selected'); });
  selectedDifficulty = null;
}
if (playAgainBtn) playAgainBtn.onclick = playAgainNewDifficulty;

// ---------------- INITIAL UI STATE ----------------
try { if (timerCount) timerCount.textContent = formatTime(totalTime); } catch (e) {}
try { if (progress) progress.style.width = '100%'; } catch (e) {}
try { renderLeaderboard(localStorage.getItem('difficulty') || 'beginner'); } catch (e) {}
// ---------------- INIT DIFFICULTY ----------------
function selectDifficulty(level) {
  localStorage.setItem('difficulty', level);
}

// ---------------- RESET TO START ----------------
function resetToStart(){
  if (quizContainer) quizContainer.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'none';
  if (leaderboardContainer) leaderboardContainer.style.display = 'none';
  if (startContainer) startContainer.style.display = 'block';
  playerNameInput.value = '';
  currentQuestion = 0; score = 0; timeLeft = totalTime;
  if (progress) progress.style.width = "100%";
  if (timerCount) timerCount.textContent = formatTime(totalTime);
  keyboardEnabled = false;
  diffButtons.forEach(btn => btn.classList.remove('selected'));
  var storedDiff = localStorage.getItem('difficulty') || 'beginner';
  var btnToSelect = document.querySelector(`.diff-btn[data-diff="${storedDiff}"]`);
  if(btnToSelect) btnToSelect.classList.add('selected');
  selectedDifficulty = storedDiff;
}
restartBtn.onclick = resetToStart;
function playAgainNewDifficulty(){
  if (quizContainer) quizContainer.style.display = 'none';
  if (resultScreen) resultScreen.style.display = 'none';
  if (leaderboardContainer) leaderboardContainer.style.display = 'none';
  if (startContainer) startContainer.style.display = 'block';
  var storedName = localStorage.getItem('currentPlayer') || '';
  playerNameInput.value = storedName;
  currentQuestion = 0; score = 0; timeLeft = totalTime;
  if (progress) progress.style.width = "100%";
  if (timerCount) timerCount.textContent = formatTime(totalTime);
  keyboardEnabled = false;
  diffButtons.forEach(btn => btn.classList.remove('selected'));
  selectedDifficulty = null;
}
playAgainBtn.onclick = playAgainNewDifficulty;

// ---------------- MUSIC MODULE (safe) ----------------
(function(){
  var audio = bgMusic;
  var toggle = musicToggle;
  var MUSIC_KEY = 'quiz_music_vol';
  var ON_KEY = 'quiz_music_on';
  var DEFAULT_VOL = musicVolume || 0.45;
  var targetVol = DEFAULT_VOL;

  if (!audio) { if (toggle) toggle.style.display='none'; return; }

  try {
    var saved = parseFloat(localStorage.getItem(MUSIC_KEY));
    if (!isNaN(saved)) targetVol = saved;
  } catch(e){}

  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0;

  audio.addEventListener('error', function() {
    var local = 'assets/audio/bg-music.mp3';
    if (!audio.src || !audio.src.includes(local)) {
      audio.src = local;
      audio.load();
    } else { if (toggle) toggle.style.display='none'; }
  });

  function fadeTo(target, duration){
    if (!audio) return;
    audio.play().catch(function(err){ console.warn('Music play blocked:', err); });
    var step = 50;
    var steps = Math.max(1, Math.round(duration/step));
    var diff = (target - audio.volume) / steps;
    var i = 0;
    var iv = setInterval(function(){
      i++; audio.volume = Math.max(0, Math.min(1, audio.volume + diff));
      if (i >= steps){ clearInterval(iv); if (audio.volume === 0) audio.pause(); }
    }, step);
  }
  function fadeInMusic(target, duration){
    try { localStorage.setItem(MUSIC_KEY, String(target)); localStorage.setItem(ON_KEY, '1'); } catch(e){}
    if (toggle) { toggle.classList.add('active'); toggle.setAttribute('aria-pressed','true'); toggle.innerText = '🔊'; }
    fadeTo(typeof target === 'number' ? target : targetVol, duration || 900);
  }
  function fadeOutMusic(duration){
    try { localStorage.setItem(ON_KEY, '0'); } catch(e){}
    if (toggle) { toggle.classList.remove('active'); toggle.setAttribute('aria-pressed','false'); toggle.innerText = '🔈'; }
    fadeTo(0, duration || 600);
  }

  if (toggle) {
    toggle.addEventListener('click', function(e){
      e.preventDefault();
      if (audio.paused || audio.volume === 0) fadeInMusic(targetVol);
      else fadeOutMusic();
    });
    try {
      var wasOn = localStorage.getItem(ON_KEY) === '1';
      toggle.setAttribute('aria-pressed', wasOn ? 'true' : 'false');
      toggle.innerText = wasOn ? '🔊' : '🔈';
      toggle.classList.toggle('active', wasOn);
    } catch(e){}
  }
  if (startBtn) {
    startBtn.addEventListener('click', function(){ 
      var previouslyOn = localStorage.getItem(ON_KEY) === '1';
      fadeInMusic(previouslyOn ? targetVol : targetVol);
    }, { once: true });
  }

  window.quizMusic = { fadeIn: () => fadeInMusic(targetVol), fadeOut: fadeOutMusic, setVolume: v => targetVol = Math.max(0, Math.min(1, v)) };
})();

function fadeInMusic(targetVolume = musicVolume, duration = 1200) {
  if (!bgMusic) return;
  bgMusic.play().catch(err => console.warn("Music play blocked:", err));
  var step = 50;
  var increment = targetVolume / Math.max(1, duration / step);
  var fade = setInterval(() => {
    if (bgMusic.volume < targetVolume - 0.001) bgMusic.volume = Math.min(bgMusic.volume + increment, targetVolume);
    else { bgMusic.volume = targetVolume; clearInterval(fade); }
  }, step);
  try { localStorage.setItem('quiz_music_vol', String(targetVolume)); } catch(e){}
  if (musicToggle) { musicToggle.classList.add('active'); musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>'; }
}
function fadeOutMusic(duration = 700) {
  if (!bgMusic) return;
  var step = 50;
  var starting = bgMusic.volume;
  var decrement = starting / Math.max(1, duration / step);
  var fade = setInterval(() => {
    if (bgMusic.volume > 0.01) bgMusic.volume = Math.max(bgMusic.volume - decrement, 0);
    else { bgMusic.pause(); bgMusic.volume = 0; clearInterval(fade); }
  }, step);
  if (musicToggle) { musicToggle.classList.remove('active'); musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; }
}


// ---------------- MUSIC TOGGLE BUTTON ----------------
var musicToggle = document.getElementById('music-toggle');
if (!musicToggle) {
  musicToggle = document.createElement('button');
  musicToggle.id = 'music-toggle';
  musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
  musicToggle.style.position = 'fixed';
  musicToggle.style.bottom = '15px';
  musicToggle.style.right = '15px';
  musicToggle.style.fontSize = '20px';
  musicToggle.style.padding = '10px 15px';
  musicToggle.style.borderRadius = '50%';
  musicToggle.style.background = '#222';
  musicToggle.style.color = '#fff';
  musicToggle.style.border = 'none';
  musicToggle.style.cursor = 'pointer';
  musicToggle.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  musicToggle.style.zIndex = '999';
  document.body.appendChild(musicToggle);
}

// ---------------- HELPERS ----------------
function saveVolumeSetting(vol) {
  try {
    localStorage.setItem('musicVolume', String(vol));
  } catch (e) {}
}

// Fade in
function fadeInMusic(targetVolume = musicVolume, duration = 1200) {
  if (!bgMusic) return;
  bgMusic.play().catch(err => console.warn("Music play blocked:", err));
  var step = 50;
  var increment = targetVolume / Math.max(1, duration / step);
  var fade = setInterval(() => {
    if (bgMusic.volume < targetVolume - 0.001) {
      bgMusic.volume = Math.min(bgMusic.volume + increment, targetVolume);
    } else {
      bgMusic.volume = targetVolume;
      clearInterval(fade);
    }
  }, step);
  saveVolumeSetting(targetVolume);
  musicToggle.classList.add('active');
  musicToggle.innerHTML = '<i class="fa-solid fa-music"></i>';
}

// Fade out
function fadeOutMusic(duration = 700) {
  if (!bgMusic) return;
  var step = 50;
  var starting = bgMusic.volume;
  var decrement = starting / Math.max(1, duration / step);
  var fade = setInterval(() => {
    if (bgMusic.volume > 0.01) {
      bgMusic.volume = Math.max(bgMusic.volume - decrement, 0);
    } else {
      bgMusic.pause();
      bgMusic.volume = 0;
      clearInterval(fade);
    }
  }, step);
  musicToggle.classList.remove('active');
  musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
}

// ---------------- EVENT HANDLERS ----------------
musicToggle.onclick = function() {
  if (!bgMusic) return;
  if (bgMusic.paused || bgMusic.volume === 0) fadeInMusic();
  else fadeOutMusic();
};

// ---------------- SAFE AUTOPLAY ----------------
document.addEventListener('click', function enableMusicOnce() {
  fadeInMusic();
  document.removeEventListener('click', enableMusicOnce);
});




// ---------------- START HANDLER (difficulty selection + resume) ----------------
startBtn.onclick = function(){
  var name = playerNameInput.value.trim();
  if (!name) { alert("Enter your name to start!"); return; }

  var selected = selectedDifficulty || (document.querySelector('.diff-btn.selected')||{}).dataset && (document.querySelector('.diff-btn.selected')||{}).dataset.diff;
  if (!selected) selected = 'mixed';
  localStorage.setItem('difficulty', selected);

  if (selected === 'beginner') questions = pick20(beginnerQuestions);
  else if (selected === 'intermediate') questions = pick20(intermediateQuestions);
  else if (selected === 'advanced') questions = pick20(advancedQuestions);
  else questions = pick20(beginnerQuestions.concat(intermediateQuestions));

  var saved = loadSavedProgressFor(name);
  if (saved && saved.difficulty === selected && saved.currentQuestion < questions.length) {
    if (confirm("Resume your last quiz progress?")) {
      currentQuestion = saved.currentQuestion;
      score = saved.score;
      timeLeft = saved.timeLeft;
    } else {
      localStorage.removeItem('quizProgress');
      currentQuestion = 0; score = 0; timeLeft = totalTime;
    }
  } else {
    currentQuestion = 0; score = 0; timeLeft = totalTime;
  }

  localStorage.setItem('currentPlayer', name);
  startContainer.style.display='none';
  quizContainer.style.display='block';

  fadeInMusic();
  startTimer();
  showQuestion();
};


// ---------------- AMBIENT LIGHTNING (random flashes) ----------------
setInterval(()=>{
  if (quizContainer.style.display === 'block' && Math.random() > 0.78) {
    lightningOverlay.classList.add('lightning-flash');
    setTimeout(()=>lightningOverlay.classList.remove('lightning-flash'), 400);
  }
}, 16000);


// ---------------- SOCIAL SHARE ----------------
function shareSocial(platform){
  var text = `I scored ${score} in Lightning Quiz! Try to beat me! ⚡`;
  var url = "";
  if (platform==='whatsapp') url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  else if (platform==='twitter') url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  else if (platform==='facebook') url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
document.getElementById('whatsapp-share').onclick = ()=>shareSocial('whatsapp');
document.getElementById('twitter-share').onclick = ()=>shareSocial('twitter');
document.getElementById('facebook-share').onclick = ()=>shareSocial('facebook');


// ---------------- KEYBOARD NAVIGATION ----------------
document.addEventListener('keydown', function(e){
  if (!keyboardEnabled) return;
  var key = e.key; var opts = document.querySelectorAll('.option-btn');
  if (!opts || opts.length===0) return;
  if (key === 'ArrowUp' || key==='w' || key==='W'){ e.preventDefault(); highlightedOptionIndex = (highlightedOptionIndex -1 + opts.length)%opts.length; visuallyHighlightOption(highlightedOptionIndex); return; }
  if (key === 'ArrowDown' || key==='s' || key==='S'){ e.preventDefault(); highlightedOptionIndex = (highlightedOptionIndex +1)%opts.length; visuallyHighlightOption(highlightedOptionIndex); return; }
  if (key === 'Enter' || key === ' ' || key === 'Spacebar'){ e.preventDefault(); var idx = highlightedOptionIndex; if (opts[idx]) opts[idx].click(); return; }
});

var uiObserver = new MutationObserver(()=>{ keyboardEnabled = (quizContainer.style.display === 'block'); });
uiObserver.observe(quizContainer, { attributes:true, attributeFilter:['style'] });


// ---------------- INITIAL UI STATE ----------------
timerCount.textContent = formatTime(totalTime);
progress.style.width = "100%";
renderLeaderboard(); 

function pick20(pool){ return pool.slice().sort(()=>0.5 - Math.random()).slice(0,20); }
