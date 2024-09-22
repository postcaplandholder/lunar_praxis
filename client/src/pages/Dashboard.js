// src/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import TopNavBar from '../components/TopNavBar';
import TopicButtons from '../components/TopicButtons';
import HistoryStrip from '../components/HistoryStrip';
import ContentTable from '../components/ContentTable'; // Use this import
import VerticalNavPanel from '../components/VerticalNavPanel';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [activeTopic, setActiveTopic] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(true);
  const [topicTypes, setTopicTypes] = useState([]);
  const [histories, setHistories] = useState({});

  const mockTopicTypes = [
    { name: 'Message', title: 'Conversations' },
    { name: 'Support', title: 'Tickets' },
    { name: 'Praxis', title: 'Proposals' },
    { name: 'Financial', title: 'Reports' },
  ];

  const mockHistories = {
    Message: ['Conversation 1', 'Reply to Alice', 'Reply to Bob', 'Conversation 2'],
    Support: ['Ticket 1234', 'Response from Support Team'],
    Praxis: ['Proposal for New Project', 'Review by Jane Doe'],
    Financial: ['Invoice 2024-01', 'Payment Received'],
  };

  useEffect(() => {
    setTopicTypes(mockTopicTypes);
    setActiveTopic(mockTopicTypes[0].name);
    setHistories(mockHistories);
  }, []);

  const data = {
    Message: [{ id: 1, title: 'Conversation 1', owner: 'Kelly', participants: 'Alice, Bob', postDate: '2024-09-05', lastUpdated: '2024-09-05' }],
    Support: [{ id: 1, title: 'Ticket 1234', participants: 'User, Support Team', lastUpdated: '2024-09-01' }],
    Praxis: [{ id: 1, title: 'Proposal 1', participants: 'John Doe', lastUpdated: '2024-09-02' }],
    Financial: [{ id: 1, title: 'Invoice 2024-01', participants: 'Finance Dept.', lastUpdated: '2024-09-03' }],
  };

  const handleTopicChange = (topic) => setActiveTopic(topic);
  const toggleFilterPanel = () => setFilterVisible(!isFilterVisible);

  return (
    <div className="dashboard">
      <TopNavBar />
      <TopicButtons topics={topicTypes} activeTopic={activeTopic} onChange={handleTopicChange} />
      <HistoryStrip items={histories[activeTopic] || []} />
      <div className="content-container">
        <div className="main-content">
        <ContentTable
          data={data[activeTopic] || []}
          columns={['Title', 'Owner', 'Participants', 'Post Date', 'Last Updated']}
          topicTitle={topicTypes.find(topic => topic.name === activeTopic)?.title || 'Conversations'}
        />
        </div>
        {isFilterVisible ? (
          <VerticalNavPanel title="Filters" isExpandable={true} />
        ) : (
          <button className="expand-button" onClick={toggleFilterPanel}>Expand</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
