// ELEMENTS
let cursor = document.getElementById('cursor');
let cursorShadow = document.getElementById('cursorShadow');
let player = document.getElementById('player');
let bullet = document.getElementById('bullet');
let lifePoint = document.getElementById('life');
let percentDisplay = document.getElementById('percent');
let scoreDisplay = document.getElementById('score');
let mouse = {x: 0, y: 0}; // dinamic mouse possition
let screenObj = {x: window.innerWidth / 2, y: window.innerHeight / 2}; // dinamic centre of screen
let lastClick = {x: 0, y: 0}; // last mouese possition when click
let intervalVar = 0; // control time within intervals
let enemiesStart = 0; // control pause/play mecha and wen to create new enemy
let playerOut = 0; // control when the player dies
let playerOutVar = 0; // cauxiliar var for when player dies
let changeLife = 0; // control when to create a new life point
let percentVal = 100; // probability of survive a shoot
let scoreVal = -1; // actual score
let chanceOfDie = 0; // probability to die shooting
let mustDie = 0; // auxiliar var to die

// FUNCTIONS
let inRadio = (centroX, centroY, x, y, r) => {
    // are the coords inside the circle
    return (Math.sqrt ((x - centroX)**2 + (y - centroY)**2) > r) ? true : false ;
};

let vectorTo = (fromX, fromY, toX, toY) => {
    // dsnt need explanation
    return [toX - fromX, fromY - toY];
};

let randomEnemyPos = (centerX, centerY, r) => {
    let factor = Math.floor((Math.random() * 100) + 1);
    let angle = (Math.PI*2*factor)/100; // radians
    let x = Math.cos(angle)*r;
    let y = Math.sin(angle)*r;
    return [x + centerX, y + centerY];
};

let randomLifePos = (cenX, cenY, r) => {
    while (true) {
        let xFac = Math.floor((Math.random() * 100) + 1);
        let xAdd = (2*r*xFac)/100;
        let yFac = Math.floor((Math.random() * 100) + 1);
        let yAdd = (2*r*yFac)/100;
        if (inRadio(cenX,cenY,cenX-r+xAdd,cenY-r+yAdd, r)) {
            // outside actually
        } else {
            return [cenX-r+xAdd-15,cenY-r+yAdd-15];
        }
    }
    
};

let angleToPoint = (vector) => {
    if (vector [0] > 0 && vector [1] > 0) {
        // 1 quad + +
        return Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] > 0) {
        // 2 quad - +
        return Math.PI + Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] < 0) {
        // 3 quad - - 
        return Math.PI + Math.atan(vector[1]/vector[0]);
    } else {
        // 4 cuad + -
        return Math.PI*2 + Math.atan(vector[1]/vector[0]);
    }
};

let createNewEnemy = () => {
    // create an enemy at the border
    let newEnemy = document.createElement('i');
    newEnemy.classList.add('fas');
    newEnemy.classList.add('fa-greater-than');
    newEnemy.classList.add('enemy');
    document.body.appendChild(newEnemy);
    screenObj = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    let enemyPos = randomEnemyPos (screenObj.x, screenObj.y, 300);
    newEnemy.style.left = (enemyPos[0] - 17) + "px";
    newEnemy.style.top = (enemyPos[1] - 17) + "px";
    newEnemy.style.color = "rgb(39, 195, 206)";
};

// EVENTS
document.addEventListener('keydown', event => {
    if (event.code === 'KeyR') {
        window.location.reload();
    };
});

document.addEventListener('click', event => {
    // rest one percent per click
    percentVal--;
    // bullet goes to player
    bullet.style.left = (parseFloat(player.style.left) + 15) + "px";
    bullet.style.top = (parseFloat(player.style.top) + 15) + "px";
    // updates cursor last click possition
    lastClick = {
        x: parseFloat(cursor.style.left) + 30,
        y: parseFloat(cursor.style.top) + 30
    };
    // sets bullet's angle
    let bulletVec = vectorTo (parseFloat(player.style.left) + 25, parseFloat(player.style.top) + 25, lastClick.x, lastClick.y);
    let bulletAngle = -angleToPoint (bulletVec);
    bullet.style.transform = "rotate(" + bulletAngle + "rad)";
    // check if shooting kills player
    chanceOfDie = Math.floor((Math.random() * 100) + 1);
    if (chanceOfDie > percentVal) {
        mustDie = 1;
    }
});

document.addEventListener('keydown', event => {
    // start creating enemies when pressing p
    if (event.code === 'KeyP') {
        enemiesStart == 0 ? enemiesStart = 1 : enemiesStart = 0;
    };
});

document.addEventListener('keyup', event => {
    // place player on centre
    screenObj = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    if (event.code === 'Space') {
        player.style.top = (screenObj.y - 25) + "px";
        player.style.left = (screenObj.x - 25) + "px";
    }
  })

document.addEventListener ("mousemove", (event) => {
    // get screen center
    screenObj = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    // get cursor pos
    mouse.x = event.clientX; 
    mouse.y = event.clientY;
    // move cursor div
    cursor.style.left = (mouse.x - 30) + "px";
    cursor.style.top = (mouse.y - 30) + "px";
    cursorShadow.style.left = (mouse.x - 30) + "px";
    cursorShadow.style.top = (mouse.y - 30) + "px";
    // change cursor color
    if (inRadio(screenObj.x, screenObj.y, mouse.x, mouse.y, 300)) {
        cursorShadow.style.display = "block";
    } else {
        cursorShadow.style.display = "none";
    }
    // spin player
    vecToSpin = vectorTo (parseFloat(player.style.left)+25, parseFloat(player.style.top)+25, mouse.x, mouse.y);
    angleToSpin = -angleToPoint (vecToSpin) + Math.PI/4;
    player.style.transform = "rotate(" + angleToSpin + "rad)";
});

document.addEventListener('keydown', event => {
    let vec = vectorTo (parseFloat(player.style.left), parseFloat(player.style.top), parseFloat(cursor.style.left), parseFloat(cursor.style.top));
    let vecMod = Math.sqrt(vec[0]**2 + vec[1]**2);
    vec[0] = vec[0]/vecMod;
    vec[1] = vec[1]/vecMod;
    // move player ohhyeah
    if (event.code === 'KeyM') {
        // move only if new pos is inside limit zone
        if (inRadio(screenObj.x - 25, screenObj.y - 25, parseFloat(player.style.left) + vec[0]*10, parseFloat(player.style.top) - vec[1]*10, 260)) {
            {}
        } else {
            player.style.left = (parseFloat(player.style.left) + vec[0]*10) + "px";
            player.style.top = (parseFloat(player.style.top) - vec[1]*10) + "px";
        };        
    };
    // change player color
    if (inRadio(screenObj.x - 25, screenObj.y - 25, parseFloat(player.style.left), parseFloat(player.style.top), 300)) {
        player.style.color = "rgb(255, 255, 255)";
    } else {
        player.style.color = "rgb(39, 195, 206)";
    }
});

setInterval(() => {
    playerOut += playerOutVar;
    intervalVar++
    // create enemy every half second
    if (intervalVar % 40 == 0 && enemiesStart == 1) {
        createNewEnemy();
    };
    // move all enemies
    if (enemiesStart == 1) {
        let enemies = document.querySelectorAll(".enemy");
        for (let j = 0; j < enemies.length; j++) {
            let enemyVec = vectorTo (parseFloat(enemies[j].style.left), parseFloat(enemies[j].style.top), parseFloat(player.style.left), parseFloat(player.style.top));
            let enemyAngle = -angleToPoint (enemyVec);
            let enemyMod = Math.sqrt(enemyVec[0]**2 + enemyVec[1]**2);
            enemyVec[0] =  enemyVec[0]/enemyMod;
            enemyVec[1] = enemyVec[1]/enemyMod;
            enemies[j].style.left = (parseFloat(enemies[j].style.left) + enemyVec[0]*3) + "px";
            enemies[j].style.top = (parseFloat(enemies[j].style.top) - enemyVec[1]*3) + "px";
            enemies[j].style.transform = "rotate(" + enemyAngle + "rad)";
            // check for bullet collition
            if (inRadio(parseFloat(enemies[j].style.left),parseFloat(enemies[j].style.top),parseFloat(bullet.style.left),parseFloat(bullet.style.top), 25)) {
                // enemies[j].style.color = "rgb(39, 195, 206)";
            } else {
                enemies[j].style.display = "none";
            }
            // check for loosing collition
            if (inRadio(parseFloat(player.style.left + 25),parseFloat(player.style.top + 25),parseFloat(enemies[j].style.left),parseFloat(enemies[j].style.top), 15)) {
                // enemies[j].style.color = "rgb(39, 195, 206)";
            } else {
                // making sure the enemy exist
                if (enemies[j].style.display != "none") {
                    enemiesStart = 0;
                    player.style.animationName = "getDestroy";
                    player.style.animationDuration = "2s";
                    player.style.animationTimingFunction = "ease-out";
                    player.style.animationIterationCount = 1;
                    playerOutVar = 1;
                }
                
            }
        }
    };
    // activate death animation
    if (mustDie == 1) {
        enemiesStart = 0;
        player.style.animationName = "getDestroy";
        player.style.animationDuration = "2s";
        player.style.animationTimingFunction = "ease-out";
        player.style.animationIterationCount = 1;
        playerOutVar = 1;
    }
    // delete player
    if (playerOut == 80) {
        player.style.display = "none";
        bullet.style.display = "none";
    };
}, 25);

setInterval (() => {
    // move bullet
    let bulletShootVec = vectorTo (parseFloat(player.style.left) + 25, parseFloat(player.style.top) + 25, lastClick.x, lastClick.y);
    let bMod = Math.sqrt(bulletShootVec[0]**2 + bulletShootVec[1]**2);
    bulletShootVec[0] = bulletShootVec[0]/bMod;
    bulletShootVec[1] = bulletShootVec[1]/bMod;
    // move only if bullef exist
    if (bullet.style.left != "0px") {
        bullet.style.left = (parseFloat(bullet.style.left) + bulletShootVec[0]*8) + "px";
        bullet.style.top = (parseFloat(bullet.style.top) - bulletShootVec[1]*8) + "px";
    } 
    if (inRadio(screenObj.x, screenObj.y, parseFloat(bullet.style.left)+15,parseFloat(bullet.style.top)+15,300)) {
        bullet.style.left = "0px";
        bullet.style.top = "0px";
    }
    // check for player life collition
    if (inRadio (parseFloat(player.style.left)+25,parseFloat(player.style.top)+25,parseFloat(lifePoint.style.left)+15,parseFloat(lifePoint.style.top)+15,20)) {
        // out
        changeLife = 0;
    } else {
        if (changeLife == 0) {
            let lifePos = randomLifePos (screenObj.x, screenObj.y, 240);
            lifePoint.style.left = (lifePos[0]) + "px";
            lifePoint.style.top = (lifePos[1]) + "px";
            changeLife = 1;
            percentVal = 100;
            scoreVal++;
        }
    }
    // Change percent display
    percentDisplay.innerText = percentVal;
    // set and change score display
    scoreDisplay.style.top = (screenObj.y - 150) + "px";
    scoreDisplay.style.left = (screenObj.x - 100) + "px";
    scoreDisplay.innerText = scoreVal;
}, 5)