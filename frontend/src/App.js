import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/forum/HomePage';
import BlogsForum from './components/forum/BlogsForum';
import BlogDetail from './components/blogs/BlogDetail';
import CreateBlog from './components/blogs/CreateBlog';
import Profile from './components/auth/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogsForum />} />
          <Route path="/blogs/create" element={<CreateBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
