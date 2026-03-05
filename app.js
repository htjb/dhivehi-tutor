const THAANA = [
  { letter: 'ހ', name: 'Haa', sound: 'h' },
  { letter: 'ށ', name: 'Shaviyani', sound: 'sh' },
  { letter: 'ނ', name: 'Noonu', sound: 'n' },
  { letter: 'ރ', name: 'Raa', sound: 'r' },
  { letter: 'ބ', name: 'Baa', sound: 'b' },
  { letter: 'ޅ', name: 'Lhaviyani', sound: 'lh' },
  { letter: 'ކ', name: 'Kafu', sound: 'k' },
  { letter: 'އ', name: 'Alifu', sound: 'a' },
  { letter: 'ވ', name: 'Vaavu', sound: 'v' },
  { letter: 'މ', name: 'Meemu', sound: 'm' },
  { letter: 'ފ', name: 'Faafu', sound: 'f' },
  { letter: 'ދ', name: 'Dhaalu', sound: 'dh' },
  { letter: 'ތ', name: 'Thaa', sound: 'th' },
  { letter: 'ލ', name: 'Laamu', sound: 'l' },
  { letter: 'ގ', name: 'Gaafu', sound: 'g' },
  { letter: 'ޏ', name: 'Gnaviyani', sound: 'gn' },
];

const DIACRITICS = [
  { char: 'އަ', name: 'Abafili',    sound: 'a',  desc: 'Short "a" — like the "u" in "cup"' },
  { char: 'އާ', name: 'Aabaafili',  sound: 'aa', desc: 'Long "aa" — like "aa" in "father"' },
  { char: 'އި', name: 'Ibifili',    sound: 'i',  desc: 'Short "i" — like "i" in "bit"' },
  { char: 'އީ', name: 'Eebeefili',  sound: 'ee', desc: 'Long "ee" — like "ee" in "feet"' },
  { char: 'އު', name: 'Ubufili',    sound: 'u',  desc: 'Short "u" — like "oo" in "book"' },
  { char: 'އޫ', name: 'Ooboofili',  sound: 'oo', desc: 'Long "oo" — like "oo" in "moon"' },
  { char: 'އެ', name: 'Ebefili',    sound: 'e',  desc: 'Short "e" — like "e" in "bed"' },
  { char: 'އޭ', name: 'Eybeyfili',  sound: 'ey', desc: 'Long "ey" — like "ay" in "say"' },
  { char: 'އޮ', name: 'Obofili',    sound: 'o',  desc: 'Short "o" — like "o" in "hot"' },
  { char: 'އޯ', name: 'Oaboafili',  sound: 'oa', desc: 'Long "oa" — like "oa" in "boat"' },
  { char: 'އް', name: 'Sukun',      sound: null, desc: 'No vowel — or doubles the next consonant (like "tt" in "butter")' },
];

let currentCategory = 'all';
let quizIndex = 0;
let correct = 0;
let streak = 0;
let totalStreak = 0;
let quizAnswered = false;
let shuffledQuiz = [];
let chatHistory = [];

function speak(text, btn) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();

  if (btn) {
    document.querySelectorAll('.speak-btn').forEach(b => b.classList.remove('speaking'));
    btn.classList.add('speaking');
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1;

  if (btn) {
    utterance.onend = () => btn.classList.remove('speaking');
    utterance.onerror = () => btn.classList.remove('speaking');
  }

  speechSynthesis.speak(utterance);
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function filterCategory(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderPhrases();
}

function renderPhrases() {
  const grid = document.getElementById('phraseGrid');
  const filtered = currentCategory === 'all' ? PHRASES : PHRASES.filter(p => p.category === currentCategory);
  grid.innerHTML = filtered.map((p, i) => `
    <div class="phrase-item">
      <div class="phrase-dhivehi">${p.dhivehi}</div>
      <div class="phrase-phonetic">${p.phonetic}</div>
      <div class="phrase-english">${p.english}</div>
      <button class="speak-btn" data-idx="${i}">🔊 Hear it</button>
    </div>
  `).join('');

  grid.querySelectorAll('.speak-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const phrase = filtered[parseInt(btn.dataset.idx)];
      speak(phrase.phonetic, btn);
    });
  });
}

function renderScript() {
  const grid = document.getElementById('scriptGrid');
  grid.innerHTML = THAANA.map((t, i) => `
    <div class="script-letter-card" data-idx="${i}">
      <div class="script-letter">${t.letter}</div>
      <div class="script-name">${t.name}</div>
      <div class="script-sound">"${t.sound}"</div>
    </div>
  `).join('');

  grid.querySelectorAll('.script-letter-card').forEach(card => {
    card.addEventListener('click', () => {
      const t = THAANA[parseInt(card.dataset.idx)];
      speak(t.name);
    });
  });
}

function renderDiacritics() {
  const grid = document.getElementById('diacriticsGrid');
  grid.innerHTML = DIACRITICS.map((d, i) => `
    <div class="diacritic-card" data-idx="${i}">
      <div class="diacritic-char">${d.char}</div>
      <div class="diacritic-name">${d.name}</div>
      <div class="diacritic-sound">${d.sound ? `"${d.sound}"` : 'no vowel'}</div>
      <div class="diacritic-desc">${d.desc}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.diacritic-card').forEach(card => {
    card.addEventListener('click', () => {
      const d = DIACRITICS[parseInt(card.dataset.idx)];
      if (d.sound) speak(d.sound);
    });
  });
}

function initQuiz() {
  shuffledQuiz = shuffleArray(PHRASES);
  quizIndex = 0;
  correct = 0;
  streak = 0;
  renderProgressDots();
  renderQuestion();
}

function renderProgressDots() {
  const dots = document.getElementById('progressDots');
  dots.innerHTML = shuffledQuiz.slice(0, 10).map((_, i) =>
    `<div class="dot ${i < quizIndex ? 'done' : i === quizIndex ? 'current' : ''}"></div>`
  ).join('');
}

function renderQuestion() {
  const q = shuffledQuiz[quizIndex % shuffledQuiz.length];
  document.getElementById('questionNum').textContent = quizIndex + 1;
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('streakNum').textContent = streak;

  const wrong = shuffleArray(PHRASES.filter(p => p.english !== q.english)).slice(0, 3);
  const options = shuffleArray([q, ...wrong]);

  quizAnswered = false;
  const quizContent = document.getElementById('quizContent');
  quizContent.innerHTML = `
    <div class="quiz-question">${q.dhivehi}</div>
    <div class="quiz-phonetic">${q.phonetic}</div>
    <div style="text-align:center;margin-bottom:12px">
      <button class="speak-btn" id="quizSpeakBtn">🔊 Hear pronunciation</button>
    </div>
    <div class="quiz-subtitle">What does this mean in English?</div>
    <div class="quiz-options">
      ${options.map((o, i) => `<button class="quiz-option" data-idx="${i}">${o.english}</button>`).join('')}
    </div>
    <div id="feedback"></div>
  `;
  quizContent._options = options.map(o => o.english);
  quizContent._correct = q.english;

  const quizSpeakBtn = document.getElementById('quizSpeakBtn');
  quizSpeakBtn.addEventListener('click', () => speak(q.phonetic, quizSpeakBtn));

  quizContent.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => checkAnswer(btn));
  });
}

function checkAnswer(btn) {
  if (quizAnswered) return;
  quizAnswered = true;

  const quizContent = document.getElementById('quizContent');
  const correct_ans = quizContent._correct;
  const chosen = quizContent._options[parseInt(btn.dataset.idx)];

  const allBtns = document.querySelectorAll('.quiz-option');
  allBtns.forEach(b => b.disabled = true);

  const feedback = document.getElementById('feedback');

  if (chosen === correct_ans) {
    btn.classList.add('correct');
    correct++;
    streak++;
    totalStreak++;
    document.getElementById('streakCount').textContent = totalStreak;
    feedback.className = 'feedback correct';
    feedback.textContent = streak >= 3 ? `🔥 ${streak} streak! Brilliant!` : '✅ Correct! Well done!';
  } else {
    btn.classList.add('wrong');
    streak = 0;
    allBtns.forEach(b => { if (b.textContent.trim() === correct_ans) b.classList.add('correct'); });
    feedback.className = 'feedback wrong';
    feedback.textContent = `❌ Not quite — the answer was "${correct_ans}"`;
  }

  document.getElementById('correctCount').textContent = correct;
  document.getElementById('streakNum').textContent = streak;

  setTimeout(() => {
    quizIndex++;
    if (quizIndex >= 10) {
      document.getElementById('quizContent').innerHTML = `
        <div style="text-align:center;padding:20px">
          <div style="font-size:3rem;margin-bottom:12px">🎉</div>
          <div style="font-size:1.3rem;color:#fff;font-weight:700;margin-bottom:6px">${correct}/10 correct!</div>
          <div style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:20px">
            ${correct >= 8 ? 'Excellent work! Your partner would be impressed! 🌊' : correct >= 5 ? 'Good progress! Keep practicing! 💪' : 'Keep going — it gets easier! 🌺'}
          </div>
          <button class="btn btn-primary" onclick="initQuiz()">Try Again</button>
        </div>
      `;
    } else {
      renderProgressDots();
      renderQuestion();
    }
  }, 1600);
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const chatArea = document.getElementById('chatArea');
  const sendBtn = document.getElementById('sendBtn');

  chatArea.innerHTML += `<div class="msg user"><div class="label">You</div>${msg}</div>`;
  input.value = '';
  sendBtn.disabled = true;
  chatArea.scrollTop = chatArea.scrollHeight;

  const typingId = 'typing_' + Date.now();
  chatArea.innerHTML += `<div class="msg ai" id="${typingId}"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
  chatArea.scrollTop = chatArea.scrollHeight;

  chatHistory.push({ role: 'user', content: msg });

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again!';

    document.getElementById(typingId)?.remove();
    chatHistory.push({ role: 'assistant', content: reply });

    chatArea.innerHTML += `<div class="msg ai"><div class="label">Tutor</div>${reply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
    chatArea.scrollTop = chatArea.scrollHeight;

  } catch (e) {
    document.getElementById(typingId)?.remove();
    chatArea.innerHTML += `<div class="msg ai"><div class="label">Tutor</div>Hmm, there was a connection issue. Please try again! 🌊</div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  sendBtn.disabled = false;
}

function showTab(tab, el) {
  ['phrasebook', 'quiz', 'tutor', 'script'].forEach(t => {
    document.getElementById(t).classList.add('hidden');
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tab).classList.remove('hidden');
  el.classList.add('active');

  if (tab === 'quiz' && quizIndex === 0 && !shuffledQuiz.length) initQuiz();
  if (tab === 'script') { renderScript(); renderDiacritics(); }
}

// Init
renderPhrases();
