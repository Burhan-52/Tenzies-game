import React, { useState, useEffect } from 'react'
import { Die } from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import "../index.css"

export default function Tenzies() {
    const [allnewdice, setallnewdice] = useState(dice());
    const [time, settime] = useState(40);
    const [count, setcount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [tenzies, settenzies] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showWinMessage, setShowWinMessage] = useState(false);
    const [showLostMessage, setShowLostMessage] = useState(false);

    useEffect(() => {
        const allheld = allnewdice.every((x) => x.isHeld);
        const allsame = allnewdice.every((x) => x.value === allnewdice[0].value);

        if (allheld && allsame) {
            settenzies(true);
            setIsRunning(false);
            settime(0);
            setShowWinMessage(true);
            setShowLostMessage(false);
            console.log("You won!");
        } else if (allheld && !allsame) {
            setShowLostMessage(true);
            setShowWinMessage(false);
            console.log("Please click on the same value of dice.");
        }
    }, [allnewdice]);

    var t;
    useEffect(() => {
        if (gameStarted) {
            t = setInterval(() => {
                settime((prevTime) => {
                    if (prevTime === 0 || tenzies) {
                        clearInterval(t);
                        setIsRunning(false);
                        if (!tenzies) {
                            setShowLostMessage(true);
                        }
                        return 0;
                    } else {
                        return prevTime - 1;
                    }
                });
            }, 10000);

            return () => clearInterval(t);
        }
    }, [gameStarted, tenzies]);

    const style = {
        backgroundColor: gameStarted ? "blue" : "red",
    };

    function handleNewgame() {
        setallnewdice(dice()); // Generate new dice values with disabled set to false
        setcount(0);
        settenzies(false);
        setIsRunning(false);
        settime(40); // Set timer to 30
        setGameStarted(true); // Set gameStarted to true
        setShowMessage(true);
        setShowWinMessage(false);
        setShowLostMessage(false);

        let t = setInterval(() => {
            settime((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(t);
                    setIsRunning(false);
                    setShowLostMessage(true);
                    setShowWinMessage(false);
                    return 0;
                } else {
                    return prevTime - 1;
                }
            });
        }, 1000);
    }

    function dice() {
        let arr = [];
        let num = 10;
        for (let i = 1; i <= num; i++) {
            arr.push({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid(),
                disabled: false, // Set disabled to false for new dice
            });
        }
        return arr;
    }

    function generate() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid(),
            disabled: false, // Set disabled to false for new dice
        };
    }

    function holdDice(id) {
        setallnewdice((prev) =>
            prev.map((x) =>
                x.id === id ? { ...x, isHeld: !x.isHeld } : x
            )
        );
    }

    useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                setShowMessage(false);
            }, 2000);
        }
    }, [showMessage]);

    function handleClick() {
        if (time === 0) {
            setallnewdice((prev) =>
                prev.map((x) => ({ ...x, disabled: false })) // Enable all dice when the timer reaches zero
            );
            setcount(0);
            settenzies(false);
            setIsRunning(false);
        } else {
            setcount(count + 1);
            if (!tenzies) {
                setallnewdice((prev) =>
                    prev.map((x) => (x.isHeld ? x : generate())) // Generate new values for non-held dice
                );
            } else {
                settenzies(false);
                setIsRunning(false);
                setcount(0);
                setallnewdice((prev) =>
                    prev.map((x) => ({ ...x, isHeld: false, disabled: true }))
                );
                settime(0);

            }
        }
    }

    return (
        <div className="main-container">
            <div className="section">
                {tenzies && <Confetti />}
                <p>
                    00:
                    {time < 10 ? "0" + time : time} Seconds
                </p>
                <p>   {showMessage && "Timer started!"}</p>
                <h1>Tenzies</h1>
                <div className='description'>Keep rolling the dice until they all show the same value. Click on each die to lock its current value before rolling again. The game timer does not start until you click 'New Game.' Your objective is to win the game before the time runs out.</div>
                <div className="container">
                    <div className="dice-container">
                        {allnewdice.map((x) => (
                            <Die
                                value={x.value}
                                isHeld={x.isHeld}
                                key={x.id}
                                holdDice={() => holdDice(x.id)}
                                disabled={x.disabled || time === 0}
                            />
                        ))}
                    </div>
                </div>
                {showWinMessage && tenzies && <p>You won!</p>}
                {showLostMessage && !tenzies && <p>Time's up! You lost.</p>}
                <div className="btn-container">
                    {gameStarted ? (
                        time === 0 || tenzies ? (
                            <button
                                onClick={handleNewgame}
                                style={{ background: "red" }}
                                className="btn"
                            >
                                New Game
                            </button>
                        ) : (
                            <button onClick={handleClick} style={style} className="btn">
                                Roll
                                <span className="count">{count}</span>
                            </button>
                        )
                    ) : (
                        <button onClick={handleNewgame} style={style} className="btn">
                            New Game
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}