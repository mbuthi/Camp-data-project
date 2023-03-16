import React from "react"
import  "./PopUp.css";
function Popup(props){
    function handleClick() {
        props.setTrigger(false)
    }    
    return ( props.trigger ?
        <>
        <div className="popup ">
            <div className="popup-inner b-r">
                <button onClick={handleClick} className="btn close-btn">
                    <img src={process.env.PUBLIC_URL + "/images/cancel.png"} alt="cancel-img" />
                </button>
                {props.children}
            </div>
        </div>
        </> : ""
    )
}

export default Popup