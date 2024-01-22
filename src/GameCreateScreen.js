import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import './GameCreate.css';

function GameCreateScreen() {
    const history = useHistory();

    // Kullanıcı adı, oyun ismi ve renkler için state tanımlanır
    const [gameData, setGameData] = useState({
        username: '',
        gameName: '', // Yeni eklenen oyun ismi
        userColor: localStorage.getItem('userColor') || '#000000', // Kullanıcının rengi, varsayılan siyah
        computerColor: localStorage.getItem('computerColor') || '#FF0000', // Bilgisayarın rengi, varsayılan kırmızı
    });

    useEffect(() => {
        // Local storage'dan gameData'yı al
        const savedGameData = localStorage.getItem('gameData');
        if (savedGameData) {
            setGameData(JSON.parse(savedGameData));
        }
    }, []);

    // Input alanlarındaki değişiklikleri işler
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setGameData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Renkleri localStorage'a kaydet
        localStorage.setItem(name, value);
    };

    // Değerler local storage'a kaydedilir
    useEffect(() => {
        console.log("degerler kaydedildi:", gameData);
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }, [gameData]);

    // Oyunu başlat butonuna tıklama işlevi
    const handleStartGame = () => {
        if (gameData.gameName.trim() === '') {
            alert("Lütfen bir oyun ismi girin.");
        } else {
            // /game sayfasına yönlendirilir
            history.push('/game');
        }
    };

    return (
        <div className="background">
            <img src={"/bg.png"} alt="Background" className="background-image" />
            <div className="centered-div">
                <center>
                    <h2>Oyun Oluştur</h2>
                    <form>
                        <div>
                            <TextField
                                InputLabelProps={{
                                    style: { color: "white" }
                                }}
                                label="Kullanıcı Adı"
                                variant="outlined"
                                name="username"
                                value={gameData.username}
                                onChange={handleInputChange}
                                placeholder='Kullanıcı Adı'
                                style={{ backgroundColor: "transparent" }}
                            />
                        </div>
                        <div>
                            {/* Yeni eklenen oyun ismi alanı */}
                            <TextField
                                InputLabelProps={{
                                    style: { color: "white" }
                                }}
                                label="Oyun İsmi"
                                variant="outlined"
                                name="gameName"
                                value={gameData.gameName}
                                onChange={handleInputChange}
                                placeholder='Oyun İsmi'
                                style={{ backgroundColor: "transparent" }}
                            />
                        </div>
                        <div>
                            <label>Oyuncu Rengi:</label>
                            <input
                                type="color"
                                name="userColor"
                                value={gameData.userColor}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Bilgisayar Rengi:</label>
                            <input
                                type="color"
                                name="computerColor"
                                value={gameData.computerColor}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                    <br />
                    <Button color="warning" variant="contained" onClick={handleStartGame}>
                        Oyunu Başlat
                    </Button>
                </center>
            </div>
        </div>
    );
}

export default GameCreateScreen;

