// Perri van den Berg (2025)

// Experiment storage.
function generateSessionId() {
    return 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

let gameData = loadFromLocal();

if (!gameData) {
    gameData = {
        sessionId: generateSessionId(),  // Unique per session
        startedAt: Date.now(),
        completedGame: false,
        clickedSurvey: false,
        acceptedRules: false,
        isOnMobile: false,
        totalPlaytime: 0,
        currentLevel: 0,
        levels: []
    };
} else {
    console.log("Resuming previous session:", gameData.sessionId);
}

// Auto save.
setInterval(() => {
    saveToLocal();
    syncToServer(gameData);
}, 30000); // Every 30 seconds save locally and to the server.

window.onbeforeunload = () => {
    saveToLocal();
    syncToServer(gameData);
};


// Functions:

function startDataLevel(levelId) {
    const level = {
        levelId,
        startTime: Date.now(),
        deaths: [],
        playtime: 0,
        pathTaken: [],
        rescued: 0,
        bulletsFired: 0,
        enemiesKilled: 0,
        damageTaken: []
    };
    gameData.levels.push(level);
}

function endLevel() {
    const level = gameData.levels[gameData.levels.length - 1];
    if (level && level.startTime) {
        level.playtime = Date.now() - level.startTime;
        delete level.startTime;
    }
}

function recordPath(x, y) {
    const level = getCurrentLevel();
    level.pathTaken.push({ x, y });
}

function recordDeath(x, y, restart) {
    const level = getCurrentLevel();
    level.deaths.push({ x, y, path: level.pathTaken, timestamp: Date.now(), restart: restart });
    level.pathTaken = [];
}

function recordDamage(x, y) {
    const level = getCurrentLevel();
    level.damageTaken.push({ x, y, timestamp: Date.now() });
}

// NOTE: Only records 1 bullet for shooting forwards (instead of 2).
function recordBullet() {
    const level = getCurrentLevel();
    level.bulletsFired++;
}

function recordKills() {
    const level = getCurrentLevel();
    level.enemiesKilled++;
}

function recordRescue() {
    const level = getCurrentLevel();
    level.rescued++;
}

function getCurrentLevel() {
    return gameData.levels[gameData.levels.length - 1];
}

function saveToLocal() {
    gameData.totalPlaytime = Date.now() - gameData.startedAt;
    localStorage.setItem("gameData", JSON.stringify(gameData));
}

function loadFromLocal() {
    const saved = localStorage.getItem("gameData");
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

async function syncToServer(data) {
    await fetch('/save-game-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

