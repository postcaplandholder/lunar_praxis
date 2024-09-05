// src/pages/HomePage.js

import React from 'react';
import Message from '../components/Message';
import Support from '../components/Support';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Message />
      <Support />
    </div>
  );
};

export default HomePage;
