import React from 'react';
import './App.css';
import Layout from './Layout';

import Login from './Login';
import User from './User';
import Employee from './Employee';
import Division from './Division';
import JobTitle from './JobTitle';
import Cuti from './Cuti';
import Approval from './Approval';
import RequestCuti from './RequestCuti';

import { Route, HashRouter } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <HashRouter>
        <Layout>
          <header className="App-header">
            <Route exact path="/" component={Login}/>
            <Route path="/cuti" component={Cuti}/>
            <Route path="/user" component={User}/>
            <Route path="/employee" component={Employee}/>
            <Route path="/division" component={Division}/>
            <Route path="/approval" component={Approval}/>
            <Route path="/add_cuti" component={RequestCuti}/>
            <Route path="/job_title" component={JobTitle}/>
            <Route path="/login" component={Login}/>
          </header>
        </Layout>
      </HashRouter>
    </div>
  );
}

export default App;
