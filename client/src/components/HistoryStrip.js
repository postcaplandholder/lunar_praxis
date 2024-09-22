// src/components/HistoryStrip.js
import React, { useState, useRef } from 'react';
import '../styles/HistoryStrip.css';

const HistoryStrip = ({ items }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const historyContentRef = useRef(null);
  const [scrollStartY, setScrollStartY] = useState(0);
  const [contentScrollStart, setContentScrollStart] = useState(0);

  const handleClearHistory = () => {
    setDialogOpen(true);
  };

  const confirmClearHistory = () => {
    setDialogOpen(false);
    console.log('History cleared!');
  };

  const cancelClearHistory = () => {
    setDialogOpen(false);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    setScrollStartY(event.clientY);
    setContentScrollStart(historyContentRef.current.scrollTop);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    const deltaY = event.clientY - scrollStartY;
    const maxScroll = historyContentRef.current.scrollHeight - historyContentRef.current.clientHeight;
    const newScrollTop = Math.min(Math.max(contentScrollStart + deltaY, 0), maxScroll);

    historyContentRef.current.scrollTop = newScrollTop;
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('dialog-overlay')) {
      cancelClearHistory();
    }
  };

  return (
    <div className="history-strip">
      <button className="clear-history-button" onClick={handleClearHistory}>
        Clear
      </button>
      <div className="history-content" ref={historyContentRef}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <span className="history-item">{item}</span>
            {index < items.length - 1 && <span className="history-separator">•</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="scroll-handle" onMouseDown={handleMouseDown}>
        ⇅
      </div>

      {isDialogOpen && (
        <>
          <div className="dialog-overlay" onClick={handleOverlayClick}></div> {/* Overlay */}
          <div className="clear-dialog">
            <div className="dialog-content">
              <p>Are you sure you want to clear the history?</p>
              <button className="confirm-button" onClick={confirmClearHistory}>
                ✔ Clear
              </button>
              <button className="cancel-button" onClick={cancelClearHistory}>
                ✘ Oops!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryStrip;
