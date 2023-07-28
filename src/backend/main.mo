import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import NFTActorClass "./NFT/nft";
import Cycles "mo:base/ExperimentalCycles"

actor OpenD {
  public shared (msg) func mint(imgData : [Nat8], name : Text) : async Principal {
    let owner : Principal = msg.caller;

    Cycles.add(1_000_000_000_000); // Since this value increases as time passes, change this value according to error in console. 
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    let newNFTPrincipal = await newNFT.getCanisterID();
    Debug.print(debug_show (Cycles.balance()));
    return newNFTPrincipal;
  };
};
