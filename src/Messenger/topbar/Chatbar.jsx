import "./Topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
//import { AuthContext } from "../../context/AuthContext";

export default function Chatbar({curchat,userId,goback}) {
  //const { user } = useContext(AuthContext);
  const [name,Setname] = useState('') ;
  useEffect(()=>{
    const getUser = async ()=> {
    const friendId = curchat.members.find(m=>m != userId );
    const res = await axios("https://flirtaid.herokuapp.com/getuser/"+friendId) ;
    console.log(res.data[0].name)
    Setname(res.data[0].name)
    }
    getUser() ;
  },[])
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <ArrowBackIcon style={{fill: 'white'}} onClick={goback} /> 
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">{name}</span>
        </Link>
      </div>
      <div className="topbarCenter">
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
        </div>
        {
  /*
  <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
  */
}
      </div>
    </div>
  );
}