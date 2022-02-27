const Token721 = artifacts.require('Token721');
const expect = require('chai').expect;


contract('Token721', account => {
    [account_1, account_2, account_3, account_4, account_5, account_6] = account;
    let Token721Instance;

    beforeEach(async () => {
        Token721Instance = await Token721.new({from: account_1});
    });


});


    


       


        

        it('only whitelist can mint before sale ', async () => {

            
           try {
                
                Token721Instance = await Token721.new({from: account_4});
                await Token721Instance.mint(["QmcLkFCxE4fsqUZei9LqCNnUgq3EP6WUgBLNVXcDhww828"], {value : '10000000000000000',from: account_4});

                
            } catch (error) {

                expect(error.reason).to.equal('only whitelist can mint before sale');
                
            }

        });


        it('cost per mint', async () => {

            Token721Instance = await Token721.new({from: account_1});

            await Token721Instance.startMint({from: account_1});

            await Token721Instance.mint(["QmcLkFCxE4fsqUZei9LqCNnUgq3EP6WUgBLNVXcDhww828"], {value : '10000000000000000',from: account_1});
            


        });

    


   
    
    
        it('burn own tokens', async () => {

            Token721Instance = await Token721.new({from: account_5});

            await Token721Instance.startMint({from: account_5});

            await Token721Instance.mint(["QmcLkFCxE4fsqUZei9LqCNnUgq3EP6WUgBLNVXcDhww828"], {value : '10000000000000000',from: account_5});

            await Token721Instance.burn_(1,{from: account_5});

        });
    
    
    
    
    


    
    it('Exist tokenId', async () => {

      
        try {
                
            Token721Instance = await Token721.new({from: account_6});
            
            await Token721Instance.startMint({from: account_6});

            await Token721Instance.mint(["QmcLkFCxE4fsqUZei9LqCNnUgq3EP6WUgBLNVXcDhww828"], {value : '10000000000000000',from: account_6});

            await Token721Instance.tokenURI(1,{from: account_6});
            
        } catch (error) {

            expect(error.reason).to.equal('ERC721Metadata: URI query for nonexistent token');
            
        }



    });


    it('token limit 4', async () => {

           
        try {

            Token721Instance = await Token721.new({from: account_1});

            await Token721Instance.startMint({from: account_1});

            await Token721Instance.mint(["QmcLkFCxE4fsqUZei9LqCNnUgq3EP6WUgBLNVXcDhww828"], {value : '10000000000000000',from: account_1});

            await Token721Instance.mint(["QmcLkFCxE4fsqUZei9LqCNnUgq3EP6WUgBLNVXcDhww828"], {value : '10000000000000000',from: account_1});

            await Token721Instance.mint(["QmUiZsyJAmD8MojjU2jqdbic7ZXwEAE2oKMLo8h227vFVQ"], {value : '10000000000000000',from: account_1});

            await Token721Instance.mint(["QmUiZsyJAmD8MojjU2jqdbic7ZXwEAE2oKMLo8h227vFVQ"], {value : '10000000000000000',from: account_1});

            await Token721Instance.mint(["QmUiZsyJAmD8MojjU2jqdbic7ZXwEAE2oKMLo8h227vFVQ"], {value : '10000000000000000',from: account_1});


        } catch (error) {

            expect(error.reason).to.equal('mint up to the allowed limit');
            
        }


    
    });




    




/*
    context('contructor', async () => {

        it('Start nominations at 0', async () => {

            const nominations = await VotingInstance.number_candidates();
            expect(nominations.toNumber()).to.equal(0);
        
        });

    });


    context('User registration', async () => {

        it('The user cannot be previously registered', async () => {
            try {
                
                await VotingInstance.registerUser({from: account_1});
                await VotingInstance.registerUser({from: account_1});
                
            } catch (error) {

                expect(error.reason).to.equal('Previously registered user');
                
            }
           
        });

        

    });



    context('Nominate candidates', async () => {

        it('Only the owner can nominate candidates', async () => {

            
            try {

                await VotingInstance.nominationCantidate(account_4 , {from: account_2});

            } catch (error) {

                expect(error.reason).to.equal('Caller is not owner');
                
            }

        
        });



        it('The candidate must be previously registered as a user', async () => {

            
            try {

                await VotingInstance.nominationCantidate(account_4 , {from: account_1});

            } catch (error) {

                expect(error.reason).to.equal('Candidate not previously registered as a voter/user');
                
            }

        
        });


        it('The candidate cannot run again', async () => {

            
            try {

                await VotingInstance.registerUser({from: account_4});
                await VotingInstance.nominationCantidate(account_4 , {from: account_1});
                await VotingInstance.nominationCantidate(account_4 , {from: account_1});

            } catch (error) {

                expect(error.reason).to.equal('Candidate already nominated');
                
            }

        
        });



        it('Maximum of 5 candidates may apply', async () => {

            
            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.registerUser({from: account_3});
                await VotingInstance.registerUser({from: account_4});
                await VotingInstance.registerUser({from: account_5});
                await VotingInstance.registerUser({from: account_6});
                await VotingInstance.registerUser({from: account_7});
                await VotingInstance.nominationCantidate(account_2 , {from: account_1});
                await VotingInstance.nominationCantidate(account_3 , {from: account_1});
                await VotingInstance.nominationCantidate(account_4 , {from: account_1});
                await VotingInstance.nominationCantidate(account_5 , {from: account_1});
                await VotingInstance.nominationCantidate(account_6 , {from: account_1});
                await VotingInstance.nominationCantidate(account_7 , {from: account_1});

            } catch (error) {

                expect(error.reason).to.equal('Finished the 5 available nominations');
                
            }

        
        });

        




    });


    context('Voting', async () => {
    

        it('voter must be previously registered', async () => {


            try {

                await VotingInstance.registerUser({from: account_8});
                await VotingInstance.nominationCantidate(account_8, {from: account_1});

                await VotingInstance.vote(account_8, {from: account_9});


            } catch (error) {

                expect(error.reason).to.equal('voter not previously registered');
                
            }
        
            
        
        });


        
        it('You can only vote once', async () => {

            
            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.registerUser({from: account_3});
                await VotingInstance.nominationCantidate(account_3 , {from: account_1});

                await VotingInstance.vote(account_3 , {from: account_2});
                await VotingInstance.vote(account_3 , {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('User previously voted');
                
            }

        
        });
        

            
         it('the candidate must be previously nominated', async () => {


            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.registerUser({from: account_8});
                await VotingInstance.vote(account_8, {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('Candidate not previously registered');
                
            }
        
            
        
        });
        

        

        it('Cannot vote for itself', async () => {


            try {

                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.nominationCantidate(account_2, {from: account_1});

                await VotingInstance.vote(account_2, {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('cannot self-vote');
                
            }
        
            
        
        });
        


        it('cannot vote after one week', async () => {


            try {

                await time.increase();
                await VotingInstance.registerUser({from: account_5});
                await VotingInstance.registerUser({from: account_2});
                await VotingInstance.nominationCantidate(account_5, {from: account_1});
                await VotingInstance.vote(account_5, {from: account_2});


            } catch (error) {

                expect(error.reason).to.equal('one week to vote has expired');
                
            }
        
        });


    });

*/


