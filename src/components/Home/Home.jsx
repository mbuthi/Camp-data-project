import React from "react";
import Forest from './Forest.jpeg';
import { Link } from "react-router-dom";
function Home({ isLoggedIn }){
    
    const login_checker = () =>{
        if(isLoggedIn === false){
            return(
                <div style={{marginTop:"100px"}} className="row">
                <Link className="cl-white" to="/login">   <button style={{marginRight: "40px"}} className="b-s b-r btn cl-green cl-white fs-20 hand">
                        
                            Get Started
                                                   
                    </button></Link> 
                    <Link className="cl-white" to="/login"><button className="b-s b-r btn cl-green cl-white fs-20 hand">
                        
                            Login
                        
                    </button></Link>
                </div>  
            )
        }else{
            return(
                <div className="right w-50-p">
                    <img style={{width: "400px", height: "360px"}} src={Forest} alt="forest" />
                </div>
            )
        }
    }

    return (
        <div style={{marginTop:"30px"}} className="row h-100vh container b-s b-r b-cl-white">
            <div className="left w-50-p">
                
                <div className="row column">
                    <h1 className="heading-1">CAMP DATA 2022</h1>
                    {login_checker()}
                </div>
            </div>
            <div className="right w-50-p">
                <img className="image" style={{width: "100%"}} src={process.env.PUBLIC_URL+"/images/header-home.jpg"} alt="bird-image" />
            </div>
        </div>
    )
}


export default Home