'use strict'

const gameBoardDOM = document.querySelectorAll('.board-cell');

const Player = (name, marker) => {
    return {name, marker};
};

const GameBoard = (() => {
    const gameBoardArr = ['','','','','','','','',''];

    const updateBoard = () => {
        for(let i = 0; i < gameBoardArr.length; i++) {
            gameBoardDOM[i].textContent = gameBoardArr[i];
        }
    };

    const addMarker = (pos ,marker) => {
        gameBoardArr[pos] = marker;
        updateBoard();
    };

    return {updateBoard, addMarker};
})();

const GameController = (() => {
    let player1 = null;
    let player2 = null;

    let turnToggle = false;  

    const startGame = (p1, p2) => {
        player1 = p1;
        player2 = p2;

        GameBoard.updateBoard();
    };

    const getElPos = (el) => {
        return Array.from(gameBoardDOM).indexOf(el);
    };

    const playTurnHandler = function(e) {
        switch (turnToggle) {
            case false:
                GameBoard.addMarker(getElPos(this), 'X');
                turnToggle = !turnToggle;
                break;
            case true:
                GameBoard.addMarker(getElPos(this), 'O');
                turnToggle = !turnToggle;
                break;
        }
    };

    (() => {
        gameBoardDOM.forEach((el) => {
            el.addEventListener('click', playTurnHandler);
        });
    })();

    return {startGame};
})();

const player1 = Player('p1','X');
const player2 = Player('p2','O');

GameController.startGame(player1,player2);



