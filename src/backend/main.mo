import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import NFTActorClass "./NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

actor OpenD {

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

  public shared (msg) func mint(imgData : [Nat8], name : Text) : async Principal {
    let owner : Principal = msg.caller;

    Cycles.add(15_000_000_000); // Since this value increases as time passes, change this value according to error in console.
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    let newNFTPrincipal = await newNFT.getCanisterID();
    Debug.print(debug_show (Cycles.balance()));
    mapOfNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);
    return newNFTPrincipal;
  };

  private func addToOwnershipMap(owner : Principal, nftId : Principal) {
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs := List.push(nftId, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs);
  };

  public query func getOwnedNFTs(user : Principal) : async [Principal] {
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray<Principal>(ownedNFTs);
  };
};
