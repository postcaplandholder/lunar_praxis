// src/components/TopicButtons.js

import React from 'react';
import '../styles/TopicButtons.css';

const TopicButtons = ({ topics, activeTopic, onChange }) => {
  return (
    <div className="topic-buttons">
      {topics.map((topic) => (
        <button
          key={topic.name}  // Use topic.name as the key for uniqueness
          onClick={() => onChange(topic.name)}  // Trigger change by name
          className={activeTopic === topic.name ? 'active' : ''}
        >
          {topic.name} {/* Use name for the button label */}
        </button>
      ))}
    </div>
  );
};

export default TopicButtons;