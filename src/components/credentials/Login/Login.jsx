import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { login } from "../InputsFields";
import Inputs from "../Inputs";

function Login({setToken, setIsLoggedIn}){
    const navigate = useNavigate();
    const [values, setValues] = useState(
        {
            "email":"",
            "password": ""
        }
    )
    const [allValues, setAllValues] = useState({})
    function handleChange(event){
        const {value , name} = event.target
        
        setValues((prevValues) => {
            return {
                ...prevValues,
                [name] : value
            }
        })        
    }
    function handleClick(){
        fetch("https://camp-data.herokuapp.com/token", {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({
                email : values.email,
                password: values.password
            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.access_token){
                setToken(data.access_token);
                setIsLoggedIn(true);
                alert(`Login Successful`)
                navigate("/entries", {replace: true});
                
            }else{
                setIsLoggedIn(false);
                alert(data.detail)
                navigate("/login", {replace: true});
            }
        })     
    }
    return(
    <div style={{marginTop:"30px"}} className="cl-grey container row b-r b-s b-cl-white">
        <div style={{width:"600px"}} className="center-m fs-20 row column">
            <h2 className="b-cl-green heading-2">Login</h2>            
            {
                Object.values(login).map(
                    (item, index) => {
                        return <Inputs 
                        item={item}                         
                        changeFunc={handleChange}  
                        key={index}                                                                 
                        />
                    }
                )
            }   
            <button onClick={handleClick} className="btn b-s b-r cl-green cl-white fs-20 hand">Login</button>                    
           
        </div>
    </div>)
}


export default Login