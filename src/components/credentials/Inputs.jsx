import React from "react";


function Inputs(props){
    return (
        <>
        <div className="row spc-btwn" style={{marginBottom:"40px"}}>
            <label className="cl-grey inline-blck" htmlFor="">{props.item.name}</label>
            <input type="text"  onChange={(event)=>{props.changeFunc(event)}}  className="input b-r" name={props.item.name} placeholder={props.item.placeholder}/>
        </div>            
        </>  
    )
}

export default Inputs