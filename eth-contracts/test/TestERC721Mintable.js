var ERC721MintableComplete = artifacts.require('RealEstateERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, {from: account_one});
            await this.contract.mint(account_two, 2, {from: account_one});
            await this.contract.mint(account_three, 3, {from: account_one});
            await this.contract.mint(account_three, 4, {from: account_one});
            await this.contract.mint(account_two, 5, {from: account_one});
        })

        it('should return total supply', async function () { 
            // act
            let totalSupply = await this.contract.totalSupply.call();
            // assert
            assert.equal(totalSupply, 5, "Total supply does not match the number of tokens minted");
        })

        it('should get token balance', async function () { 
            // act
            let balanceOf2 =  await this.contract.balanceOf.call(account_two);
            let balanceOf3 =  await this.contract.balanceOf.call(account_three);
            // assert
            assert.equal(balanceOf2, 3, "Balance of account_two does not match number of tokens minted to that account");
            assert.equal(balanceOf3, 2, "Balance of account_three does not match number of tokens minted to that account");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            // act
            let tokenURI1 = await this.contract.tokenURI.call(1);
            let tokenURI2 = await this.contract.tokenURI.call(2);
            // assert
            assert.equal(tokenURI1, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token uri does not match required uri for token 1");
            assert.equal(tokenURI2, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", "Token uri does not match required uri for token 2");         
        })

        it('should transfer token from one owner to another', async function () { 
            // act
            let balanceOf2Before =  await this.contract.balanceOf.call(account_two);
            let balanceOf3Before =  await this.contract.balanceOf.call(account_three);
            await this.contract.transferFrom(account_three, account_two, 4, {from:account_three});
            let balanceOf2After =  await this.contract.balanceOf.call(account_two);
            let balanceOf3After =  await this.contract.balanceOf.call(account_three);
            let newOwner = await this.contract.ownerOf.call(4);
            // assert
            assert.equal(balanceOf2After, Number(balanceOf2Before) + 1, "mensaje1");
            assert.equal(balanceOf3After, Number(balanceOf3Before) - 1, "mensaje2");
            assert.equal(newOwner, account_two, "mensaje3");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            // act
            let reverted = false;
            try {
                await this.contract.mint(account_two, 1, {from: account_two});
            }
            catch(e) {
                reverted = true;
                var revertReason = e.reason;
            }         
            // assert
            assert.equal(reverted, true, "Minting should fail when sender is not contract owner");
            assert.equal(revertReason, "Caller is not the contract owner", "Revert reason is not correct");            
        })

        it('should return contract owner', async function () { 
            // act
            let owner = await this.contract.getOwner.call();
            // assert
            assert.equal(owner, account_one, "Contract owner does not match contract creator");            
        })

    });
})