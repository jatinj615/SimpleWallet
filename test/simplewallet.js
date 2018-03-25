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
        var mycontract;
        SimpleWallet.deployed().then(function(instance){
            return instance.isAllowedToSend.call(accounts[1]);
        }).then(function(isAllowed){
            assert(isAllowed == false, 'the other account was allowed');
        }).then(function(){
            return instance.allowAddressToSendMoney(accounts[1]);
        }).then(function(){
            return instance.isAllowedToSend.call(accounts[1]);
        }).then(function(isAllowed){
            assert(isAllowed == true, 'the other account was not allowed');
        }).then(function(){
            return instance.disallowAddressToSendMoney.call(accounts[1]);
        }).then(function(){
            return instance.isAllowed.call(accounts[1]);
        }).then(function(isAllowed){
            assert(isAllowed == false, 'the account was allowed');
        })
    })
});








