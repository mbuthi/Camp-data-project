import React, { useState, useEffect } from "react";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import allInputFields from "./inputFIelds";
import Search from "../search/Search.jsx";
import PopUp from "../Popup/PopUp.jsx"
import { Accession } from "../Accession/Accession";
function Entry({token, isLoggedIn}){
    const navigate = useNavigate();

    useEffect(() =>{
        if(isLoggedIn === false){
            navigate('/login');
        }
    }, [])

    const [values, setValues] = useState({
        family : "",
        genus : "",
        species : "",
        authority : "",
        "local name" : "",
        language : "",
    })
    const [allVals, setAllVals] = useState({})
    function handleChange(event){
        const {value, name} = event.target        
        setValues((prevVal) => {
            return {
                ...prevVal,
                [name] : value
            }
        })
    }
    const [pop, setPop] = useState(false)
    const [data, setData] = useState({})
    const [keys, setKeys] = useState([])
    const [val, setVal] = useState([])
    function handleClick(event) {
        setAllVals(values)
        fetch("https://camp-data.herokuapp.com/api/v1/data", {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization' : `Bearer ${token}`},
            body: JSON.stringify({
                family : values.family,
                genus: values.genus,
                species: values.species,
                authority: values.authority,
                localName: [values["local name"]],
                language: values.language,
                country: values.country,

            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.detail === "Could not validate credentials"){
                alert("Could not validate credentials. You need to login again");
                navigate("/login", {replace: true})
            }else{
                Array.from(document.querySelectorAll("input")).forEach(
                    input => (input.value = "")
                );
                alert(data.detail);
            }
        }) 
    }    
    return (  
        <>
        <div style={{marginTop:"30px"}} className="cl-grey container row b-r b-s b-cl-white">
            <div style={{width:"600px"}} className="center-m fs-20 row column">
                <Search setVal={setVal} setKeys={setKeys} setData={setData} token={token} isLoggedIn={isLoggedIn} setTrigger={setPop}/>
                <Accession 
                    token={token}
                />
                <PopUp trigger={pop} setTrigger={setPop} >
                    <div style={{flexWrap: "wrap"}} className="row">
                    {keys.map((itemKey, index) => {                        
                        return <div className="modal-container b-r">
                            <p className="modal-p modal-p-first" key={index + 1}>{itemKey}</p>
                            <p className="modal-p modal-p-second" key={index}>{data[itemKey][val[index]]}</p>
                            </div>
                    })}
                    </div> 
                    
                </PopUp>
                <h2 className="b-cl-green heading-2">Add Your Data</h2>                
                {
                    Object.values(allInputFields).map((item, index) => {                        
                        return <Input 
                            item={item}
                            key={index}
                            changeFunc={handleChange}
                        />
                    })
                }
                <button onClick={handleClick} className="btn b-s b-r cl-green cl-white fs-20 hand">Send Data</button>                   
            </div>                        
        </div>
        </>                      
    )
}

export default Entry