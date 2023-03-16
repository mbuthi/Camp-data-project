import React, { useEffect, useState }  from "react";
import PopUp from "../Popup/PopUp.jsx"
import AddImage from "../add.png"
import UpdateImage from "../write.png"
import { InputAccession } from "./Input.jsx";
import "./Accession.css"
import { useNavigate } from "react-router-dom";
function Accession(props){    
    const navigate = useNavigate()    
    const [exists, setExists] = useState(false)
    const [count, setCount] = useState(0)
    const [values, setValues] = useState({
        "accessionNumber": "",
        "googleSheetLink":""
    })    
    useEffect(() => {
        async function fetchData() {
            const response = await fetch("https://camp-data.herokuapp.com/api/v1/accession", {
                method:"get",
                headers : {"Content-Type" : "application/json", "Accept" : "application/json", "Authorization" : `Bearer ${props.token}`}                
            })
            const json = await response.json();            
            if (Object.values(json)[1] != ""){                                
                setValues((prevValue) => {
                    return{
                        "accessionNumber": json.accession,
                        "googleSheetLink":json.google_sheet_link     
                    }
                })
                setExists(true)
            }            
        }
        fetchData()
    }, [count])
    const [pop, setPop] = useState(false)
    function handleChange(event){
        const {value, name} = event.target
        setValues((prevValue) => {
            return {
                ...prevValue,
                [name] : value
            }
        })
    }
    function handleClick2(){
        setPop(true)
    }
    function handleClick(event)    {
        var name = event.target.innerText
        setCount(count + 1)
        if (name.toLowerCase() == "add"){
            fetch("https://camp-data.herokuapp.com/api/v1/accession", {
                method : "post",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization' : `Bearer ${props.token}`}, 
                body : JSON.stringify({
                        "accession": parseInt(values.accessionNumber),
                        "google_sheet_link": values.googleSheetLink                    
                })
            }).then(response => response.json())
            .then(data => {
                if (data.detail === "Could not validate credentials" ){
                    alert("could not validate credentials. You need to log in again")
                    navigate("/login")
                }
                else {
                    alert(data.detail)
                    setPop(false)
                }                
            })

        }
        else if (name.toLowerCase() == "update"){
            fetch("https://camp-data.herokuapp.com/api/v1/accession", {
                method:"put",
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization' : `Bearer ${props.token}`}, 
                body : JSON.stringify({
                    "accession": values.accessionNumber,
                    "google_sheet_link": values.googleSheetLink                    
                })
            }).then(response => response.json())
            .then(data => {
                if (data.detail === "Could not validate credentials" ){
                    alert("could not validate credentials. You need to log in again")
                    navigate("/login")
                }
                else{
                    alert(data.detail)
                    setPop(false)
                }
            })
        }
    }
    return (
        <>
        <div className="image">            
            {exists ? <img onClick={handleClick2} src={UpdateImage} alt=""/> : <img onClick={handleClick2} src={AddImage} alt=""/>}
        </div>
        <PopUp trigger={pop} setTrigger={setPop}>
            <div className="updateAddLink row">
            {exists ? <h3>Update data</h3> : <h1>set data</h1>}
            <InputAccession value={values} onChange={handleChange} />
            
            </div>            
            {exists ? <button className="addUpdateBtn btn b-s b-r cl-green cl-white fs-20 hand"  onClick={handleClick}>Update</button> : <button className="addUpdateBtn btn b-s b-r cl-green cl-white fs-20 hand" onClick={handleClick}>Add</button>}
        </PopUp>
        </>
    )
}

export {Accession}