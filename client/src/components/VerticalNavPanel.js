// src/components/VerticalNavPanel.js

import React, { useState } from 'react';
import '../styles/VerticalNavPanel.css'; // Ensure styles are correctly added

const VerticalNavPanel = ({ isExpandable = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpand = () => {
    if (isExpandable) {
      setIsExpanded((prev) => !prev); // Properly toggle the state
    }
  };

  return (
    <div className={`vertical-nav-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="toggle-button" onClick={handleToggleExpand}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {isExpanded && <div className="panel-content">Content goes here...</div>}
    </div>
  );
};

export default VerticalNavPanel;
