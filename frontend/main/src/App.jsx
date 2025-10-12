import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {ThemeProvider} from './contexts/ThemeContext';
import {ChatProvider} from './contexts/ChatContext';
import {WebSocketProvider} from './contexts/WebSocketContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login' ;
import Register from './pages/Auth/Register' ; 
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import EthicalHacking from './pages/EthicalHacking';
import Donations from './pages/Donations';
import Subscription from './pages/Subscription';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Footer from './components/Layout/Footer';

import './styles/App.css';



function App() {

  return (
    <>

      <ThemeProvider>
        <AuthProvider>
          <WebSocketProvider>
            <ChatProvider>
              <Router>
                {/* TODO visual effects */}

                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:bg-gray-900 relative" >
                  <Navbar></Navbar>
                  <main className="container mx-auto px-4 py-8 relative z-10">
                    <Routes>
                      <Route path='/' element={<Home />}></Route>
                      <Route path='/login' element={<Login />}></Route>
                      <Route path='/register' element={<Register />}></Route>
                      <Route path='/chat' element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      }></Route>
                      <Route path='/' element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }></Route>
                      <Route path='/hacking' element={<EthicalHacking />}></Route>
                      <Route path='/donate' element={<Donations />}></Route>
                      <Route path='/subscription' element={<Subscription />}></Route>
                    </Routes>
                  </main>
                  <Footer></Footer>
                </div>
              </Router>
            </ChatProvider>
          </WebSocketProvider>
        </AuthProvider>
      </ThemeProvider>


    </>
  )
}

export default App
