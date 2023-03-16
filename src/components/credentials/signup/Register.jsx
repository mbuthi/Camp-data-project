import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { signup } from "../InputsFields";
import Inputs from "../Inputs";



function Register(){
    const navigate = useNavigate();
    const [values, setValues] = useState(
        {
            "email":"",
            "password": "",
            "first name" : "",
            "last name": ""
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
    // console.log(values);
    function handleClick(){
        // setAllValues(values)
        fetch("https://camp-data.herokuapp.com/api/v1/user", {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({
                first_name: values["first name"],
                last_name : values["last name"],
                email : values.email,
                password: values.password
            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.id.length > 0){
                alert(`Welcome ${data.first_name}. Try to log in`);
                navigate("/login", {replace: true});
            }
        })
    }
    return(
    <div style={{marginTop:"30px"}} className="cl-grey container row b-r b-s b-cl-white">
        <div style={{width:"600px"}} className="center-m fs-20 row column">
            <h2 className="b-cl-green heading-2">Register</h2>            
            {
                Object.values(signup).map(
                    (item, index) => {
                        return <Inputs 
                        item={item}                         
                        changeFunc={handleChange}  
                        key={index}                                                                 
                        />
                    }
                )
            }   
            <button onClick={handleClick} className="btn b-s b-r cl-green cl-white fs-20 hand">Register</button>                    
        </div>
    </div>)
}


export default Register