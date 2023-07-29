import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom"
import homeImage from "../../assets/home-img.png";
import Minter from './Minter';
import Gallery from './Gallery';
import CURRENT_USER_ID from '../index';
import { backend } from "../../../declarations/backend"

function Header() {
  const [userNFTIds, setUserNFTIds] = useState([])

  async function getNFTs() {
    const userNFTIds = await backend.getOwnedNFTs(CURRENT_USER_ID)
    setUserNFTIds(userNFTIds)
  }

  useEffect(() => {
    getNFTs()
  }, [])

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/">
              <h5 className="Typography-root header-logo-text">OpenD</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <Link to="/discover">
              <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                Discover
              </button>
            </Link>
            <Link to="/minter">
              <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                Minter
              </button>
            </Link>
            <Link to="/collection">
              <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
                My NFTs
              </button>
            </Link>
          </div>
        </header>
      </div>
      <Routes>
        <Route path="/" element={<img className="bottom-space" src={homeImage} />} />
        <Route path="/collection" element={<Gallery title="My NFTs" nftIds={userNFTIds} />} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/discover" element={<h1>Discover</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;