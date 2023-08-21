'use strict'


const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const gameBoardDOM = document.querySelectorAll('.board-cell');
    
    const _UIController = (() => {
        const _playerAliases = { player1: null, player2: null };

        const player1Tag = document.querySelector('#player-one');
        const player2Tag = document.querySelector('#player-two');
        
        const aliasInput = document.querySelector('#player-alias');

        const _setPlayerAlias = () => {
            if (aliasInput.value && !_playerAliases.player1) {
                _playerAliases.player1 = aliasInput.value;
                player1Tag.textContent = _playerAliases.player1;
                aliasInput.placeholder = 'Player 2';
            } else if (aliasInput.value && !_playerAliases.player2) {
                _playerAliases.player2 = aliasInput.value;
                player2Tag.textContent = _playerAliases.player2;
                aliasInput.placeholder = 'Game in progress!';
            }
            aliasInput.value = '';
        };

        const submitAliasBtn = document.querySelector('#submit-alias');
        submitAliasBtn.addEventListener('click', _setPlayerAlias)

        return {};
    })();

    const _GameBoard = (() => {
        const _gameBoardArr = ['', '', '', '', '', '', '', '', ''];
        const _markerRowPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        const updateBoard = () => {
            for (let i = 0; i < _gameBoardArr.length; i++) {
                gameBoardDOM[i].textContent = _gameBoardArr[i];
            }
        };
        
        const isBoardFull = () => {
            for (let i = 0; i < _gameBoardArr.length; i++) {
                if (!_gameBoardArr[i]) return false;
            }
            return true;
        };
        
        const getThreeInARow = (marker) => {
            for (let i = 0; i < _markerRowPatterns.length; i++) {
                if (_gameBoardArr[_markerRowPatterns[i][0]] &&
                    _gameBoardArr[_markerRowPatterns[i][0]] ===
                    _gameBoardArr[_markerRowPatterns[i][1]] &&
                    _gameBoardArr[_markerRowPatterns[i][1]] ===
                    _gameBoardArr[_markerRowPatterns[i][2]]) {
                    return {
                        patternIndex: _markerRowPatterns[i][0],
                        result: true,
                        markerType: _gameBoardArr[_markerRowPatterns[i][0]],
                    };
                }
            }
            return {
                result: false,
                markerType: null,
            };

        };

        const addMarker = (pos, marker) => {
            _gameBoardArr[pos] = marker;
            updateBoard();
        };

        return { updateBoard, addMarker, getThreeInARow, isBoardFull };
    })();

    let _player1 = null;
    let _player2 = null;

    let _gameState = true;
    // To make players change turns
    let _turnToggle = false;

    const startGame = (p1, p2) => {
        _player1 = p1;
        _player2 = p2;

        _GameBoard.updateBoard();
    };

    const _endGame = () => {

    };

    const _getElPos = (el) => {
        return Array.from(gameBoardDOM).indexOf(el);
    };

    const _checkWinCondition = (marker) => {
        if (_GameBoard.getThreeInARow(marker).result) {
            _gameState = false;
            console.log(`Player '${marker}' has won!`);
        }
        if (_gameState === true && _GameBoard.isBoardFull()) {
            _gameState = false;
            console.log('Draw!');
        }
    };

    const _playTurnHandler = function (e) {
        if (!this.textContent && _gameState) {
            switch (_turnToggle) {
                case false:
                    _GameBoard.addMarker(_getElPos(this), _player1.marker);
                    _checkWinCondition(_player1.marker);
                    _turnToggle = !_turnToggle;
                    break;
                case true:
                    _GameBoard.addMarker(_getElPos(this), _player2.marker);
                    _checkWinCondition(_player2.marker);
                    _turnToggle = !_turnToggle;
                    break;
            }
        }
    };

    // To add listeners to each board cell
    (() => {
        gameBoardDOM.forEach((el) => {
            el.addEventListener('click', _playTurnHandler);
        });
    })();

    return { startGame };
})();

const player1 = Player('p1', 'X');
const player2 = Player('p2', 'O');

GameController.startGame(player1, player2);


