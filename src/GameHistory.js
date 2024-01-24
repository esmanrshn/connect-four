import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

function GameHistory() {
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    gameHistory.forEach((row, index) => {
        row.id = index + 1; // veya başka bir benzersiz kimlik oluşturma yöntemi kullanabilirsiniz
    });

    const columns = [
        { field: 'playerName', headerName: 'Player Name', width: 150 },
        { field: 'gameName', headerName: 'Game Name', width: 150 },
        { field: 'winner', headerName: 'Winner', width: 150 },
    ];

    const getRowId = (row) => row.playerName;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div style={{ width: 500 }}>
                <center>
                    <h2>Game History</h2>
                </center>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={gameHistory}
                        columns={columns}
                        pageSize={10}
                        autoHeight
                        getRowId={getRowId}
                    />
                </div>
            </div>
        </div>
    );
}

export default GameHistory;
