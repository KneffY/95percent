// ELEMENTS
let cursor = document.getElementById('cursor');
let player = document.getElementById('player');
let bullet = document.getElementById('bullet');
let mouse = {x: 0, y: 0};
let screenObj = {x: window.innerWidth / 2, y: window.innerHeight / 2};
let lastClick = {x: 0, y: 0};
let intervalVar = 0;
let enemiesStart = 0;

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
document.addEventListener('click', event => {
    // bullet goes to player
    bullet.style.left = (parseFloat(player.style.left) + 15) + "px";
    bullet.style.top = (parseFloat(player.style.top) + 15) + "px";
    // updates cursor last click possition
    lastClick = {
        x: parseFloat(cursor.style.left),
        y: parseFloat(cursor.style.top)
    };
    // sets bullet's angle
    let bulletVec = vectorTo (parseFloat(player.style.left) + 15, parseFloat(player.style.top) + 15, lastClick.x, lastClick.y);
    let bulletAngle = -angleToPoint (bulletVec);
    bullet.style.transform = "rotate(" + bulletAngle + "rad)";
});

document.addEventListener('keydown', event => {
    // start creating enemies when pressing p
    if (event.code === 'KeyP') {
        enemiesStart = 1;
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
    // change cursor color
    if (inRadio(screenObj.x, screenObj.y, mouse.x, mouse.y, 300)) {
        cursor.style.border = "4px solid rgb(183, 233, 236)";
    } else {
        cursor.style.border = "4px solid rgb(39, 195, 206)"; 
    }
    // spin player
    vecToSpin = vectorTo (parseFloat(player.style.left), parseFloat(player.style.top), mouse.x, mouse.y);
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
        player.style.left = (parseFloat(player.style.left) + vec[0]*10) + "px";
        player.style.top = (parseFloat(player.style.top) - vec[1]*10) + "px";
    };
    // change player color
    if (inRadio(screenObj.x - 25, screenObj.y - 25, parseFloat(player.style.left), parseFloat(player.style.top), 300)) {
        player.style.color = "rgb(183, 233, 236)";
    } else {
        player.style.color = "rgb(39, 195, 206)";
    }
});

setInterval(() => {
    intervalVar++
    // create enemy every half second
    if (intervalVar % 40 == 0 && enemiesStart == 1) {
        createNewEnemy();
    };
    // move all enemies
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
        // check for collition
        if (inRadio(parseFloat(enemies[j].style.left),parseFloat(enemies[j].style.top),parseFloat(bullet.style.left),parseFloat(bullet.style.top), 15)) {
            // enemies[j].style.color = "rgb(39, 195, 206)";
        } else {
            enemies[j].style.display = "none";
        }
    }
    // move bullet
    let bulletShootVec = vectorTo (parseFloat(player.style.left) + 15, parseFloat(player.style.top) + 15, lastClick.x, lastClick.y);
    let bMod = Math.sqrt(bulletShootVec[0]**2 + bulletShootVec[1]**2);
    bulletShootVec[0] = bulletShootVec[0]/bMod;
    bulletShootVec[1] = bulletShootVec[1]/bMod;
    bullet.style.left = (parseFloat(bullet.style.left) + bulletShootVec[0]*50) + "px";
    bullet.style.top = (parseFloat(bullet.style.top) - bulletShootVec[1]*50) + "px";
}, 25);