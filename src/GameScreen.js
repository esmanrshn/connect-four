import { red } from '@mui/material/colors';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection
import "./GameScreen.css"
import { Button } from '@mui/material';

const ROWS = 6;
const COLUMNS = 7;
const EMPTY = 'EMPTY';

function createEmptyBoard() {
    return Array(ROWS).fill(null).map(() => Array(COLUMNS).fill(EMPTY));
}

export default function ConnectFour() {
    const history = useHistory();
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPlayer, setCurrentPlayer] = useState('player');
    const [winner, setWinner] = useState(null);
    const [gameData, setGameData] = useState(JSON.parse(localStorage.getItem('gameData')));
    const [gameHistory, setGameHistory] = useState(localStorage.getItem('gameHistory') ? JSON.parse(localStorage.getItem('gameHistory')) : []);


    // Önceki sayfadan kullanıcı ve bilgisayar renklerini al
    const userColor = localStorage.getItem('userColor') || 'blue';
    const computerColor = localStorage.getItem('computerColor') || 'red'; // Varsayılan olarak kırmızı
    const boardColor = localStorage.getItem('boardColor') || 'red'; // Varsayılan renk olarak kırmızı kullanıyoruz

    useEffect(() => {
        if (currentPlayer === 'computer' && !winner) {
            const bestMove = findBestMove(board, computerColor);
            if (bestMove !== null) {
                makeMove(bestMove, computerColor);

                if (checkWinner(board, computerColor)) {
                    setWinner('Bilgisayar Kazandı');
                    setTimeout(() => {
                        redirectToGameHistory();
                    }, 1000);
                } else {
                    setCurrentPlayer('player');
                }
            }
        }
        if (winner) {
            console.log('Kazanan: ' + winner);
            console.log('Oyun bitti.');
            updateGameHistory();

        }



    }, [currentPlayer, board, winner]);
    function updateGameHistory() {


        const gameRecord = {
            playerName: gameData.username,
            gameName: gameData.gameName,
            winner: winner
        };

        const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        history.push(gameRecord);
        localStorage.setItem('gameHistory', JSON.stringify(history));
    }




    function redirectToGameHistory() {
        history.push('/game-history'); // Redirect to the GameHistory page
    }

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== EMPTY));
    }

    function resetGame() {
        const savedGameData = JSON.parse(localStorage.getItem('gameData'));
        const playerName = savedGameData.username; // Get the actual player name
        const gameName = savedGameData.gameName; // Get the actual game name

        const gameRecord = {
            playerName,
            gameName,
            winner: winner || 'Draw'
        };

        const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        history.push(gameRecord);
        localStorage.setItem('gameHistory', JSON.stringify(history));

        setBoard(createEmptyBoard());
        setCurrentPlayer('player');

        setWinner(null);
    }

    function makeMove(column, color) {
        if (winner) {
            return;
        } else {
            const newBoard = board.map(row => row.slice());
            for (let row = ROWS - 1; row >= 0; row--) {
                if (newBoard[row][column] === EMPTY) {
                    newBoard[row][column] = color;
                    setBoard(newBoard);

                    const gameWon = checkWinner(newBoard, color);
                    if (gameWon) {
                        if (currentPlayer === 'computer') {
                            setWinner('Bilgisayar Kazandı');

                        } else {

                            setWinner('Oyuncu Kazandı');
                        }
                        return; // Oyun kazanıldığında işlemi burada sonlandırın
                    }

                    setCurrentPlayer(currentPlayer === 'player' ? 'computer' : 'player');
                    break;
                }
            }
        }
    }
    function redirectToGameHistory() {
        window.location.href = '/game-history';
    }

    function handlePlayerMove(column) {
        if (currentPlayer === 'player' && !winner) {
            makeMove(column, userColor);
            const playerWon = checkWinner(board, userColor);

            if (playerWon) {
                setWinner('Oyuncu Kazandı');
                return; // Oyuncu kazandığında işlemi burada sonlandırın
            }

            setCurrentPlayer('computer');
        }
    }

    // Kazananı kontrol etmek için Connect Four kurallarını uygular
    function checkWinner(board, color) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLUMNS; col++) {
                if (
                    col + 3 < COLUMNS &&
                    board[row][col] === color &&
                    board[row][col + 1] === color &&
                    board[row][col + 2] === color &&
                    board[row][col + 3] === color
                ) {
                    return true; // Yatay kazanan
                }

                if (
                    row + 3 < ROWS &&
                    board[row][col] === color &&
                    board[row + 1][col] === color &&
                    board[row + 2][col] === color &&
                    board[row + 3][col] === color
                ) {
                    return true; // Dikey kazanan
                }

                if (
                    row + 3 < ROWS &&
                    col + 3 < COLUMNS &&
                    board[row][col] === color &&
                    board[row + 1][col + 1] === color &&
                    board[row + 2][col + 2] === color &&
                    board[row + 3][col + 3] === color
                ) {
                    return true; // Sağ çapraz kazanan
                }

                if (
                    row - 3 >= 0 &&
                    col + 3 < COLUMNS &&
                    board[row][col] === color &&
                    board[row - 1][col + 1] === color &&
                    board[row - 2][col + 2] === color &&
                    board[row - 3][col + 3] === color
                ) {
                    return true; // Sol çapraz kazanan
                }
            }
        }

        return false; // Kazanan yok
    }

    // Bilgisayarın hamlesini belirler
    function findBestMove(board, color) {
        const opponentColor = color === userColor ? computerColor : userColor;

        // Check for winning moves
        for (let col = 0; col < COLUMNS; col++) {
            const tempBoard = board.map(row => row.slice());
            for (let row = ROWS - 1; row >= 0; row--) {
                if (tempBoard[row][col] === EMPTY) {
                    tempBoard[row][col] = color;
                    if (checkWinner(tempBoard, color)) {
                        return col; // Winning move
                    }
                    tempBoard[row][col] = EMPTY; // Undo the move
                    break;
                }
            }
        }

        // Check for opponent's winning moves and block them
        for (let col = 0; col < COLUMNS; col++) {
            const tempBoard = board.map(row => row.slice());
            for (let row = ROWS - 1; row >= 0; row--) {
                if (tempBoard[row][col] === EMPTY) {
                    tempBoard[row][col] = opponentColor;
                    if (checkWinner(tempBoard, opponentColor)) {
                        return col; // Blocking opponent's winning move
                    }
                    tempBoard[row][col] = EMPTY; // Undo the move
                    break;
                }
            }
        }

        // If no winning or blocking moves, choose a random valid move
        const availableColumns = [];
        for (let col = 0; col < COLUMNS; col++) {
            if (board[0][col] === EMPTY) {
                availableColumns.push(col);
            }
        }

        if (availableColumns.length === 0) {
            return null; // No available moves
        }

        const randomColumnIndex = Math.floor(Math.random() * availableColumns.length);
        return availableColumns[randomColumnIndex];
    }


    return (
        <center>
            {winner && <div className='winner_text'><h3>Kazanan: {winner}</h3></div>}

            <div>
                <div style={{ maxWidth: 355 }}>
                    <div className='arka' style={{ display: 'grid', borderRadius: 5, backgroundColor: boardColor, gridTemplateColumns: `repeat(${COLUMNS}, 50px)` }}>
                        {board.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        backgroundColor: cell === EMPTY ? 'white' : cell,
                                        border: '1px solid black',
                                        borderRadius: '50%',
                                    }}
                                    onClick={() => handlePlayerMove(colIndex)}
                                />
                            ))
                        )}
                    </div>

                </div>

                <Button variant='contained' id='muibtn' onClick={resetGame}>Yeniden Başlat</Button>
                <Button variant='contained' id='muibtn' onClick={redirectToGameHistory}>Game History</Button>
            </div>
        </center>
    );


}