'use strict'


const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const gameBoardDOM = document.querySelectorAll('.board-cell');
    let _gameState = false;
    let _turnToggle = false;

    const _UIController = (() => {

        let _AIHandlers = false;
        const _playerAliases = { player1: null, player2: null };

        const _statusMsg = document.querySelector('.game-status-msg');
        const _player1Tag = document.querySelector('#player-one');
        const _player2Tag = document.querySelector('#player-two');

        const _aliasInput = document.querySelector('#player-alias');
        const _submitAliasBtn = document.querySelector('#submit-alias');
        _submitAliasBtn.addEventListener('click', _setPlayerAlias)

        const startGameBtn = document.querySelector('#start-game');
        const restartGameBtn = document.querySelector('#restart-game');
        const switchToAIBtn = document.querySelector('#play-ai');
        startGameBtn.addEventListener('click', _startGame);
        restartGameBtn.addEventListener('click', _restartGame);
        switchToAIBtn.addEventListener('click', _toggleAI);

        function _setPlayerAlias() {
            if (_aliasInput.value && !_playerAliases.player1) {
                _playerAliases.player1 = _aliasInput.value;
                _player1Tag.textContent = _playerAliases.player1;
                _aliasInput.placeholder = 'Player 2 Name';
            } else if (_aliasInput.value && !_playerAliases.player2) {
                _playerAliases.player2 = _aliasInput.value;
                _player2Tag.textContent = _playerAliases.player2;
                _aliasInput.placeholder = '';
                _statusMsg.textContent = 'Press start!'
            } else if (!_aliasInput.textContent || !_aliasInput.textContent) {
                updateGameStatus('nonames');
            }
            _aliasInput.value = '';
        };

        const updateGameStatus = (state) => {
            switch (state) {
                case 'X':
                    _statusMsg.textContent = `${_playerAliases.player1} has won!`;
                    break;
                case 'O':
                    _statusMsg.textContent = `${_playerAliases.player2} has won!`;
                    break;
                case 'draw':
                    _statusMsg.textContent = 'Draw!';
                    break;
                case 'nonames':
                    _statusMsg.textContent = 'Please enter your names first';
                    break;
                case 'game':
                    _statusMsg.textContent = 'Game in progress!';
                    break;
            }
        };

        const getNames = () => {
            if (_playerAliases.player1 && _playerAliases.player2)
                return _playerAliases;
            else
                return null;
        };

        const resetUI = () => {
            _playerAliases.player1 = null;
            _playerAliases.player2 = null;
            _player1Tag.textContent = 'P1 Name';
            _player2Tag.textContent = 'P2 Name';
            _aliasInput.placeholder = 'Player 1 Name';
            _statusMsg.textContent = 'New round.'
        }

        const remapHandlers = () => {
            switchToAIBtn.classList.toggle('button-active');
            gameBoardDOM.forEach((el) => {
                el.removeEventListener('click', _playHumanHandler);
            });
            gameBoardDOM.forEach((el) => {
                el.removeEventListener('click', _playAIHandler);
            });

            switch (_AIHandlers) {
                case true:
                    gameBoardDOM.forEach((el) => {
                        el.addEventListener('click', _playHumanHandler);
                    });
                    _AIHandlers = !_AIHandlers;
                    break;
                case false:
                    gameBoardDOM.forEach((el) => {
                        el.addEventListener('click', _playAIHandler);
                    });
                    _AIHandlers = !_AIHandlers;
                    break;
            }
        };

        // Mapping when program is run for the first time
        gameBoardDOM.forEach((el) => {
            el.addEventListener('click', _playHumanHandler);
        });

        return { getNames, updateGameStatus, resetUI, remapHandlers };
    })();

    const _GameBoard = (() => {
        let _gameBoardArr = ['', '', '', '', '', '', '', '', ''];
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

        const resetBoard = () => {
            _gameBoardArr = ['', '', '', '', '', '', '', '', ''];
            updateBoard();
        };

        const isBoardClear = () => {
            for (let i = 0; i < _gameBoardArr.length; i++) {
                if (_gameBoardArr[i]) return false;
            }
            return true;
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
            if (!_gameBoardArr[pos]) {
                _gameBoardArr[pos] = marker;
                updateBoard();
            }
        };

        const getFreeSlotPos = () => {
            let rndNum = 0;

            do {
                rndNum = Math.floor(Math.random() * 9);
            } while (_gameBoardArr[rndNum] && !isBoardFull())

            return rndNum;
        };

        return {
            updateBoard,
            addMarker,
            getThreeInARow,
            isBoardFull,
            resetBoard,
            isBoardClear,
            getFreeSlotPos,
        };
    })();

    function _startGame() {
        if (_UIController.getNames() && _GameBoard.isBoardClear()) {
            _gameState = true;
            _UIController.updateGameStatus('game');
            _GameBoard.updateBoard();
        }
    };

    function _restartGame() {
        _gameState = false;
        _GameBoard.resetBoard();
        _UIController.resetUI();
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

    function _playHumanHandler(e) {
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

    function _playAIHandler(e) {
        if (!this.textContent && _gameState) {
            _GameBoard.addMarker(_getElPos(this), 'X');
            _checkWinCondition('X');
            _GameBoard.addMarker(_GameBoard.getFreeSlotPos(), 'O');
            _checkWinCondition('O');
        }
    };

    function _toggleAI() {
        _UIController.remapHandlers();
        _restartGame();
    };

    return {};
})();


