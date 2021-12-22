import React, { useState } from 'react'
import comuter_image from '../assets/computer.png'

export default function Computer() {
    const [ newComputerGame, setNewComputerGame ] = useState(false)
    return {
        newComputerGame,
        setNewComputerGame,
        renderComputer:(
        <div className='computer'>
            <h1>Computer</h1>
            <div className="profile">
                <img src={comuter_image} alt="" />
            </div>
            <div className="computer_start">
                <button onClick={() => {setNewComputerGame(true)}}>Start Game</button>
            </div>
        </div>)
    }
}
