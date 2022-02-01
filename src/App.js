import Messanger from './Messenger/Messenger'
import { useState,useEffect,useRef } from "react";
import axios from "axios";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";
function App() {
  const [user,Adduser] = useState({}) ;
  const userId = '61978747309114b6e006b291' ;
  useEffect(()=>{
    const getuser = async()=>{
    const u = await axios("https://flirtaid.herokuapp.com/getuser/"+userId) ; 
    Adduser(u.data[0]) ;
    }
    getuser() ;
},[]) ;
  return (
    <Router>
      <Routes>
      <Route path = "/" element={<Messanger user={user}/>} />
      <Route path = "/messanger" element={<Messanger user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
