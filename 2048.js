const urlParams = new URLSearchParams(window.location.search);
const boardSize = parseInt(urlParams.get("size")) || 4;

// Adjust board size based on the URL parameter
const rows = boardSize;
const columns = boardSize;
const tileSize = 500 / boardSize;

var score = 0;
const board = [];
let isGameWon = false;

document.documentElement.style.setProperty("--columns", columns);

function setGame() {
    initializeBoard();
    setTwo();
    setTwo();
    document.addEventListener("keyup", handleKeyPress);
}

function initializeBoard() {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
        }
    }
    // Calculating padding and border size
    const paddingSize = 5;
    const borderSize = 3;
    const totalPadding = paddingSize * (columns - 1);
    const totalBorder = borderSize * 2 * columns;
    const totalSpace = totalPadding + totalBorder;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            const tileSize = `calc((500px - ${totalSpace}px) / ${columns})`;
            tile.style.setProperty("--tile-size", tileSize); 
            tile.style.setProperty("border-radius", "1rem");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            boardElement.appendChild(tile);
        }
    }
}

// updating the tile
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 2048) {
            tile.classList.add("x" + num.toString());
        }
    }
}

function newGame() {
    window.location.reload();
}

// event listener
document.addEventListener("keyup", (e) => {
    if (isGameWon) {
        e.preventDefault();
    }
    else {
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }
    document.getElementById("score").innerText = score;
    checkWin();
});


function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048) {
                document.getElementById('win-message').classList.remove('hidden');
                // alert("You Won!");
                showWinMessage();
                isGameWon = true;
                return;
            }
        }
    }
}

function showWinMessage() {
    const winMessage = document.getElementById("win-message");
    winMessage.style.display = "flex";

    // Set a fixed size for the message
    const fixedWidth = 300;
    const fixedHeight = 100;
    document.documentElement.style.setProperty("--board-width", fixedWidth + "px");
    document.documentElement.style.setProperty("--board-height", fixedHeight + "px");
}

function filterzero(row) {
    row = row.filter(num => num != 0); // removes zeros
    return row;                      // [2,2,0,4] --> [2,2,4]
}

//[2,2,2,0]
function slide(row) {
    row = filterzero(row); //[2,2,2,0] -> [2,2,2]

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
            // [2,2,2] --> [4,0,2]
        }
    }
    row = filterzero(row); // [4,0,2] --> [4,2]
    while (row.length < columns) {
        row.push(0);  //[4,2] --> [4,2,0,0]
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {  // updating html
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        // console.log(row)

        for (let c = 0; c < columns; c++) {  // updating html
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function hasEmptyCells() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0)
                return true;
        }
    }
    return false;
}

function canMerge() {
    let canMergeTiles = false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let num = board[r][c];

            if (c > 0 && num === board[r][c - 1]) {
                canMergeTiles = true;
            }
            else if (c < columns - 1 && num === board[r][c + 1]) {
                canMergeTiles = true;
            }
            else if (r > 0 && num === board[r - 1][c]) {
                canMergeTiles = true;
            } else if (r < rows - 1 && num === board[r + 1][c]) {
                canMergeTiles = true;
            }
        }
    }
    return canMergeTiles;
}


function gameOver() {
    let canMergeTiles = canMerge();

    if (!hasEmptyCells() && !canMergeTiles) {
        document.getElementById("win-message").innerText = "Game Over!";
        document.getElementById("win-message").classList.remove("hidden");
        showWinMessage();
        // return "gameover";
        return;

    }
}

function setTwo() {
    if (!hasEmptyCells()) {
        gameOver();
        return;
    }

    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

window.onload = setGame();