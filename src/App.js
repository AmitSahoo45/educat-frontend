import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import LoginPage from "./authPages/LoginPage/LoginPage";
import RegisterPage from "./authPages/RegisterPage/RegisterPage";
import Dashboard from "./Dashboard/Dashboard";
import Classroom from "./Classroom/Classroom";
import Quiz from './Classroom/Quiz/Quiz'
import AlertNotification from "./shared/components/AlertNotification";

import "./App.css";
import CreateQuiz from "./Classroom/CreateQuiz/CreateQuiz";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route exact path="/classroom/create">
            <CreateQuiz />
          </Route>
          <Route exact path="/classroom/edit/:id">
            <CreateQuiz />
          </Route>
          <Route exact path="/classroom/quiz/:id">
            <Quiz />
          </Route>
          <Route path="/classroom">
            <Classroom />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Router>
      <AlertNotification />
    </>
  );
}

export default App;
