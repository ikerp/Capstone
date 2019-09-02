const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('SquareVerifier');
const proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier', accounts => {

    // arrange
    const account_one = accounts[0];
    const account_two = accounts[1];

    let a = proof.proof.a;
    let b = proof.proof.b;
    let c = proof.proof.c;
    let input = proof.inputs;

    let squareVerifier;
    let solnSquareVerifier;

    beforeEach(async () => {
        squareVerifier = await SquareVerifier.new({from: account_one});
        solnSquareVerifier = await SolnSquareVerifier.new(squareVerifier.address, {from: account_one});
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('Test if a new solution can be added for contract', async () => {
        // act
        let reverted1 = false;
        let reverted2 = false;
        let reason;
        try {
            await solnSquareVerifier.addSolution(account_two, 1, a, b, c, input);
        } catch(e) {
            reverted1 = true;
            // console.log(e.reason);
        };
        try {
            await solnSquareVerifier.addSolution(account_two, 2, a, b, c, input);
        } catch(e) {
            // console.log(e.reason);
            reverted2 = true;
            reason = e.reason;
        };        
        // assert
        assert.equal(reverted1, false, "When we add a valid solution for the first time the operation is reverted");
        assert.equal(reverted2, true, "When we add a repeated and valid solution the operation is not reverted");
        assert.equal(reason, "This solution has been used before", "When we add a repeated and valid solution the reason given to revert is invalid");
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Test if an ERC721 token can be minted for contract', async () => {
        // act
        let reverted1 = false;
        let reverted2 = false;
        let reason2;
        let reason3;
        try {
            await solnSquareVerifier.mintToken(account_two, 1, a, b, c, input, {from:account_one});
        } catch(e) {
            reverted1 = true;
            console.log(e);
        };
        try {
            await solnSquareVerifier.mintToken(account_two, 2, a, b, c, input, {from:account_one});
        } catch(e) {
            reverted2 = true;
            reason2 = e.reason;
            // console.log(e);
        };
        try {
            await solnSquareVerifier.mintToken(account_two, 3, a, b, c, [9,2], {from:account_one});
        } catch(e) {
            reverted3 = true;
            reason3 = e.reason;
            // console.log(e);
        };
        // assert
        assert.equal(reverted1, false, "When we mint a new token with a valid solution for the first time the operation is reverted");
        assert.equal(reverted2, true, "When we mint a new token with a repeated and valid solution the operation is not reverted");
        assert.equal(reason2,"This solution has been used before", "When we mint a new token with a valid but repeated solution the reason given to revert is invalid");
        assert.equal(reverted3, true, "When we mint a new token with an invalid solution the operation is reverted");
        assert.equal(reason3,"The verification of the given solution failed", "When we mint a new token with an invalid solution the reason given to revert is invalid");
    });

})
