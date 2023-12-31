import React from 'react'

export default function Button(props) {
    return (
        <div onClick={props.handleClick} className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
                className="form-Chip-label"
            >
                {props.text}
            </span>
        </div>
    )
}
