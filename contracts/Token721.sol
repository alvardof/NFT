// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Token721 is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, AccessControl, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant WHITE_LIST_ROLE = keccak256("WHITE_LIST_ROLE"); 
    bool public mintState = false; 
    bool public revealed = false; 
    uint public constant MAX_MINT_SUPPLY = 4;
    string public baseURI;
    mapping(uint256 => string) private _hashIPFS;
    mapping(uint256 => address) private _ownBurnableToken;


    /**
     * @dev set roles and routing 
     */
    constructor() ERC721("Token721", "FJA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        baseURI = "https://ipfs.io/ipfs/";
    }


    /**
     * @dev add accounts to whitelist
     */
    function addWhiteList(address _vip) public onlyRole(DEFAULT_ADMIN_ROLE){
        
        _grantRole(WHITE_LIST_ROLE, _vip);
    
    }

    /**
     * @dev disclose NFT
     */
    function revelateNFT() public onlyRole(DEFAULT_ADMIN_ROLE){
        
        revealed = true;
    
    }


     /**
     * @dev start minting 
     */
    function startMint() public onlyRole(DEFAULT_ADMIN_ROLE){
        
        mintState = true;
    
    }
    

    /**
     * @dev function to return base URL 
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
    


    /**
     * @dev pause contract 
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    

    
    /**
     * @dev restart contract 
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }



    function burn_(uint256 tokenId) public{
        
        _burn(tokenId);
    }

    /**
     * @dev burn token 
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        require(!paused());
        require(_ownBurnableToken[tokenId] == msg.sender,"burn only own tokens");
        super._burn(tokenId);
    }
    
    
    

    /**
    *@dev mint token
    1)must not be paused 
    2)there must be tokens left to be minted
    3)only whitelist may mint before sale 
    4)verify that the cost per token minted is the same as the cost per token minted.
    5)join the IDs with the paths of the images and finish coining.
     */
    function mint(string[] memory _hashes) public payable onlyRole(MINTER_ROLE){
        require(!paused());
        require(_tokenIdCounter.current() < MAX_MINT_SUPPLY && _hashes.length <= (MAX_MINT_SUPPLY - _tokenIdCounter.current()),"mint up to the allowed limit");
        require(mintState == true || hasRole(WHITE_LIST_ROLE,msg.sender),"only whitelist can mint before sale");
        require(msg.value >= 0.01 ether,"cost of 0.01 ether for  token minted");
        uint256 supply = totalSupply();

        for (uint256 i = 0; i < _hashes.length; i++){
            _safeMint(msg.sender, supply + 1);
            _hashIPFS[supply + 1] = _hashes[i];
            _ownBurnableToken[supply + 1] = msg.sender; 
            _tokenIdCounter.increment();
        }


    }


    /**
    * 
    @dev the routes are maintained for the IPF depending on whether the tokens are hidden or not. 
    */

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();

            if(revealed == false){
               return "https://gateway.pinata.cloud/ipfs/QmS9AKM9syMn4uFmUTQwStZg3SzbX4huLQdG4DcDC8obtw";
            }
            return
            (bytes(currentBaseURI).length > 0 &&
                bytes(_hashIPFS[tokenId]).length > 0)
            ? string(abi.encodePacked(currentBaseURI, _hashIPFS[tokenId]))
            : "";
            
        
    }



    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
}