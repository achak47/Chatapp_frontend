import "./Message.css" ;
import { useState,useEffect } from "react";
import {format} from "timeago.js" ;
import axios from 'axios';
var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);
export default function Message({message,own,sender}){
    const [image,setImage] = useState('') ;
    function localdecrypt(str){
        str = Array.from(str) ;
        return String(str.map((e,index) =>{ return String.fromCharCode(e.charCodeAt(0)-(index+1)%5) } )).replaceAll(',','');
    }
    useEffect(async()=>{
      const i = await axios("https://faid-api.herokuapp.com/getphoto/"+sender) ;
      setImage(i.data) ;
      //console.log(i.data) ;
    },[])
    return(
        <div className={own?"message own":"message"}>
            <div className="messageTop">
            <img className="messageImg" src={image.length>0?image:"https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU="} alt="" />
            <p className="messageText">{localdecrypt(encryptor.decrypt(message.text))}</p>
            </div>
            <div className="messageBottom">
           {format(message.createdAt)}
            </div>
        </div>
    )
}