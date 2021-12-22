import React, {useContext, useEffect} from 'react'
import { useNavigate } from 'react-router';
import { SocketContext } from '../context/socket';

export default function Challengers({setNewGame, times, challengers, setChallengers}) {
    const socket = useContext(SocketContext)
    const nav = useNavigate();
    const accept = (challenger, cid) => {
        var room = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        var time;
        if (times[cid] === 0) {
            time = '010';
        }
        else if (times[cid] === 1) {
            time = '011';
        }
        else if (times[cid] === 2) {
            time = '020';
        }
        else if (times[cid] === 3) {
            time = '030';
        }
        else if (times[cid] === 4) {
            time = '032';
        }
        else if (times[cid] === 5) {
            time = '050';
        }
        else if (times[cid] === 6) {
            time = '100';
        }
        else if (times[cid] === 7) {
            time = '300';
        }
        else if (times[cid] === 8) {
            time = '600';
        }
        else {
            time = 'null'
        }
        socket.emit('accept', ({challenger, room, time:time}))
        setChallengers(old => old.filter(e => e !== challenger))
        setNewGame(false)
        nav('/Game/' + time + room)
    }
    const refuse = (challenger) => {
        setChallengers(old => old.filter(e => e !== challenger))
    }
    useEffect(() => {
        return () => {}
    }, [])
    return (
        <div className='challengers'>
            {challengers && challengers.map((challenger, cid) => (
                    <div style={{top:(cid + 1)*85+'px'}} className='challenger' key={cid}>
                        <p style={{color:'white'}}>challenge from {challenger}</p>
                        <button onClick={() => {
                            accept(challenger, cid);
                        }}>accept</button> 
                        <button onClick={() => {
                            refuse(challenger);
                        }}>refuse</button> 
                    </div>
            ))}
        </div>
    )
}
