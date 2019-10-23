import React, {Component} from 'react';
import {BrowserRouter as Router, Route}  from 'react-router-dom'
import Login from './components/Login'
import './App.css';
import FirstPage from './components/FirstPage';


function App() {
    return (
      <div className="App">
        <Router>
          <Route exact path='/' component={Login}/>
          <Route exact path='/firstpage' component={FirstPage}/>
        </Router>
      </div>
    );
  }

export default App;