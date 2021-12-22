import React from 'react'
import puzzle_image from '../assets/puzzle.png'

export default function Puzzles() {
    return (
        <div className='puzzles'>
            <h1>Puzzles</h1>
            <div className="profile">
                <img src={puzzle_image} alt="" />
            </div>
            <div className="puzzle_start">
                <button>comming soon...</button>
            </div>
        </div>
    )
}
