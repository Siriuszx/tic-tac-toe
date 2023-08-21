'use strict'


const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const gameBoardDOM = document.querySelectorAll('.board-cell');

    const _UIController = (() => {
        const _playerAliases = { player1: null, player2: null };

        const _player1Tag = document.querySelector('#player-one');
        const _player2Tag = document.querySelector('#player-two');

        const _aliasInput = document.querySelector('#player-alias');
        const _submitAliasBtn = document.querySelector('#submit-alias');
        _submitAliasBtn.addEventListener('click', _setPlayerAlias)

        function _setPlayerAlias() {
            if (_aliasInput.value && !_playerAliases.player1) {
                _playerAliases.player1 = _aliasInput.value;
                _player1Tag.textContent = _playerAliases.player1;
                _aliasInput.placeholder = 'Player 2';
            } else if (_aliasInput.value && !_playerAliases.player2) {
                _playerAliases.player2 = _aliasInput.value;
                _player2Tag.textContent = _playerAliases.player2;
                _aliasInput.placeholder = 'Game in progress!';
                GameController.startGame();
            }
            _aliasInput.value = '';
        };

        const updateGameStatus = (state) => {
            switch (state) {
                case 'X':
                    _aliasInput.placeholder = 'Player 1 has won!';
                    break;
                case 'O':
                    _aliasInput.placeholder = 'Player 2 has won!';
                    break;
                case 'draw':
                    _aliasInput.placeholder = 'Draw!';
                    break;
            }
        };

        const getNames = () => {
            if (_playerAliases.player1 && _playerAliases.player2)
                return _playerAliases;
            else
                return null;
        };

        return { getNames, updateGameStatus };
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

    let _gameState = false;
    // To make players change turns
    let _turnToggle = false;

    const startGame = (p1, p2) => {
        if (_UIController.getNames()) {
            _gameState = true;

            _GameBoard.updateBoard();
        }
    };

    const _endGame = () => {

    };

    const _getElPos = (el) => {
        return Array.from(gameBoardDOM).indexOf(el);
    };

    const _checkWinCondition = (marker) => {
        const threeInARow = _GameBoard.getThreeInARow(marker);

        if (threeInARow.result) {
            if (threeInARow.markerType === 'X') {
                _UIController.updateGameStatus('X')
            } else if (threeInARow.markerType === 'O') {
                _UIController.updateGameStatus('O');
            } else if (threeInARow.markerType === 'X') {
                _UIController.updateGameStatus('X');
            }
            _gameState = false;
        } else if (_GameBoard.isBoardFull()) {
            _UIController.updateGameStatus('draw');
            _gameState = false;
        }
    };

    const _playTurnHandler = function (e) {
        if (!this.textContent && _gameState) {
            switch (_turnToggle) {
                case false:
                    _GameBoard.addMarker(_getElPos(this), 'X');
                    _checkWinCondition('X');
                    _turnToggle = !_turnToggle;
                    break;
                case true:
                    _GameBoard.addMarker(_getElPos(this), 'O');
                    _checkWinCondition('O');
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

GameController.startGame();


