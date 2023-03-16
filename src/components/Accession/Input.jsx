import React from "react";


function InputAccession(props) {
   
    return (
        <>
        <div className="group">
            <label className="label" htmlFor="">Start From</label>
            <input value={props.value.accessionNumber} className="b-r" onChange={(event)=>{props.onChange(event)}} name="accessionNumber" type="text" placeholder="enter accession number" />
        </div>            
        <div className="group">
            <label className="label" htmlFor="">Google Sheet Link</label>
            <input value={props.value.googleSheetLink} className=" b-r" onChange={(event)=>{props.onChange(event)}} name="googleSheetLink" type="text" placeholder="enter google sheet link"/>
        </div>    
        </>                    
    )
}

export {InputAccession}