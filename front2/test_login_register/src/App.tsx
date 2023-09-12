import React from 'react';
import './App.css';
import Register from './components/Register/register';
import { Routes, Route, Router, BrowserRouter } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import Login from "./components/Login/login"

function App() {
	return (
		<div className="App">
			<Routes>
				<Route index element={<App />} />
				<Route path='/' element={<MainPage/>} />
				<Route path='/register' element={<Register/>} />
				<Route path='/login' element={<Login/>} />
			</Routes>
		</div>
	);
}

export default App;
