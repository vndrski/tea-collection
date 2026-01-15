import { useEffect, useMemo, useRef, useState } from 'react';

const PRESETS = [20, 35, 55, 80, 120];

function TimerWidget() {
  const [showModal, setShowModal] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = useRef(null);

  const progressOffset = useMemo(() => {
    if (!totalSeconds) return 0;
    const radius = 63;
    const circumference = 2 * Math.PI * radius;
    const progress = (totalSeconds - secondsLeft) / totalSeconds;
    return circumference * (1 - progress);
  }, [secondsLeft, totalSeconds]);

  useEffect(() => {
    if (!showWidget) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setShowWidget(false);
          alert("⏰ Temps d'infusion terminé !");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showWidget]);

  const startTimer = (seconds) => {
    setTotalSeconds(seconds);
    setSecondsLeft(seconds);
    setShowModal(false);
    setShowWidget(true);
  };

  const closeTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setShowWidget(false);
    setSecondsLeft(0);
    setTotalSeconds(0);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <>
      {showWidget && (
        <div id="timer-widget" className={`timer-widget ${secondsLeft <= 10 ? 'pulsing' : ''}`}>
          <div className="timer-widget-content">
            <div className="timer-circular-progress">
              <svg viewBox="0 0 140 140">
                <circle className="timer-circle-bg" cx="70" cy="70" r="63" />
                <circle
                  className="timer-circle-progress"
                  cx="70"
                  cy="70"
                  r="63"
                  style={{ strokeDashoffset: progressOffset }}
                />
              </svg>
              <div className="timer-widget-display">{minutes}:{seconds}</div>
            </div>
            <button className="timer-widget-close" onClick={closeTimer}>×</button>
          </div>
        </div>
      )}

      <button className="timer-fab" onClick={() => setShowModal(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>

      {showModal && (
        <div id="timer-modal" className="timer-modal">
          <div className="timer-modal-content">
            <h3>Durée d'infusion</h3>
            <div className="timer-presets-grid">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  className="preset-btn-large"
                  onClick={() => startTimer(preset)}
                >
                  {preset < 60 ? `${preset}s` : `${Math.floor(preset / 60)}m${preset % 60 || ''}`}
                </button>
              ))}
            </div>
            <button className="timer-modal-close" onClick={() => setShowModal(false)}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}

export default TimerWidget;
