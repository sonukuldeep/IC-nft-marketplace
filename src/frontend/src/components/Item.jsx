import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory } from "../../../declarations/nft"
import { idlFactory as tokenIdlFactory } from "../../../declarations/token"
import { backend } from "../../../declarations/backend"
import Button from './Button';
import CURRENT_USER_ID from '../index';
import PriceLabel from './PriceLabel';
import { Principal } from '@dfinity/principal';

function Item(props) {
  const id = props.id
  const inCollections = props.page === "Discover"
  const localhost = 'http://localhost:8080/'
  const agent = new HttpAgent({ host: localhost })
  // remove when deploying on mainnet
  agent.fetchRootKey()
  const [name, setName] = useState()
  const [owner, setOwner] = useState()
  const [image, setImage] = useState()
  const [priceInput, setPriceInput] = useState("")
  const [NFTActor, setNFTActor] = useState()
  const [loaderHidden, setLoaderHidden] = useState(true)
  const [btnActive, setBtnActive] = useState(true)
  const [blur, setBlur] = useState({})
  const [showCollection, setShowCollection] = useState(false)
  const [listedPrice, setListedPrice] = useState(0)
  const [originalIdOfOwner, setOriginalIdOfOwner] = useState()
  const [shouldDisplay, setShouldDisplay] = useState(true)

  async function loadNft() {
    const NFTActor = await Actor.createActor(idlFactory, { agent, canisterId: id })
    setNFTActor(NFTActor)
    const name = await NFTActor.getName()
    const owner = await NFTActor.getOwner()
    const imageData = await NFTActor.getAsset()
    const imageContent = new Uint8Array(imageData)
    const image = URL.createObjectURL(new Blob([imageContent.buffer, { type: "image/png" }]))

    const isListed = await backend.isListed(id)

    const originalOwner = await backend.getOriginalOwner(id)
    setOriginalIdOfOwner(originalOwner)
    if (isListed) {
      !inCollections && setBlur({ filter: "blur(4px)" })
      setOwner("OpenD")
      setBtnActive(false)
      const listedPrice = await backend.getListedPrice(id)
      setListedPrice(listedPrice.toString())
    }
    else
      setOwner(owner.toText())

    setName(name)
    setImage(image)

    setShowCollection(inCollections && originalOwner.toText() !== CURRENT_USER_ID.toText())
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


  async function handleBuy() {
    setLoaderHidden(false)
    console.log("buy triggered")
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("aax3a-h4aaa-aaaaa-qaahq-cai")
    })

    const sellerId = originalIdOfOwner
    const itemPrice = Number(listedPrice)

    const result = await tokenActor.transfer(sellerId, itemPrice)
    if (result === "Success") {
      const result = await backend.completePurchase(id, sellerId, CURRENT_USER_ID)
      console.log(result)
    }
    setLoaderHidden(true)
    setShouldDisplay(false)
  }
  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
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
          <PriceLabel sellPrice={listedPrice} />
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {owner === "OpenD" ? "Listed" : ""}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {showCollection ?
            <Button handleClick={handleBuy} text={"Buy"} /> :
            btnActive && <BuyOrSell functionToRun={sellItem} btnText="List NFT" price={priceInput} setPrice={setPriceInput} />}
        </div>
      </div>
    </div>
  );
}

export default Item;

function BuyOrSell({ functionToRun, btnText, price, setPrice }) {
  const [showInput, setShowInput] = useState(false)
  const [showText, setshowText] = useState(btnText)

  function clickHandler() {
    showInput && functionToRun()
    setshowText("Confirm")
    setShowInput(true)
  }

  return (
    <>
      {showInput && <input
        placeholder="Price in DANG"
        type="number"
        className="price-input"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />}
      <Button handleClick={clickHandler} text={showText} />
    </>
  )
}