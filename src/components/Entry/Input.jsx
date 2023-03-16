import React from "react";

function Input(props){
    return (
        <>
        <div className="row spc-btwn" style={{marginBottom:"40px"}}>
            <label className="cl-grey inline-blck" htmlFor="">{props.item.name}</label>
            <input onChange={(event) => {props.changeFunc(event)} } type="text"  className="input b-r" name={props.item.name} placeholder={"enter " +props.item.name}/>
        </div>            
        </>            
    )
}

export default Input