import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection


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

    // Önceki sayfadan kullanıcı ve bilgisayar renklerini al
    const userColor = localStorage.getItem('userColor') || 'blue';
    const computerColor = localStorage.getItem('computerColor') || 'red'; // Varsayılan olarak kırmızı

    useEffect(() => {
        if (checkWinner(board, userColor)) {
            setWinner('Oyuncu Kazandı');
            setTimeout(() => {
                redirectToGameHistory();
            }, 1000);
        } else if (checkWinner(board, computerColor)) {
            setWinner('Bilgisayar Kazandı');
            setTimeout(() => {
                redirectToGameHistory();
            }, 1000);
        } else if (isBoardFull() && !winner) {
            setTimeout(() => {
                resetGame();
            }, 1000);
        }

        if (currentPlayer === 'computer' && !winner) {
            setTimeout(() => {
                const bestMove = findBestMove(board);
                if (bestMove !== null) {
                    makeMove(bestMove, computerColor);
                }
            }, 1000);
        }
    }, [currentPlayer, board, winner]);
    function redirectToGameHistory() {
        history.push('/game-history'); // Redirect to the GameHistory page
    }

    // useEffect(() => {
    //     if (checkWinner(board, userColor)) {
    //         setWinner('Oyuncu Kazandı');
    //     } else if (checkWinner(board, computerColor)) {
    //         setWinner('Bilgisayar Kazandı');
    //     } else if (isBoardFull() && !winner) {
    //         setTimeout(() => {
    //             resetGame();
    //         }, 1000);
    //     }

    //     if (currentPlayer === 'computer' && !winner) {
    //         setTimeout(() => {
    //             const bestMove = findBestMove(board);
    //             if (bestMove !== null) {
    //                 makeMove(bestMove, computerColor);
    //             }
    //         }, 1000);
    //     }
    // }, [currentPlayer, board, winner]);

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== EMPTY));
    }

    function resetGame() {
        const playerName = 'Player Name'; // Replace with the actual player name input
        const gameName = 'Game Name'; // Replace with the actual game name input

        const gameRecord = {
            playerName,
            gameName,
            winner
        };

        const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
        history.push(gameRecord);
        localStorage.setItem('gameHistory', JSON.stringify(history));

        setBoard(createEmptyBoard());
        setCurrentPlayer('player');
        if (winner) {
            console.log('Kazanan: ' + winner);
            console.log('Oyun bitti.');
        }
        setWinner(null);
    }

    function makeMove(column, color) {
        const newBoard = board.map(row => row.slice());
        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][column] === EMPTY) {
                newBoard[row][column] = color;
                setBoard(newBoard);
                setCurrentPlayer(currentPlayer === 'player' ? 'computer' : 'player');
                break;
            }
        }
    }

    function handlePlayerMove(column) {
        if (currentPlayer === 'player' && !winner) {
            makeMove(column, userColor);
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
        <div>
            {/* Oyun tahtasının görsel temsili */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLUMNS}, 50px)` }}>
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

            {/* Kazanan bilgisini göster */}
            {winner && <div>Kazanan: {winner}</div>}

            {/* Oyunu yeniden başlat butonu */}
            <button onClick={resetGame}>Yeniden Başlat</button>
        </div>
    );
}