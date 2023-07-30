import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import NFTActorClass "./NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

actor OpenD {
  private type Listing = {
    // similar to typescript
    itemOwner : Principal;
    itemPrice : Nat;
  };

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

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

  public shared (msg) func listItem(id : Principal, price : Nat) : async Text {
    var item : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
      case null return "NFT does not exist";
      case (?result) result;
    };

    let owner = await item.getOwner();
    if (Principal.equal(owner, msg.caller)) {
      let newListing : Listing = {
        itemOwner = owner;
        itemPrice = price;
      };
      mapOfListings.put(id, newListing);
      return "Success";
    } else {
      return "Unauthorized";
    };
  };

  public query func getMainCanisterId() : async Principal {
    return Principal.fromActor(OpenD);
  };
};
