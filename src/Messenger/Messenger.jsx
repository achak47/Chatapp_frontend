import "./Messenger.css";
import styled from 'styled-components'
import axios from "axios";
import Topbar from "./topbar/Topbar";
import Chatbar from "./topbar/Chatbar";
import Search_fil from "./Search.jsx" ;
import Conversation from "../conversations/Conversation" ;
import Message from "../message/Message" ;
import Chatonline from "../chatonline/Chatonline";
import { useState,useEffect,useRef } from "react";
import { io } from "socket.io-client";
import SendIcon from '@material-ui/icons/Send';
var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);
const contacts = ["61bed2b5d18cf546232b0999","61f80b33625f79b251046b8b"]
const id = prompt("Enter the userId") ;

const socket = io.connect('/');

export default function Messanger({user}){
    const userId = contacts[id]  ;
    //61978747309114b6e006b291
    const [conversation,setConversation] = useState([]) ;
    const [currentchat,setCurrentchat] = useState(null) ;
    const [messages,setMessages] = useState([]) ;
    //const [user,Adduser] = useState({}) ;
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    var count = 0 ;
    const [search,setSearch] = useState('') ;
    const socket = useRef() ;
    const scrollRef = useRef() ;
    const User = user ;
    function localencrypt(str){
        str = Array.from(str) ;
        return String(str.map((e,index) =>{ return String.fromCharCode(e.charCodeAt(0)+(index+1)%5) } )).replaceAll(',','');
    }
    useEffect(()=>{
        socket.current = io("ws://faidwebsocket.herokuapp.com/") ;
        //socket.current = io("ws://localhost:8900") ;
        //socket.current = io.connect("http://localhost:3002") ;
        console.log(socket) ;
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
              sender: data.senderId,
              text: data.text,
              createdAt: Date.now(),
            });
          });
    },[]) ;
      useEffect(() => {
        arrivalMessage &&
          currentchat?.members.includes(arrivalMessage.sender) &&
          setMessages((prev) => [...prev, arrivalMessage]);
      }, [arrivalMessage, currentchat]);
    useEffect(()=>{
        //console.log(userId) ;
        socket.current.emit("addUser",userId) ;
        socket.current.on("getUsers", (users)=>{  
            setOnlineUsers(
                user.connected?.filter((f) => users.some((u) => u.userId === f.id))
              );
        }) ;
    },[])
    useEffect(()=>{ //It is similar to ComponentDidMount
     const getConversations = async()=> {
         try{
          const res =  await axios.get("https://faid-chat.herokuapp.com/api/conversations/"+userId) ;
          setConversation(res.data) ;
          //console.log(res.data) ;
         }
         catch(err){
             console.log(err) ;
         }
        }
        getConversations() ;
    },[])
    useEffect(()=>{
     const getMessages = async ()=>{
         //console.log(currentchat) ;
         try{
            const res = await axios.get("https://faid-chat.herokuapp.com/api/messages/"+currentchat._id) ;
            setMessages(res.data) ;
         }
         catch(err){
             console.log(err) ;
         }
     }
     getMessages() ;
    },[currentchat])
    //console.log(messages) ;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(newMessage == '') return;
        var level1encryption = localencrypt(newMessage) ;
        //console.log(level1encryption,localdecrypt(level1encryption))
        var encryptedMessage = encryptor.encrypt(level1encryption) ;
        const message = {
         sender: userId,
         text: encryptedMessage,
         conversationId: currentchat._id
        };
        const receiverId = currentchat.members.find(
            (member) => member !== userId
          );
      
          socket.current.emit("sendMessage", {
            senderId: userId,
            receiverId: receiverId,
            text: encryptedMessage,
          });
      
        try{
         const res = await axios.post("https://faid-chat.herokuapp.com/api/messages/",message) ;
         setMessages([...messages,res.data]) ;
         setNewMessage("");
        }
        catch(err){
           console.log(err) ;
        }
    }
    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])
    function handleChange() {
        setCurrentchat(null);
      }
    function onsearch(event){
     setSearch(event.target.value)
    }
    return(
        <>
        <div className="messenger">           
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {  currentchat?
                    (<>
                    <div className="chatBoxTop">
                    <Chatbar curchat={currentchat} userId={userId} goback={handleChange}/>
                        {messages.map((m)=>(
                            <div ref={scrollRef}>
                           <Message message={m} own={m.sender == userId} sender={m.sender} />
                           </div>
                        ))}
                    </div>
                    <div className="chatBoxBottom">
                    <TypeMessage>
                <main>
                    <AddPhoto>
                        {/* <CameraAltIcon style={{fill: 'white'}}/> */}
                    </AddPhoto>
                    <input type="text" placeholder="Message..." onChange={e => setNewMessage(e.target.value)}/>
                    <SendIcon onClick={handleSubmit}/>
                </main>
            </TypeMessage>
                    </div>
                    </>):(
                        <div className="chatMenu">
                             <Topbar />
                        <div className="chatMenuWrapper">
                       <Search_fil onsearch={onsearch}/>
                <div>           
                 {   
                     conversation.map((c)=>(
                         <div onClick={()=>setCurrentchat(c)}>
                         <Conversation conversation={c} curuser={userId} search={search}/>
                         </div>
                     ))
                 }
                 </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
      {/*    <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <Chatonline onlineUsers={onlineUsers} currentId={userId}
                    setCurrentchat={setCurrentchat} matches={user.connected}/>
                </div>
            </div>
            (<span className="noConversationText">
                        Open a conversation to start a chat
                        </span>) 
            */}
        </div>
        </>
    );
} 
const TypeMessage = styled.div`
    position: fixed;
    bottom: 0px;
    background: #1f2225;
    right: 0;
    left: 0;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    
    main{
        width: calc(100% - 12px);
        display: flex;
        align-items: center;
        background-color: #f1f1f1;
        height: 3rem;
        margin-left: 6px;
        margin-right: 6px;
        border-radius: 100px;
        padding: 0.3rem;
        margin-bottom: 10px;
        padding-right: 1rem;
    }

    input{
        margin: 0.5rem;
        flex: 1;
        font-size: 0.85rem;
        border: none;
        background: transparent;
        outline: none;
    }
`

const AddPhoto = styled.div`
    height: 2.4rem;
    width: 2.4rem;
    border-radius: 50%;
    background-color: red;
    display: grid;
    place-items: center;
`

const Signal = styled.div`
    height: 0.65rem; 
    width: 0.65rem;
    border-radius: 50%;
    background-color: orange;
    margin-left: 0.5rem;
`