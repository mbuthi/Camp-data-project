import React, { useState } from "react"
import "./Search.css"

function Search(props){
    const [term, setTerm] = useState("")
    function handleChange(event) {
        const {name, value} = event.target    
        setTerm((prevVal) => {
            return value
        })
    }
    function handleClick() {
        var regExp = /[a-zA-Z]/g;                            
        if(regExp.test(term)){
            alert("search item must be integer")
        } else {
            
            var term_int = parseInt(term)        
            fetch(`https://camp-data.herokuapp.com/api/v1/search/${term_int}`, {
                method : "get",
                headers : {"Content-Type" : "application/json", "Accept" : "application/json", "Authorization" : `Bearer ${props.token}`}
            }).then(data => {
                return data.json()
            }).then(fields => {
                props.setData(fields)                
                props.setKeys(Object.keys(fields))

                var t = Object.values(fields)
                var n = t.map((item) =>  Object.keys(item))
                
                props.setVal(n)
            })
            props.setTrigger(true)
        }        
    }
    return (
        <>
        <div className="search row ">
            <input onChange={handleChange} className="b-r search-input" type="search" placeholder="enter row number to search" />
            <button onClick={handleClick} className="btn b-s b-r cl-green cl-white fs-20 hand">search</button>
        </div>
        </>
    )
}

export default Search