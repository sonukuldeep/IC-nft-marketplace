import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft"
import { nft } from "../../../declarations/nft"
import { backend } from "../../../declarations/backend"

import Button from './Button';
import CURRENT_USER_ID from '../index';

function Item(props) {
  const id = props.id
  const localhost = 'http://localhost:8080/'
  const agent = new HttpAgent({ host: localhost })
  // remove when deploying on mainnet
  agent.fetchRootKey()
  const [name, setName] = useState()
  const [owner, setOwner] = useState()
  const [image, setImage] = useState()
  const [priceInput, setPriceInput] = useState("")
  const [showSellInput, setShowSellInput] = useState(false)
  const [NFTActor, setNFTActor] = useState()
  const [loaderHidden, setLoaderHidden] = useState(true)
  const [btnActive, setBtnActive] = useState(true)
  const [blur, setBlur] = useState({})

  async function loadNft() {
    const NFTActor = await Actor.createActor(idlFactory, { agent, canisterId: id })
    setNFTActor(NFTActor)
    const name = await NFTActor.getName()
    const owner = await NFTActor.getOwner()
    const imageData = await NFTActor.getAsset()
    const imageContent = new Uint8Array(imageData)
    const image = URL.createObjectURL(new Blob([imageContent.buffer, { type: "image/png" }]))
    const isListed = await backend.isListed(id)
    if (isListed) {
      setBlur({ filter: "blur(4px)" })
      setOwner("OpenD")
      setBtnActive(false)
    }
    else
      setOwner(owner.toText())
    setName(name)
    setImage(image)
  }

  useEffect(() => { loadNft() }, [])

  async function sellItem() {
    setLoaderHidden(false)
    setBtnActive(false)
    const price = Number(priceInput)
    if (price === NaN) return
    const listingResult = await backend.listItem(id, price)
    console.log(listingResult)
    if (listingResult == "Success") {
      const mainCanisterId = await backend.getMainCanisterId()
      const transferResult = await NFTActor.transferOwnership(mainCanisterId)
      console.log(transferResult)
      setLoaderHidden(true)
      setOwner("OpenD")
      setBlur({ filter: "blur(4px)" })
    }
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image} style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {owner === "OpenD" ? "Listed" : ""}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {showSellInput && btnActive &&
            <input
              placeholder="Price in DANG"
              type="number"
              className="price-input"
              value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
            />
          }
          {btnActive && <Button handleClick={showSellInput ? () => sellItem() : () => setShowSellInput(true)} text={showSellInput ? "Confirm" : "List NFT"} />}
        </div>
      </div>
    </div>
  );
}

export default Item;