import React from "react";
import { Link, NavLink } from "react-router-dom";
import './Header.css';
import ProfileIcon from './profile_icon.png';
function Header({isLoggedIn}){    

    const checkLogin = () =>{
        if(isLoggedIn === false){
            return(
                <>
                    <NavLink className="cl-white" to="/login">
                        <li className="row ">Login</li>
                    </NavLink>
                    <NavLink className="cl-white" to="/register">
                        <li className="row ">Register</li>
                    </NavLink> 
                </>
            )
        }else{
            return(
                <>
                    <img style={{width: "40px", height: "40px"}} src={ProfileIcon} alt="profile" />
                    <Link className="cl-white" to="/login" reloadDocument>
                        <li className="row ">Logout</li>
                    </Link> 
                </>
            )
        }
    }
    return (
        <div className="header cl-green cl-white js-cntr row al-i-cntr w-100-vw">
            <nav>
                <div className="row spc-btwn w-100-vw">
                    <ul className="al-s-start spc-ard row w-200 hand">
                        <Link className="cl-white" to="/">
                            <li className="fs-30">CAMP 2022</li>                    
                        </Link>                        
                    </ul>
                    <ul className="al-s-cntr row w-200 spc-ard fs-20 hand">
                        <NavLink className="cl-white" to="/">
                            <li className="row ">Home</li>
                        </NavLink>                        
                        <NavLink className="cl-white" to="/entries">
                            <li className="row ">Entry</li>  
                        </NavLink>                                              
                    </ul>                    
                    <ul className="al-s-end row w-200 spc-ard fs-20 hand">
                        {checkLogin()}                      
                    </ul>
                </div>
                
            </nav>
        </div>
    )
}

export default Header