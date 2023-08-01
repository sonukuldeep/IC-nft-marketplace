import React from 'react'

const PriceLabel = ({ sellPrice }) => {
    if (sellPrice == 0) return <></>
    return (
        <div className='disButtonBase-root disClip-root makeStyles-price-23 disClip-outlined'>
            <span className="disClip-label">{sellPrice}</span>
        </div>
    )
}

export default PriceLabel