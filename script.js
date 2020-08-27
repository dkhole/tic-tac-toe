function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

const gameBoard = (() => {
    const board = [ '', '', '', '', '', '', '', '', ''];
    const render = (board, player1, player2) => {
        for(let i = 1; i < 10; i++) {
            switch(board[i - 1]) {
                case 'X':
                    //draw x into div symbol
                    let idX = "block-" + i;
                    let blockX = document.getElementById(idX);
                    blockX.firstChild.textContent = "X";
                    
                    player2.color = document.getElementById("choose-2").value;

                    let hex = cutHex(player2.color);
                    let r = hexToR(hex);
                    let g = hexToG(hex);
                    let b = hexToB(hex);
                    blockX.firstChild.style.color = "rgb(" + r + "," + g + "," + b + ")";
                    break;
                case 'O':
                    //draw o into div symbol
                    let idY = "block-" + i;
                    let blockY = document.getElementById(idY);
                    blockY.firstChild.textContent = "O";

                    player1.color = document.getElementById("choose-1").value;

                    let yHex = cutHex(player1.color);
                    let rY = hexToR(yHex);
                    let gY = hexToG(yHex);
                    let bY = hexToB(yHex);
                    blockY.firstChild.style.color = "rgb(" + rY + "," + gY + "," + bY + ")";
                    break;
                case "":
                    let idZ = "block-" + i;
                    let blockZ = document.getElementById(idZ);
                    blockZ.firstChild.textContent = "";
                    break;
            }
        }
    }
    const checkWin = (board, index) => {
        //get symbol

        const symbol = board[index];
        let win = false;

        //check all rows
        for(let i = 1; i < 8; i++) {
            if(board[i] != "") {
                if(board[i-1] === board[i] && board[i] === board[i+1]){
                    win = true;
                    return win;
                }
            }                
            i = i + 2
        }
        //check all columns
        for(let i = 3; i < 6; i++) {
            if(board[i] != "") {
                if(board[i - 3] == board[i] && board[i] == board[i + 3]) {
                    win = true;
                    return win;
                }
            }
        }

        //check diagonals
        if(board[0] != "" && board[0] == board[4] && board[4] == board[8]) {

                win = true;
                return win;
            
        }

        if(board[2] != "" && board[2] == board[4] && board[4] == board[6]) {

                win = true;
                return win;
            
        }
        
        return win;
    }
    return {board, render, checkWin};
})();

const playerFactory = (name, color) => {
    const compMove = (board) => {
        let turnCount = 0;
        //check all rows cols and diagonals for 2 in a row, if so block/complete
        //check all rows
        //only check if board element isnt empty and row isnt full
        for(let i = 1; i < 8; i++) {
            if(board[i] != "" && !(board[i] != "" && board[i + 1] != "" && board[i - 1] != "")) {
                if(board[i - 1] == board[i]){
                    return i + 1;
                }
                else if(board[i] == board[i + 1]) {
                    return i - 1;
                }
                else if(board[i - 1] != "" && (board[i - 1] == board[i + 1])) {
                    return i;
                }
            }                
            i = i + 2
        }
        //check all columns
        for(let i = 3; i < 6; i++) {
            if(board[i] != "" && !(board[i] != "" && board[i + 3] != "" && board[i - 3] != "")) {
                if(board[i - 3] == board[i]) {
                    return i + 3;
                }
                else if(board[i] == board[i + 3]) {
                    return i - 3;
                }
                else if(board[i - 3] != "" && board[i - 3] == board[i + 3]) {
                    return i;
                }
            }
        }

        //check diagonals   
        if(board[0] != "" && board[8] == "" && board[0] == board[4]){
            return 8;
        }
        else if(board[4] != "" && board[0] == "" && board[4] == board[8]){
            return 0;
        }
        else if(board[8] != "" && board[4] == "" && board[0] == board[8]) {
            return 4;
        }
        else if(board[2] != "" && board[6] == "" && board[2] == board[4]){
            return 6;
        }
        else if(board[4] != "" && board[2] == "" && board[4] == board[6]){
            return 2;
        }
        else if(board[2] != "" && board[4] == "" && board[2] == board[6]) {
            return 4;
        } else {
            //else pick random free square
            const emptySquares = [];
            for(let i = 0; i < 9; i++) {
                if(board[i] == "") {
                    emptySquares.push(i);
                }
            }
            return emptySquares[Math.floor(Math.random() * emptySquares.length)];
        }
    }
    return {name, color, compMove};
}

//on every click update array and render board
//change turn aka symbol on valid turn
//check for finished game
const gameControls = (() => {
    const blockClicks = (player1, player2, gameBoard, turn) => {
        //adds event listeners to each block
        //returns true if change has been made
        let turned = 0;
        const blocks = document.querySelectorAll(".block");

        blocks.forEach((block) => {
            block.addEventListener("click", function() {
                const index = parseInt(block.id.slice(-1)) - 1;
                //update board array and render if array slot is empty
                if(gameBoard.board[index] == '') {
                    if(player2.name == "CPU") {

                        gameBoard.board[index] = "O";
                        
                        //AI choose grid
                        const compIndex = parseInt(player2.compMove(gameBoard.board));
                        gameBoard.board[compIndex] = "X";

                        gameBoard.render(gameBoard.board, player1, player2);

                        if(gameBoard.checkWin(gameBoard.board, index) == true) {
                            //refractor to show winner
                            alert("player 1 wins");
                            window.location.reload(false);
                        } 
                                               
                    } else {
                        if(turned == 0) {
                            gameBoard.board[index] = "O";
                            gameBoard.render(gameBoard.board, player1, player2);
                            turned++;
                            if(gameBoard.checkWin(gameBoard.board, index) == true) {
                                alert("player 1 wins");
                                window.location.reload(false);
                            }
                            
                        } else {
                            gameBoard.board[index] = "X";
                            gameBoard.render(gameBoard.board, player1, player2);
                            turned = 0;
                            if(gameBoard.checkWin(gameBoard.board, index)) {
                                alert("player 2 wins");
                                window.location.reload(false);
                            }
                        }
                    }
                }
            })
        })
    }
    const toggleCPU = (player1, player2, gameBoard, turn) => {
        let toggle = 0;
       
        const cpuButton = document.getElementById("cpu");
        cpuButton.addEventListener("click", () => {
            //refresh game
            //invert color of div
            //set up game for CPU
            const control = document.getElementById("controller");
            const playersControl = document.getElementById("players-control");
            const player2Control = document.getElementById("player-2-control");
            if(toggle == 0) {
                //invert styles and player name to CPU
                control.style.backgroundColor = "rgb(255, 255, 255)";
                control.style.border = "3px solid black";
                cpuButton.style.color = "rgb(0, 0, 0)";
                playersControl.style.color = "rgb(0, 0, 0)";
                playersControl.style.borderLeft = "solid 5px black";
                cpuButton.textContent = "2 Players";
                player2Control.textContent = "CPU";
                turn = 0;
    
                //restart game data and call blockClicks 
                for(let i = 0; i < 9; i++) {
                    gameBoard.board[i] = "";
                }
                player2.name = "CPU";
                gameBoard.render(gameBoard.board, player1, player2);
                gameControls.blockClicks(player1, player2, gameBoard, 0);
                toggle++;
            } else {
                //revert player 2 name and styles
                control.style.backgroundColor = "rgb(0, 0, 0)";
                control.style.border = "none";
                cpuButton.style.color = "rgb(255, 255, 255)";
                playersControl.style.color = "rgb(255, 255, 255)";
                playersControl.style.borderLeft = "solid 5px white";
                cpuButton.textContent = "CPU";
                player2Control.textContent = "Player 2";

                 //restart game data and call blockClicks 
                 for(let i = 0; i < 9; i++) {
                    gameBoard.board[i] = "";
                }
                player2.name = "player2";
                gameBoard.render(gameBoard.board, player1, player2);
                gameControls.blockClicks(player1, player2, gameBoard, 0);

                toggle--;
            }
        })    
    }
    return {blockClicks, toggleCPU};
})();

const game = (() => {
    const start = () => {
        let turn = 0;

        const player1 = playerFactory("player1", document.getElementById("choose-1").value);
        const player2 = playerFactory("player2", document.getElementById("choose-2").value);

        gameControls.blockClicks(player1, player2, gameBoard, 0);
        gameControls.toggleCPU(player1, player2, gameBoard, 0);
    }
    return {start};
})();

game.start();