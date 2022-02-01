import './conversation.css' ;
import { useState,useEffect } from "react";
import axios from 'axios';
export default function Conversation({conversation,curuser,search}) {
    const [user,setUser] = useState({}) ;   
    useEffect(()=>{
     const friendId = conversation.members.find(m=>m != curuser );
     const getUser = async ()=> {
      try{
        const res = await axios("https://flirtaid.herokuapp.com/getuser/"+friendId) ;
        setUser(res.data[0]);
        //console.log(res.data[0]) ;
      }catch(err){
          console.log(err) ;
      }
     }
     getUser() ;

    },[conversation,curuser])
    return (
        <>{user.name?.toLowerCase().includes(search)?(
        <div className="conversation">
            <img className="conversationImg" src={
                user?.image.length>0? user.image[0] :"https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU="
            } alt=""></img>
            <span className="conversationName">{user.name}</span>
        </div>
        )
    :<></>}
        </>
    )
}
