 // src/components/ContentTable.js

 import React, { useState } from 'react';
 import '../styles/ContentTable.css';


const ContentTable = ({ data, columns, topicTitle }) => {
  const [isActionDialogOpen, setActionDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isParticipantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedConversation, setSelectedConversation] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const handleActionClick = (conversation) => {
    setSelectedConversation(conversation);
    setActionDialogOpen(true);
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    setActionDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    console.log(`${selectedAction} for conversation: ${selectedConversation}`);
    setConfirmDialogOpen(false);
  };

  const handleCancel = () => {
    setActionDialogOpen(false);
    setConfirmDialogOpen(false);
  };

  // Handle participants button click
  const handleParticipantClick = (participants) => {
    setSelectedParticipants(participants.split(', '));
    setParticipantDialogOpen(true);
  };

  const handleParticipantDialogClose = () => {
    setParticipantDialogOpen(false);
  };

  // Function to get singular title
  const getSingularTitle = (title) => {
    if (title.endsWith('s')) {
      return title.slice(0, -1); // Remove the last 's' to make it singular
    }
    return title;
  };

  return (
    <div className="content-table-container">
      <h2>{topicTitle}</h2> {/* Dynamic topic title */}
      <table className="content-table">
        <thead>
          <tr>
            <th></th> {/* Action Icon Column */}
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>
                <button
                  className="action-icon"
                  onClick={() => handleActionClick(row.title)}
                >
                  ⋮
                </button>
              </td>
              <td>
                <button onClick={() => console.log('View conversation')}>{row.title}</button> {/* Title as a button */}
              </td>
              <td>{row.owner}</td>
              <td>
                <button
                  className="participant-button"
                  onClick={() => handleParticipantClick(row.participants)}
                >
                  {row.participants}
                </button>
              </td>
              <td>{row.postDate}</td>
              <td>{row.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Action Dialog */}
      {isActionDialogOpen && (
        <>
          <div className="action-dialog-overlay" onClick={handleCancel}></div>
          <div className="action-dialog">
            <div className="dialog-content">
              <p>What action for this {getSingularTitle(topicTitle)}?</p>
            </div>
            <button onClick={() => handleActionSelect('Top 10 (keep on top)')}>
              Top 10 (keep on top)
            </button>
            <button onClick={() => handleActionSelect('Not Top 10 (make room)')}>
              Not Top 10 (make room)
            </button>
            <button onClick={() => handleActionSelect('Remove (from conversations)')}>
              Remove (from conversations)
            </button>
            <button className="cancel-button" onClick={handleCancel}>✘ Oops!</button>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && (
        <>
          <div className="action-dialog-overlay" onClick={handleCancel}></div>
          <div className="confirm-dialog">
            <div className="dialog-content">
              <p>Are you sure you want to {selectedAction}?</p>
            </div>
            <button className="confirm-button" onClick={handleConfirm}>
              ✔ Yes
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              ✘ Oops!
            </button>
          </div>
        </>
      )}

      {/* Participants Dialog */}
      {isParticipantDialogOpen && (
        <>
          <div className="dialog-overlay" onClick={handleParticipantDialogClose}></div>
          <div className="participants-dialog">
            <h3>Participants</h3>
            <table>
              <tbody>
                {selectedParticipants.map((participant, index) => (
                  <tr key={index}>
                    <td>{participant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="cancel-button" onClick={handleParticipantDialogClose}>✘ Oops!</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentTable;