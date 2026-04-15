import React, { createContext, useContext, useState, useEffect } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = "http://localhost:5000/api";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, name, email }
  const [tutorialEnabled, setTutorialEnabled] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Game state
  const [gameState, setGameState] = useState({
    balance: 10000,
    day: 1,
    xp: 320,
    level: 3,
    healthScore: 72,
    spending: { food: 0, entertainment: 0, transport: 0 },
    budgets: { rent: 3000, food: 2500, entertainment: 1500, transport: 800 },
    investments: { fd: 0, mf: 0, stocks: 0 },
    transactions: [
      { icon: '🏠', name: 'Monthly Rent', cat: 'Housing', amt: -3000, type: 'out', day: 1 }
    ],
    balanceHistory: [10000],
    quizScore: 0,
    quizStreak: 0,
    achievements: [],
  });

  const login = (userData) => {
    setUser(userData);
    setTutorialActive(tutorialEnabled);
    setTutorialStep(0);
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const updateGame = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const addTransaction = (tx) => {
    setGameState(prev => ({
      ...prev,
      transactions: [tx, ...prev.transactions].slice(0, 20),
      balanceHistory: [...prev.balanceHistory, prev.balance].slice(-30),
    }));
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      tutorialEnabled, setTutorialEnabled,
      tutorialStep, setTutorialStep,
      tutorialActive, setTutorialActive,
      currentPage, setCurrentPage,
      gameState, updateGame, addTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
};