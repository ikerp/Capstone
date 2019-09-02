pragma solidity >=0.4.21 <0.6.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// import "./SquareVerifier.sol";
import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateERC721Token {

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address submitter;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    SquareVerifier private squareVerifier;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address to, uint256 tokenId);

    constructor(address squareVerifierAddress) public {
        squareVerifier = SquareVerifier(squareVerifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        bytes32 key = keccak256(abi.encodePacked(a,b,c,input));
        require(uniqueSolutions[key].submitter == address(0), "This solution has been used before");
        uniqueSolutions[key] = Solution({index:tokenId, submitter:to});
        emit SolutionAdded(to, tokenId);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public onlyOwner {
        require(squareVerifier.verifyTx(a, b, c, input), "The verification of the given solution failed");
        addSolution(to, tokenId, a, b, c, input);
        super.mint(to, tokenId);
    }

}

contract SquareVerifier {
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns (bool r);
}