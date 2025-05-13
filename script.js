document.addEventListener('DOMContentLoaded', () => {
   
    const sealWords = [
        { word: "harborseal", hint: "Common seal with spotted coat" },
        { word: "elephantseal", hint: "Largest seal species" },
        { word: "leopardseal", hint: "Fierce Antarctic predator" },
        { word: "weddellseal", hint: "Deep-diving Antarctic seal" },
        { word: "furseal", hint: "Seal with thick underfur" },
        { word: "sealion", hint: "Eared seal that can walk on land" },
        { word: "walrus", hint: "Large seal with tusks" },
        { word: "beardedseal", hint: "Seal with distinctive whiskers" },
        { word: "hoodedseal", hint: "Seal with inflatable nasal cavity" },
        { word: "ringedseal", hint: "Main prey of polar bears" },
        { word: "harpseal", hint: "White-coated pup species" },
        { word: "grayseal", hint: "British coastal species" },
        { word: "ribbonseal", hint: "Striped Arctic species" },
        { word: "baikal", hint: "Only freshwater seal" },
        { word: "caspian", hint: "World's smallest seal" },
        { word: "galapagos", hint: "Only tropical seal" },
        { word: "blubber", hint: "Seal's fat layer" },
        { word: "flippers", hint: "Seal's swimming limbs" },
        { word: "molting", hint: "Shedding fur process" },
        { word: "haulout", hint: "Seals gathering on land" },
        { word: "pinniped", hint: "Scientific order for seals" },
        { word: "echolocation", hint: "How some seals hunt" },
        { word: "rookery", hint: "Seal breeding colony" },
        { word: "baskings", hint: "Seals resting on land" },
        { word: "weaning", hint: "When pups stop nursing" },
        { word: "kelp", hint: "Where some seals play" },
        { word: "krill", hint: "Tiny seal prey" },
        { word: "icefloe", hint: "Arctic seal platform" },
        { word: "whiskers", hint: "Seal's sensitive vibrissae" },
        { word: "snorkeling", hint: "How seals breathe while swimming" },
        { word: "porpoising", hint: "Seal's fast swimming technique" },
        { word: "migration", hint: "Seasonal seal movement" },
        { word: "pup", hint: "Baby seal" },
        { word: "cow", hint: "Adult female seal" },
        { word: "bull", hint: "Adult male seal" },
        { word: "pelage", hint: "Seal's coat" },
        { word: "estuary", hint: "Where river seals live" },
        { word: "dive", hint: "Seal's hunting behavior" },
        { word: "predator", hint: "Natural seal enemy" },
        { word: "conservation", hint: "Seal protection efforts" },
        { word: "endangered", hint: "At-risk seal status" },
        { word: "marine", hint: "Seal's ecosystem" },
        { word: "antarctic", hint: "Southern seal habitat" },
        { word: "arctic", hint: "Northern seal habitat" },
        { word: "subnivean", hint: "Under-snow seal lairs" },
        { word: "thermoregulation", hint: "How seals stay warm" },
        { word: "polygyny", hint: "Seal mating system" },
        { word: "colony", hint: "Group of seals" },
        { word: "aquatic", hint: "Seal's primary habitat" },
        { word: "amphibious", hint: "Lives on land and water" }
    ];
   
    const elements = {
        terminal: document.getElementById('terminal-display'),
        wordDisplay: document.getElementById('word-display'),
        keyboard: document.querySelector('.keyboard'),
        message: document.querySelector('.message-text'),
        hintButton: document.getElementById('hint-btn'),
        soundButton: document.getElementById('sound-btn'),
        restartButton: document.getElementById('restart-btn'),
        wins: document.getElementById('wins'),
        losses: document.getElementById('losses'),
        remainingAttempts: document.getElementById('remaining-attempts'),
        hearts: document.getElementById('hearts'),
        currentHint: document.getElementById('current-hint'),
        messageBox: document.getElementById('message'),
        ranking: document.getElementById('ranking'),
        overlay: document.getElementById('overlay'),
        rankingList: document.getElementById('ranking-list'),
        showRanking: document.getElementById('show-ranking'),
        closeRanking: document.getElementById('close-ranking')
    };


    const terminalStates = [
        "🌊 Initializing Seal Security Protocol...",
        "⚠️ Intruder Alert [1/6 attempts remaining]",
        "ALERT: Fish Thief Detected!",
        "WARNING: Activating Pup Defense [3/6]",
        "CRITICAL: Ice Floe Barrier Breached",
        "🚨 SYSTEM FAILURE: Seal Evacuation Needed",
        "🦭 ATTACK FAILED\n> Belly Rubs Required!",
        "✅ ACCESS GRANTED\n> Welcome to Seal Sanctuary!"
    ];


    const gameState = {
        secretWord: '',
        hint: '',
        correctLetters: [],
        wrongLetters: [],
        maxAttempts: 6,
        remainingAttempts: 6,
        wins: 0,
        losses: 0,
        hintUsed: false,
        soundEnabled: true
    };


    const sounds = {
        correct: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3'),
        wrong: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'),
        win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
        lose: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3')
    };

    
    function initGame() {
        const randomWord = sealWords[Math.floor(Math.random() * sealWords.length)];
        gameState.secretWord = randomWord.word.toLowerCase();
        gameState.hint = randomWord.hint;
        gameState.correctLetters = [];
        gameState.wrongLetters = [];
        gameState.remainingAttempts = gameState.maxAttempts;
        gameState.hintUsed = false;

        updateTerminal();
        updateWordDisplay();
        createKeyboard();
        updateAttempts();

        elements.restartButton.classList.add('hidden');
        elements.hintButton.classList.remove('hidden');
        elements.currentHint.textContent = '';
        setMessage('Click a letter to start!', 'info');
    }

    function createKeyboard() {
        elements.keyboard.innerHTML = '';
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        
        letters.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'key';
            button.textContent = letter;
            button.dataset.letter = letter;
            button.addEventListener('click', () => processGuess(letter));
            elements.keyboard.appendChild(button);
        });
    }

    function updateTerminal() {
        typeWriter(elements.terminal, terminalStates[gameState.wrongLetters.length]);
        elements.terminal.classList.add('typing');
        setTimeout(() => elements.terminal.classList.remove('typing'), 500);
    }

  
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        const typing = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, speed);
    }

   
    function updateWordDisplay() {
        const display = gameState.secretWord.split('').map(letter => {
            return gameState.correctLetters.includes(letter) ? 
                `<span class="letter pulsar">${letter}</span>` : 
                '<span class="letter">_</span>';
        }).join(' ');
        
        elements.wordDisplay.innerHTML = display;
    }

    function updateKeyboard() {
        document.querySelectorAll('.key').forEach(button => {
            const letter = button.dataset.letter;
            
            if (gameState.correctLetters.includes(letter)) {
                button.classList.add('correct');
                button.classList.add('used');
            } else if (gameState.wrongLetters.includes(letter)) {
                button.classList.add('wrong');
                button.classList.add('used');
            }
        });
    }

    function updateAttempts() {
        gameState.remainingAttempts = gameState.maxAttempts - gameState.wrongLetters.length;
        elements.remainingAttempts.textContent = gameState.remainingAttempts;
        
        elements.hearts.innerHTML = '';
        for (let i = 0; i < gameState.maxAttempts; i++) {
            const heart = document.createElement('i');
            heart.className = 'fas fa-heart';
            heart.style.color = i < gameState.remainingAttempts ? 'var(--seal-accent)' : '#555';
            elements.hearts.appendChild(heart);
        }
    }

    function setMessage(text, type = 'info') {
        elements.message.textContent = text;
        elements.messageBox.className = 'message-box ' + type;
    }

    function showHint() {
        if (!gameState.hintUsed) {
            elements.currentHint.textContent = `Hint: ${gameState.hint}`;
            setMessage(`Hint: ${gameState.hint}`, 'info');
            gameState.hintUsed = true;
            elements.hintButton.classList.add('hidden');
            
            elements.currentHint.classList.add('pulsar');
            setTimeout(() => elements.currentHint.classList.remove('pulsar'), 1000);
        }
    }

    function toggleSound() {
        gameState.soundEnabled = !gameState.soundEnabled;
        elements.soundButton.innerHTML = gameState.soundEnabled ? 
            '<i class="fas fa-volume-up"></i> Sound' : 
            '<i class="fas fa-volume-mute"></i> Sound';
    }

    function playSound(sound) {
        if (gameState.soundEnabled) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound error:", e));
        }
    }

    function processGuess(letter) {
        if (gameState.correctLetters.includes(letter) || gameState.wrongLetters.includes(letter)) {
            setMessage(`You already tried ${letter.toUpperCase()}!`, 'error');
            return;
        }
        
        if (gameState.secretWord.includes(letter)) {
            gameState.correctLetters.push(letter);
            setMessage(`Correct! ${letter.toUpperCase()} is in the word!`, 'success');
            playSound(sounds.correct);
            updateWordDisplay();
            updateKeyboard();
            
            if (checkWin()) {
                gameState.wins++;
                elements.wins.textContent = gameState.wins;
                setMessage(`🎉 You won! The word was: ${gameState.secretWord.toUpperCase()}`, 'success');
                playSound(sounds.win);
                endGame();
                return;
            }
        } else {
            gameState.wrongLetters.push(letter);
            setMessage(`Oops! ${letter.toUpperCase()} is not correct`, 'error');
            playSound(sounds.wrong);
            updateTerminal();
            updateKeyboard();
            updateAttempts();
            
            if (gameState.wrongLetters.length >= gameState.maxAttempts) {
                gameState.losses++;
                elements.losses.textContent = gameState.losses;
                setMessage(`💔 Game Over! The word was: ${gameState.secretWord.toUpperCase()}`, 'error');
                playSound(sounds.lose);
                endGame();
                return;
            }
        }
    }

    function checkWin() {
        const win = gameState.secretWord.split('').every(letter => 
            gameState.correctLetters.includes(letter)
        );
        
        if (win) {
            elements.terminal.textContent = terminalStates[terminalStates.length - 1];
            elements.terminal.classList.add('success');
        }
        
        return win;
    }

    function saveToRanking(name, score) {
        const ranking = JSON.parse(localStorage.getItem('sealRanking')) || [];
        ranking.push({ 
            name: name || 'Anonymous', 
            score, 
            date: new Date().toLocaleDateString('en-US') 
        });
        
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem('sealRanking', JSON.stringify(ranking.slice(0, 10)));
    }

    
    function showRanking() {
        const ranking = JSON.parse(localStorage.getItem('sealRanking')) || [];
        elements.rankingList.innerHTML = ranking.map((player, index) => `
            <li>
                <span class="rank">${index + 1}º</span>
                <span class="name">${player.name}</span>
                <span class="score">${player.score} pts</span>
                <span class="date">${player.date}</span>
            </li>
        `).join('');
        
        elements.ranking.classList.remove('hidden');
        elements.overlay.classList.remove('hidden');
    }

    function endGame() {
        elements.restartButton.classList.remove('hidden');
        elements.hintButton.classList.add('hidden');
        disableKeyboard();
        
        if (checkWin()) {
            elements.wordDisplay.classList.add('bounce');
            setTimeout(() => {
                elements.terminal.classList.remove('success');
            }, 1500);
            
            setTimeout(() => {
                const name = prompt('Congratulations! Enter your name for the ranking:');
                const score = gameState.secretWord.length * gameState.remainingAttempts;
                saveToRanking(name, score);
            }, 500);
        } else {
            elements.wordDisplay.classList.add('shake');
        }
    }

    function disableKeyboard() {
        document.querySelectorAll('.key').forEach(button => {
            button.disabled = true;
            button.classList.add('disabled');
        });
    }

    elements.hintButton.addEventListener('click', showHint);
    elements.soundButton.addEventListener('click', toggleSound);
    elements.restartButton.addEventListener('click', () => {
        elements.wordDisplay.classList.remove('bounce', 'shake');
        initGame();
    });
    elements.showRanking.addEventListener('click', showRanking);
    elements.closeRanking.addEventListener('click', () => {
        elements.ranking.classList.add('hidden');
        elements.overlay.classList.add('hidden');
    });
    elements.overlay.addEventListener('click', () => {
        elements.ranking.classList.add('hidden');
        elements.overlay.classList.add('hidden');
    });

    initGame();
});