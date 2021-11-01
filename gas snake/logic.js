const main = document.getElementById("main")
const side = 200
const speed = 75
const board = []
let direction = "right"
let headPosition = [1, 3]
let tail = [[1, 0], [1, 1], [1, 2]]

function makeTable() {
    for (let i = 0; i < side; i++) {
        board.push([])
        for (j = 0; j < side; j++) {
            board[i].push(0)
        }
    }
    for (let i = 0; i < tail.length; i++) {
        board[tail[i][0]][tail[i][1]] = 2
    }
    board[headPosition[0]][headPosition[1]] = 1
}

function spawnFood() {
    x = Math.floor(Math.random() * side)
    y = Math.floor(Math.random() * side)
    if (board[x][y] === 0) {
        board[x][y] = -1
    } else {
        spawnFood()
    }
}

function restart(){
    for (i = 0; i<side; i++){
        for (j = 0; j<side; j++){
            board[i][j] = 0
        }
    }
    tail = [[1, 0], [1, 1], [1, 2]]
    headPosition = [1, 3]
    direction = "right"
    draw()
    spawnFood()
    gameInterval = window.setInterval(function () {
        move()
        draw()
        getDirection()
    }, speed)
}

function draw() {
    for (i = 0; i < side; i++) {
        for (j = 0; j < side; j++) {
            let field = main.children[i].children[j]
            if (board[i][j] === 1) {
                field.style.background = "red"
            }
            if (board[i][j] === 0) {
                field.style.background = "darkseagreen"
            }
            if (board[i][j] === -1) {
                field.style.background = "darkgreen"
            }
            if (board[i][j] === 2) {
                field.style.background = "maroon"
            }
        }
    }
}

function makeBoard() {
    for (let i = 0; i < side; i++) {
        let row = document.createElement("div")
        row.classList.add("row")
        row.id = i
        main.appendChild(row)
        for (j = 0; j < side; j++) {
            let column = document.createElement("div")
            column.classList.add("column")
            row.appendChild(column)
        }
    }
}

function move() {
    last = tail[0]
    board[tail[0][0]][tail[0][1]] = 0
    tail.push(headPosition)
    tail.shift()
    console.log(tail)
    for (let i = 0; i < tail.length; i++) {
        board[tail[i][0]][tail[i][1]] = 2
    }
    if (direction === "right") {
        headPosition = [headPosition[0], (headPosition[1] + 1) % side]

    } else if (direction === "left") {
        headPosition = [headPosition[0], (headPosition[1] - 1)]
        if (headPosition[1] === -1) {
            headPosition[1] = side - 1
        }
    } else if (direction === "up") {
        headPosition = [(headPosition[0] - 1), headPosition[1]]
        if (headPosition[0] === -1) {
            headPosition[0] = side - 1
        }
    } else if (direction === "down") {
        headPosition = [(headPosition[0] + 1) % side, headPosition[1]]
    }
    if (board[headPosition[0]][headPosition[1]] === 2) {
        clearInterval(gameInterval)
        alert("Przegrałeś!")
        restart()
    }
    if (board[headPosition[0]][headPosition[1]] === -1) {
        tail.unshift(last)
        spawnFood()
    }
    board[headPosition[0]][headPosition[1]] = 1

}

makeBoard()
makeTable()
draw()
spawnFood()

function getDirection() {
    document.addEventListener('keydown', function listener(event) {
        if (event.keyCode === 37 && direction !== "right") {
            direction = "left"
        } else if (event.keyCode === 39 && direction !== "left") {
            direction = "right";
        } else if (event.keyCode === 38 && direction !== "down") {
            direction = "up";
        } else if (event.keyCode === 40 && direction !== "up") {
            direction = "down";
        } else if (event.keyCode === 32) {
            clearInterval(gameInterval)
        }
        document.removeEventListener('keydown', listener)
    });
}

gameInterval = window.setInterval(function () {
    move()
    draw()
    getDirection()
}, speed)