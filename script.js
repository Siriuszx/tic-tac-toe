const Player = (name, marker) => {
    
    return {name, marker};
};

const GameBoard = (() => {
    const gameBoardDOM = document.querySelectorAll('.board-cell');
    let curPlayer = {};

    const placeMarker = function(e) {
        this.textContent = curPlayer.marker;
    };

    gameBoardDOM.forEach(el => {
        el.addEventListener('click', placeMarker);
    });    
    
    const getCellPos = () => {
        return Array.from(gameBoardDOM).indexOf(this);
    };

    const updateCurPlayer = (player) => {
        curPlayer = player;
    };

    return {placeMarker, updateCurPlayer};
})();

const player1 = Player('p1','X');
const player2 = Player('p2','O');
GameBoard.updateCurPlayer(player1);



