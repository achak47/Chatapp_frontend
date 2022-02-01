import { useState,useEffect,useRef } from "react";
import "./Messenger.css";
import {Search} from "@material-ui/icons";
export default function Search_fil({onsearch}){
return(
    <div className="searchbar">
    <Search className="searchIcon" />
    <input
      placeholder="Search for contacts"
      className="searchInput"
      onChange={onsearch}
    />
  </div>
)
}