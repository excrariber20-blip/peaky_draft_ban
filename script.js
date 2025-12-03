// State
let currentGame = '';
let currentPlatform = 'mobile';
let timerInterval;
let seconds = 0;
let isTimerRunning = false;
let usedHeroes = new Set(); // Track used heroes for Global mode
let currentFilter = 'ALL'; // Track current role filter
let currentDraftStep = 0; // Current step in draft sequence
let draftSequence = []; // Will be set based on game
let draftHistory = []; // Store all saved draft games
let currentHistoryPage = 1; // Track current history page (1 or 2)
let currentGameNumber = 1; // Track current game number in series

// MLBB Draft Sequence
// b = blue team, r = red team
const mlbbDraftSequence = [
    { team: 'blue', type: 'ban', slot: 0 },   // Blue ban 1
    { team: 'red', type: 'ban', slot: 0 },    // Red ban 1
    { team: 'blue', type: 'ban', slot: 1 },   // Blue ban 2
    { team: 'red', type: 'ban', slot: 1 },    // Red ban 2
    { team: 'blue', type: 'pick', slot: 0 },  // Blue pick 1
    { team: 'red', type: 'pick', slot: 0 },   // Red pick 1
    { team: 'red', type: 'pick', slot: 1 },   // Red pick 2
    { team: 'blue', type: 'pick', slot: 1 },  // Blue pick 2
    { team: 'blue', type: 'pick', slot: 2 },  // Blue pick 3
    { team: 'red', type: 'pick', slot: 2 },   // Red pick 3
    { team: 'red', type: 'ban', slot: 2 },    // Red ban 3
    { team: 'blue', type: 'ban', slot: 2 },   // Blue ban 3
    { team: 'red', type: 'pick', slot: 3 },   // Red pick 4
    { team: 'blue', type: 'pick', slot: 3 },  // Blue pick 4
    { team: 'blue', type: 'pick', slot: 4 },  // Blue pick 5
    { team: 'red', type: 'pick', slot: 4 }    // Red pick 5
];
const rovDraftSequence = [
    { team: 'blue', type: 'ban', slot: 0 },   // Blue ban 1
    { team: 'red', type: 'ban', slot: 0 },    // Red ban 1
    { team: 'blue', type: 'ban', slot: 1 },   // Blue ban 2
    { team: 'red', type: 'ban', slot: 1 },    // Red ban 2
    { team: 'blue', type: 'pick', slot: 0 },  // Blue pick 1
    { team: 'red', type: 'pick', slot: 0 },   // Red pick 1
    { team: 'red', type: 'pick', slot: 1 },   // Red pick 2
    { team: 'blue', type: 'pick', slot: 1 },  // Blue pick 2
    { team: 'blue', type: 'pick', slot: 2 },  // Blue pick 3
    { team: 'red', type: 'pick', slot: 2 },   // Red pick 3
    { team: 'red', type: 'ban', slot: 2 },    // Red ban 3
    { team: 'blue', type: 'ban', slot: 2 },   // Blue ban 3
    { team: 'red', type: 'pick', slot: 3 },   // Red pick 4
    { team: 'blue', type: 'pick', slot: 3 },  // Blue pick 4
    { team: 'blue', type: 'pick', slot: 4 },  // Blue pick 5
    { team: 'red', type: 'pick', slot: 4 }    // Red pick 5
];

// Hero data structure
const heroData = {
    mlbb: {
        roles: {
            'ALL': [],
            'EXP lane': [
                'Aldous', 'Alice', 'Argus', 'Arlott', 'Badang',
                'Bane', 'Benedetta', 'Chou', 'Cici', 'Dyrroth',
                'Esmeralda', 'Freya', 'Gloo', 'Guinevere', 'Hilda',
                'Jawhead', 'Khaleed', 'Lapu_lapu', 'Lukas', 'Masha',
                'Minsitthar', 'Paquito', 'Phoveus', 'Roger', 'Ruby',
                'Sora', 'Sun', 'Terizla', 'Thamuz', 'Uranus',
                'X.Borg', 'Yu_Zhong'
            ],
            'Jungle': [
                'Aamon', 'Alpha', 'Alucard', 'Aulus', 'Balmon',
                'Barats', 'Baxia', 'Fanny', 'Fredrinn', 'Gusion',
                'Hanzo', 'Harley', 'Hayabusa', 'Helcurt', 'Joy',
                'Julian', 'Karina', 'Lancelot', 'Leomord', 'Ling',
                'Martis', 'Natalia', 'Nolan', 'Saber', 'Suyou',
                'Yi_Sun_shin', 'Yin', 'Zilong'
            ],
            'Mid lane': [
                'Aurora', 'Cecilion', 'Change', 'Cyclops', 'Eudora',
                'Faramis', 'Kadita', 'Kagura', 'Lunox', 'Luo_Yi',
                'Lylia', 'Nana', 'Novaria', 'Pharsa', 'Selena',
                'Vale', 'Valentina', 'Valir', 'Xavier', 'Yve',
                'Zetian', 'Zhask', 'Zhuxin'
            ],
            'Gold lane': [
                'Beatrix', 'Brody', 'Bruno', 'Claude', 'Clint',
                'Granger', 'Harith', 'Irithel', 'Ixia', 'Karrie',
                'Kimmy', 'Layla', 'Lesley', 'Melissa', 'Miya',
                'Moskov', 'Natan', 'Obsidia', 'Popol_and_Kupa', 'Wanwan'
            ],
            'Support': [
                'Angela', 'Atlas', 'Belerick', 'Carmilla', 'Chip',
                'Diggie', 'Edith', 'Estes', 'Floryn', 'Franco',
                'Gatotkaca', 'Hylos', 'Johnson', 'Kaja', 'Kalea',
                'Khufra', 'Lolita', 'Mathilda', 'Minotaur', 'Rafaela',
                'Tigreal'
            ]
        },
        // Map display names to actual folder names
        roleFolders: {
            'EXP lane': 'EXP_lane',
            'Jungle': 'Jungle',
            'Mid lane': 'Midlane',
            'Gold lane': 'Gold_lane',
            'Support': 'Support'
        },
        basePath: 'img/mlbb_hero/'
    },
    rov: {
        roles: {
            'ALL': [],
            'Jungle': [],
            'Slayer': [],
            'Mid': [],
            'ADC': [],
            'Support': []
        },
        basePath: 'img/rov_hero/'
    },
    hok: {
        roles: {
            'ALL': [],
            'Jungle': [],
            'Clash': [],
            'Mid': [],
            'Farm': [],
            'Support': []
        },
        basePath: 'img/hok_hero/'
    },
    pokemon: {
        roles: {
            'ALL': [],
            'Attacker': [],
            'Speedster': [],
            'All-Rounder': [],
            'Defender': [],
            'Supporter': []
        },
        basePath: 'img/pokemon_hero/'
    }
};

// Build ALL heroes list for each game
Object.keys(heroData).forEach(game => {
    const roles = heroData[game].roles;
    const allHeroes = [];
    Object.keys(roles).forEach(role => {
        if (role !== 'ALL') {
            allHeroes.push(...roles[role]);
        }
    });
    roles['ALL'] = allHeroes;
});

// Navigation
function selectGame(gameName) {
    currentGame = gameName;
    currentFilter = 'ALL';
    currentDraftStep = 0;
    console.log(`Selected game: ${gameName}`);

    // Set draft sequence based on game
    if (gameName === 'mlbb') {
        draftSequence = mlbbDraftSequence;
    }

    // Hide landing page
    document.getElementById('landing-page').classList.remove('active');

    // Show the specific game draft page
    const draftPageId = `draft-page-${gameName}`;
    document.getElementById(draftPageId).classList.add('active');

    // Initialize Draft for this game
    initDraft(gameName);
    resetTimer();
    highlightCurrentSlot();
}

function goBack() {
    // Hide all draft pages
    document.querySelectorAll('[id^="draft-page-"]').forEach(page => {
        page.classList.remove('active');
    });

    // Show landing page
    document.getElementById('landing-page').classList.add('active');
    currentGame = '';
    currentFilter = 'ALL';
    stopTimer();
}

// Draft Logic
function initDraft(game) {
    const gridId = `hero-grid-${game}`;
    const grid = document.getElementById(gridId);

    if (!grid) {
        console.error(`Grid not found: ${gridId}`);
        return;
    }

    grid.innerHTML = ''; // Clear existing

    // Get heroes for the current filter
    const heroes = getHeroesForFilter(game, currentFilter);
    const basePath = heroData[game].basePath;

    heroes.forEach((heroName, index) => {
        // Create container for hero avatar + name
        const container = document.createElement('div');
        container.className = 'hero-container';
        container.dataset.heroId = heroName;
        container.dataset.game = game;

        // Create hero avatar
        const hero = document.createElement('div');
        hero.className = 'hero-avatar';

        // Determine the role folder for this hero
        const roleFolder = findHeroRole(game, heroName);

        // Set background image if hero exists
        if (heroName && roleFolder) {
            const imagePath = `${basePath}${roleFolder}/${heroName}.png`;
            hero.style.backgroundImage = `url('${imagePath}')`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
        } else {
            // Fallback to random color for placeholder
            const r = Math.floor(Math.random() * 200 + 55);
            const g = Math.floor(Math.random() * 200 + 55);
            const b = Math.floor(Math.random() * 200 + 55);
            hero.style.backgroundColor = `rgb(${r},${g},${b})`;
        }

        // Create hero name label
        const nameLabel = document.createElement('div');
        nameLabel.className = 'hero-name';
        nameLabel.textContent = heroName.replace(/_/g, ' ');

        // Add click handler to container
        container.onclick = () => selectHero(heroName, game);

        // Append avatar and name to container
        container.appendChild(hero);
        container.appendChild(nameLabel);

        // Append container to grid
        grid.appendChild(container);
    });
}

// Find which role folder a hero belongs to
function findHeroRole(game, heroName) {
    const gameData = heroData[game];
    const roles = gameData.roles;
    const roleFolders = gameData.roleFolders;

    for (const role in roles) {
        if (role !== 'ALL' && roles[role].includes(heroName)) {
            // Return the actual folder name, not the display name
            return roleFolders ? roleFolders[role] : role;
        }
    }
    return null;
}

// Get heroes based on current filter
function getHeroesForFilter(game, filter) {
    const gameData = heroData[game];
    if (!gameData || !gameData.roles[filter]) {
        return [];
    }
    return gameData.roles[filter];
}

// Filter heroes by role
function filterHeroes(role) {
    currentFilter = role;
    if (currentGame) {
        initDraft(currentGame);
    }
}

function selectHero(heroId, game) {
    console.log(`Selected hero: ${heroId} for game: ${game}`);

    // Check if draft is complete
    if (currentDraftStep >= draftSequence.length) {
        alert('Draft is complete!');
        return;
    }

    // Check Global Ban
    const gameTypeId = `game-type-${game}`;
    const gameTypeSelect = document.getElementById(gameTypeId);
    const gameType = gameTypeSelect ? gameTypeSelect.value : 'normal';

    if (gameType === 'global' && usedHeroes.has(heroId)) {
        alert('This hero has already been picked/banned!');
        return;
    }

    // Get current step in draft sequence
    const currentStep = draftSequence[currentDraftStep];
    const { team, type, slot } = currentStep;

    // Find the slot element
    const activePage = document.querySelector('.view.active');
    const teamClass = team === 'blue' ? '.blue-team' : '.red-team';
    const slotClass = type === 'ban' ? '.ban-slot' : '.pick-slot';
    const teamColumn = activePage.querySelector(teamClass);
    const slots = teamColumn.querySelectorAll(slotClass);
    const targetSlot = slots[slot];

    if (targetSlot) {
        // Get hero image
        const gameData = heroData[game];
        const basePath = gameData.basePath;
        const roleFolder = findHeroRole(game, heroId);

        if (roleFolder) {
            const imagePath = `${basePath}${roleFolder}/${heroId}.png`;
            targetSlot.style.backgroundImage = `url('${imagePath}')`;
            targetSlot.style.backgroundSize = 'cover';
            targetSlot.style.backgroundPosition = 'center';
            targetSlot.style.backgroundColor = '';
        }
    }

    // Mark as used
    usedHeroes.add(heroId);

    // Visual feedback in hero grid
    const gridId = `hero-grid-${game}`;
    const grid = document.getElementById(gridId);
    const heroContainer = grid.querySelector(`[data-hero-id="${heroId}"]`);
    if (heroContainer) {
        heroContainer.style.opacity = '0.5';
        heroContainer.style.pointerEvents = 'none';
    }

    // Move to next step
    currentDraftStep++;
    highlightCurrentSlot();
}

// Event Listeners for Filter Buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add filter button listeners for all draft pages
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Get parent filters container
            const filtersContainer = e.target.closest('.filters');
            // Remove active from siblings only
            filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Apply filter
            const role = e.target.textContent;
            filterHeroes(role);
        });
    });

    // Platform toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPlatform = e.target.dataset.platform;
            console.log(`Platform switched to: ${currentPlatform}`);
        });
    });
});

// Timer Functions
function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');

    // Update timer display for current game
    if (currentGame) {
        const displayId = `timer-display-${currentGame}`;
        const display = document.getElementById(displayId);
        if (display) display.textContent = `${min}:${sec}`;
    }
}

// Draft Control Functions
function resetDraft() {
    resetTimer();
    currentDraftStep = 0;

    // Clear slots (visual only for now) - only for active draft page
    const activePage = document.querySelector('.view.active');
    if (activePage) {
        activePage.querySelectorAll('.slot').forEach(slot => {
            slot.innerHTML = '';
            slot.style.backgroundImage = '';
            slot.style.backgroundColor = 'white';
        });
    }

    // Reset Used Heroes
    usedHeroes.clear();

    // Reset hero avatars for current game
    if (currentGame) {
        const gridId = `hero-grid-${currentGame}`;
        const grid = document.getElementById(gridId);
        if (grid) {
            grid.querySelectorAll('.hero-container').forEach(h => {
                h.style.opacity = '1';
                h.style.pointerEvents = 'auto';
            });
        }
    }

    console.log('Draft reset');
    highlightCurrentSlot();
}

// Highlight the current slot in draft sequence
function highlightCurrentSlot() {
    if (!draftSequence || draftSequence.length === 0) return;

    const activePage = document.querySelector('.view.active');
    if (!activePage) return;

    // Remove all highlights
    activePage.querySelectorAll('.slot').forEach(slot => {
        slot.classList.remove('active-slot');
    });

    // Check if draft is complete
    if (currentDraftStep >= draftSequence.length) {
        console.log('Draft complete!');
        return;
    }

    // Highlight current slot
    const currentStep = draftSequence[currentDraftStep];
    const { team, type, slot } = currentStep;

    const teamClass = team === 'blue' ? '.blue-team' : '.red-team';
    const slotClass = type === 'ban' ? '.ban-slot' : '.pick-slot';
    const teamColumn = activePage.querySelector(teamClass);
    const slots = teamColumn.querySelectorAll(slotClass);
    const targetSlot = slots[slot];

    if (targetSlot) {
        targetSlot.classList.add('active-slot');
    }
}

// History Management Functions
function showHistory() {
    // Save current draft if it has any data
    saveCurrentDraft();

    // Hide all draft pages
    document.querySelectorAll('[id^="draft-page-"]').forEach(page => {
        page.classList.remove('active');
    });

    // Show history page
    document.getElementById('history-page').classList.add('active');

    // Set game logo
    const historyLogo = document.getElementById('history-game-logo');
    if (currentGame) {
        historyLogo.className = 'game-logo-small ' + currentGame;
    }

    // Render first page
    currentHistoryPage = 1;
    renderHistoryPage(1);
}

function goBackFromHistory() {
    // Hide history page
    document.getElementById('history-page').classList.remove('active');

    // Show current draft page
    if (currentGame) {
        const draftPageId = 'draft-page-' + currentGame;
        document.getElementById(draftPageId).classList.add('active');
    } else {
        // If no current game, go to landing page
        document.getElementById('landing-page').classList.add('active');
    }
}

function saveCurrentDraft() {
    if (!currentGame) return;

    // Get current draft data from slots
    const activePage = document.querySelector('.view.active');
    if (!activePage) return;

    const blueTeam = {
        bans: [],
        picks: []
    };
    const redTeam = {
        bans: [],
        picks: []
    };

    // Extract blue team data
    const blueColumn = activePage.querySelector('.blue-team');
    if (blueColumn) {
        const blueBans = blueColumn.querySelectorAll('.ban-slot');
        blueBans.forEach(slot => {
            const bgImage = slot.style.backgroundImage;
            blueTeam.bans.push(bgImage || null);
        });

        const bluePicks = blueColumn.querySelectorAll('.pick-slot');
        bluePicks.forEach(slot => {
            const bgImage = slot.style.backgroundImage;
            blueTeam.picks.push(bgImage || null);
        });
    }

    // Extract red team data
    const redColumn = activePage.querySelector('.red-team');
    if (redColumn) {
        const redBans = redColumn.querySelectorAll('.ban-slot');
        redBans.forEach(slot => {
            const bgImage = slot.style.backgroundImage;
            redTeam.bans.push(bgImage || null);
        });

        const redPicks = redColumn.querySelectorAll('.pick-slot');
        redPicks.forEach(slot => {
            const bgImage = slot.style.backgroundImage;
            redTeam.picks.push(bgImage || null);
        });
    }

    // Check if draft has any data
    const hasData = [...blueTeam.bans, ...blueTeam.picks, ...redTeam.bans, ...redTeam.picks].some(img => img !== null);

    if (hasData) {
        // Add to history
        draftHistory.push({
            gameNumber: draftHistory.length + 1,
            gameType: currentGame,
            blueTeam: blueTeam,
            redTeam: redTeam,
            timestamp: new Date()
        });
    }
}

function renderHistoryPage(pageNumber) {
    const historyGrid = document.getElementById('history-grid');
    historyGrid.innerHTML = '';

    // Determine which games to show
    let startIndex, endIndex;
    if (pageNumber === 1) {
        startIndex = 0;
        endIndex = Math.min(7, draftHistory.length);
    } else {
        startIndex = 7;
        endIndex = Math.min(10, draftHistory.length);
    }

    // If no history, show message
    if (draftHistory.length === 0) {
        historyGrid.innerHTML = '<div class="no-history">No draft history yet. Complete a draft to see it here.</div>';
        document.getElementById('next-page-btn').style.display = 'none';
        document.getElementById('prev-page-btn').style.display = 'none';
        return;
    }

    // Create game cards for the current page
    for (let i = startIndex; i < endIndex; i++) {
        if (i < draftHistory.length) {
            const gameCard = createGameCard(draftHistory[i]);
            historyGrid.appendChild(gameCard);
        } else {
            // Create empty placeholder
            const emptyCard = createEmptyGameCard(i + 1);
            historyGrid.appendChild(emptyCard);
        }
    }

    // Fill remaining slots with empty cards up to 7 (page 1) or 3 (page 2)
    const maxCards = pageNumber === 1 ? 7 : 3;
    const currentCards = endIndex - startIndex;
    for (let i = currentCards; i < maxCards; i++) {
        const emptyCard = createEmptyGameCard(startIndex + i + 1);
        historyGrid.appendChild(emptyCard);
    }

    // Update pagination controls
    updatePaginationControls();
}

function createGameCard(gameData) {
    const card = document.createElement('div');
    card.className = 'game-card-history';

    const header = document.createElement('div');
    header.className = 'game-card-header';
    header.textContent = 'Game ' + gameData.gameNumber;

    const teamsContainer = document.createElement('div');
    teamsContainer.className = 'game-teams';

    // Blue Team
    const blueTeam = document.createElement('div');
    blueTeam.className = 'team-history blue-team-history';

    let blueHTML = '<h3>Blue Team</h3><div class="ban-section-history"><div class="ban-label">Ban</div><div class="slots-row-history">';
    gameData.blueTeam.bans.forEach(ban => {
        const style = ban ? 'background-image: ' + ban + '; background-size: cover; background-position: center;' : '';
        blueHTML += '<div class="slot-history" style="' + style + '"></div>';
    });
    blueHTML += '</div></div><div class="pick-section-history"><div class="pick-label">Pick</div><div class="pick-slots-history">';
    gameData.blueTeam.picks.forEach(pick => {
        const style = pick ? 'background-image: ' + pick + '; background-size: cover; background-position: center;' : '';
        blueHTML += '<div class="slot-history pick-slot-history" style="' + style + '"></div>';
    });
    blueHTML += '</div></div>';
    blueTeam.innerHTML = blueHTML;

    // Red Team
    const redTeam = document.createElement('div');
    redTeam.className = 'team-history red-team-history';

    let redHTML = '<h3>Red Team</h3><div class="ban-section-history"><div class="ban-label">Ban</div><div class="slots-row-history">';
    gameData.redTeam.bans.forEach(ban => {
        const style = ban ? 'background-image: ' + ban + '; background-size: cover; background-position: center;' : '';
        redHTML += '<div class="slot-history" style="' + style + '"></div>';
    });
    redHTML += '</div></div><div class="pick-section-history"><div class="pick-label">Pick</div><div class="pick-slots-history">';
    gameData.redTeam.picks.forEach(pick => {
        const style = pick ? 'background-image: ' + pick + '; background-size: cover; background-position: center;' : '';
        redHTML += '<div class="slot-history pick-slot-history" style="' + style + '"></div>';
    });
    redHTML += '</div></div>';
    redTeam.innerHTML = redHTML;

    teamsContainer.appendChild(blueTeam);
    teamsContainer.appendChild(redTeam);

    card.appendChild(header);
    card.appendChild(teamsContainer);

    return card;
}

function createEmptyGameCard(gameNumber) {
    const card = document.createElement('div');
    card.className = 'game-card-history empty-game';

    const header = document.createElement('div');
    header.className = 'game-card-header';
    header.textContent = 'Game ' + gameNumber;

    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'null';

    card.appendChild(header);
    card.appendChild(emptyMessage);

    return card;
}

function updatePaginationControls() {
    const nextBtn = document.getElementById('next-page-btn');
    const prevBtn = document.getElementById('prev-page-btn');
    const pageIndicator = document.getElementById('page-indicator');

    // Show/hide next button
    if (draftHistory.length > 7 && currentHistoryPage === 1) {
        nextBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'none';
    }

    // Show/hide previous button
    if (currentHistoryPage === 2) {
        prevBtn.style.display = 'inline-block';
    } else {
        prevBtn.style.display = 'none';
    }

    // Update page indicator
    pageIndicator.textContent = 'Page ' + currentHistoryPage;
}

function nextHistoryPage() {
    if (currentHistoryPage === 1 && draftHistory.length > 7) {
        currentHistoryPage = 2;
        renderHistoryPage(2);
    }
}

function prevHistoryPage() {
    if (currentHistoryPage === 2) {
        currentHistoryPage = 1;
        renderHistoryPage(1);
    }
}
