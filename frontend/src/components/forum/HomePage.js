import React from 'react';
import './HomePage.css';
import Navbar from './Navbar';

function HomePage() {
  return (
    <div className="homepage-container">
      <Navbar />
      <main className="homepage-main">
        <h1>Welcome to Blogspace</h1>
        <p className="homepage-tagline">Share your stories. Discover new ideas. Connect with others.</p>
        <a className="homepage-cta" href="/blogs">Explore Blogs</a>
      </main>
    </div>
  );
}

export default HomePage;
