window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.key) > -1) {
        e.preventDefault();
    }
}, false);

const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");

const pacman = {
    x: 50,
    y: 50,
    width: 40,
    height: 40,
    direction: 0,
    speed: 5,
    dx: 0,
    dy: 0,
    image: new Image()
};
const mobs = [
    { x: 200, y: 100, width: 40, height: 40, speed: 1, dx: 0, dy: 0, image: new Image(), alive: true },
    { x: 300, y: 100, width: 40, height: 40, speed: 1, dx: 0, dy: 0, image: new Image(), alive: true },
    { x: 100, y: 300, width: 40, height: 40, speed: 1, dx: 0, dy: 0, image: new Image(), alive: true },
    { x: 300, y: 300, width: 40, height: 40, speed: 1, dx: 0, dy: 0, image: new Image(), alive: true }
];

mobs.forEach(mob => {
    mob.image.src = 'arya.png';
});


pacman.image.src = 'arya.png';

// Define the maze using a 2D array
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const keyMap = {
    ArrowUp: { dx: 0, dy: -1, direction: 1.5 * Math.PI },
    ArrowDown: { dx: 0, dy: 1, direction: 0.5 * Math.PI },
    ArrowLeft: { dx: -1, dy: 0, direction: Math.PI },
    ArrowRight: { dx: 1, dy: 0, direction: 0 }
};

document.addEventListener("keydown", (event) => {
    if (keyMap[event.key]) {
        pacman.dx = keyMap[event.key].dx * pacman.speed;
        pacman.dy = keyMap[event.key].dy * pacman.speed;
        pacman.direction = keyMap[event.key].direction;
    }
});

function drawMaze() {
    const blockSize = canvas.width / maze[0].length;
    ctx.strokeStyle = "#0000FF"; // Wall border color
    ctx.lineWidth = 2; // Wall border width

 for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                // Top edge
                if (row === 0 || maze[row - 1][col] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(col * blockSize, row * blockSize);
                    ctx.lineTo((col + 1) * blockSize, row * blockSize);
                    ctx.stroke();
                }

                // Bottom edge
                if (row === maze.length - 1 || maze[row + 1][col] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(col * blockSize, (row + 1) * blockSize);
                    ctx.lineTo((col + 1) * blockSize, (row + 1) * blockSize);
                    ctx.stroke();
                }

                // Left edge
                if (col === 0 || maze[row][col - 1] === 0) {
                    ctx.beginPath();
                    ctx.moveTo(col * blockSize, row * blockSize);
                    ctx.lineTo(col * blockSize, (row + 1) * blockSize);
                    ctx.stroke();
                }

                // Right edge
                if (col === maze[row].length - 1 || maze[row][col + 1] === 0) {
                    ctx.beginPath();
                    ctx.moveTo((col + 1) * blockSize, row * blockSize);
                    ctx.lineTo((col + 1) * blockSize, (row + 1) * blockSize);
                    ctx.stroke();
                }
            }
        }
    }
}


function update() {
    const nextX = pacman.x + (pacman.dx || 0);
    const nextY = pacman.y + (pacman.dy || 0);

    const blockSize = canvas.width / maze[0].length;
    const nextCol = Math.floor(nextX / blockSize);
    const nextRow = Math.floor(nextY / blockSize);
    mobs.forEach(mob => {
        if (mob.alive && isColliding(pacman, mob)) {
            // Jika tabrakan terjadi, atur kondisi permainan berakhir
            endGame();
        }
    });
    if (maze[nextRow] && maze[nextRow][nextCol] === 0) {
        pacman.x = nextX;
        pacman.y = nextY;
    }

    if (pacman.x < 0) pacman.x = 0;
    if (pacman.x > canvas.width - pacman.width) pacman.x = canvas.width - pacman.width;
    if (pacman.y < 0) pacman.y = 0;
    if (pacman.y > canvas.height - pacman.height) pacman.y = canvas.height - pacman.height;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    ctx.save();
    ctx.translate(pacman.x + pacman.width / 2, pacman.y + pacman.height / 2);
    ctx.rotate(pacman.direction);
    ctx.drawImage(pacman.image, -pacman.width / 2, -pacman.height / 2, pacman.width, pacman.height);
    ctx.restore();
}

function updateMobs() {
    mobs.forEach(mob => {
        if (mob.alive) {
            // Hitung perbedaan posisi antara mob dan Pacman
            const dx = pacman.x - mob.x;
            const dy = pacman.y - mob.y;

            // Tentukan arah gerak berdasarkan perbedaan posisi
            if (Math.abs(dx) > Math.abs(dy)) {
                mob.dx = dx > 0 ? 1 : -1;
                mob.dy = 0;
            } else {
                mob.dy = dy > 0 ? 1 : -1;
                mob.dx = 0;
            }

            // Update posisi mob berdasarkan kecepatan
            mob.x += mob.dx * mob.speed;
            mob.y += mob.dy * mob.speed;

            // Implementasi logika pergerakan atau perilaku mob
        }
    });
}


function drawMobs() {
    mobs.forEach(mob => {
        if (mob.alive) {
            ctx.drawImage(mob.image, mob.x, mob.y, mob.width, mob.height);
        }
    });
}


function gameLoop() {
    update();
    updateMobs();
    draw();
    drawMobs();
    requestAnimationFrame(gameLoop);
}




function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function endGame() {
    // Logika untuk mengakhiri permainan, misalnya menampilkan pesan game over
    alert('Game Over! You collided with a mob.');
    // Atur ulang posisi atau kondisi permainan sesuai kebutuhan
}

// Start the game loop

requestAnimationFrame(gameLoop);
