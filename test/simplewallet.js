var SimpleWallet = artifacts.require("./SimpleWallet.sol");

contract('SimpleWallet', function(accounts) {
    it('the owner is allowed to send funds', function(){
        SimpleWallet.deployed().then(function(instance){
            return instance.isAllowedToSend.call(accounts[0]);    
        }).then(function(isAllowed){
            assert(isAllowed == true, 'the owner should have been allowed to send funds');
        });
    });

    it('should not be allowed to send funds', function(){
        SimpleWallet.deployed().then(function(instance){
            return instance.isAllowedToSend.call(accounts[2]);    
        }).then(function(isAllowed){
            assert(isAllowed == false, 'the other account was allowed');
        });
    });

    it("should add accounts to the allowed list", function(){
        SimpleWallet.deployed().then(function(instance){
            return instance.isAllowedToSend.call(accounts[1]);
        }).then(function(isAllowed){
            assert(isAllowed == false, 'the other account was allowed');
        });
        SimpleWallet.deployed().then(function(instance){
            return instance.allowAddressToSendMoney(accounts[1]);
        });
        SimpleWallet.deployed().then(function(instance){
            return instance.isAllowedToSend.call(accounts[1]);
        }).then(function(isAllowed){
            assert(isAllowed == true, 'the other account was not allowed');
        });
        SimpleWallet.deployed().then(function(instance){
            return instance.disallowAddressToSendMoney.call(accounts[1]);
        });
        SimpleWallet.deployed().then(function(instance){
            return instance.isAllowed.call(accounts[1]);
        }).then(function(isAllowed){
            assert(isAllowed == false, 'the account was allowed');
        });
    });

    it("should check deposit events", function(done){
        SimpleWallet.deployed().then(function(instance){
            var meta = instance;
            var event = meta.allEvents();
            event.watch(function(error, result){
                if(error){
                    console.err(error);
                } else {
                    assert(result.event == 'Deposit');
                    assert(web3.fromWei(result.args.amount.valueOf(), 'ether') == 1);
                    assert(result.args._sender.valueOf() == web3.eth.accounts[0]);
                    event.stopWatching();
                    done();
                }
            });
            web3.eth.sendTransaction({from : web3.eth.accounts[0], to: meta.address, value: web3.toWei(1, 'ether')});
        });
    });

    it("should check not allowed Deposit Events", function(done){
        SimpleWallet.deployed().then(function(instance){
            var meta = instance;
            web3.eth.sendTransaction({from : web3.eth.accounts[1], to: meta.address, value: web3.toWei(1, 'ether')}, function(error, result){
                if(error){
                   console.err(error);
                } else {
                    done();
                }
            });

        });
    });

    it('should check send funds function', function(){
        SimpleWallet.deployed().then(function(instance){
            instance.sendFunds(web3.toWei(1, 'ether'), accounts[2]).then(function(err, result){
                if(err){
                    console.log(err);
                } else {
                    console.log(result);
                }
            })
        });
    });
});








