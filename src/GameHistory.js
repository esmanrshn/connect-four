import React from 'react';

function GameHistory() {
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

    return (
        <div>
            <h2>Game History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Player Name</th>
                        <th>Game Name</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                <tbody>
                    {gameHistory.map((record, index) => (
                        <tr key={index}>
                            <td>{record.playerName}</td>
                            <td>{record.gameName}</td>
                            <td>{record.winner}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GameHistory;
