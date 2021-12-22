import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

const MyTimer = forwardRef((props, ref) => {
  const {
    seconds,
    minutes,
    hours,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp:props.expiryTimestamp, autoStart:false, onExpire: () => props.id === 'mytimer' && props.setTimeover(true) });
  useImperativeHandle(ref, () => ({
    start() {
      start();
    },
    pause() {
      pause();
    },
    resume() {
      resume();
    },
    incr() {
      var remaining = (minutes*60 + seconds)
      restart(new Date().setSeconds(new Date().getSeconds() + remaining + props.incr), false);
    },
    set() {
      var remaining = (minutes*60 + seconds)
      return (new Date().setSeconds(new Date().getSeconds() + remaining))
    },
    newSet() {
      restart(props.newTime, false)
    }
  }));
  useEffect(() => {
    return () => {}
  }, [])
  return (
    <div className='timer' style={{textAlign: 'center'}}>
      <div style={{fontSize: '40px', color:'white'}}>
        {hours ? 
        <div>
          <span>{hours < 10 ? '0' + hours:hours}</span>:<span>{minutes < 10 ? '0' + minutes:minutes}</span>:<span>{seconds < 10 ? '0' + seconds:seconds}</span>
        </div>
          :
        <div>
          <span>{minutes < 10 ? '0' + minutes:minutes}</span>:<span>{seconds < 10 ? '0' + seconds:seconds}</span>
        </div>
        }
      </div>
    </div>
  );
})
export default MyTimer;