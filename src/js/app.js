App = {
    web3provider: null,
    contract: {},

    init: function(){
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
          } else {
            // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
          }
        web3 = new Web3(App.web3Provider);
        // web3.eth.getAccounts(function(err, acc){console.log(acc)});
        return App.initContract();          
    },

    initContract: function(){
        $.getJSON('../build/contracts/SimpleWallet.json', function(data){
            var walletArifact = data;
            App.contract.SimpleWallet = TruffleContract(walletArifact);
            App.contract.SimpleWallet.setProvider(web3.currentProvider);

            return App.getBalance();
        });
    },

    getAccounts: function(){
        web3.eth.getAccounts(function(err, acc){
            if(err){
                console.log(err);
            } else {
                $('#accounts').append("<option></option>");
                for(i = 0; i < acc.length; i++){
                    $('#accounts').append("<option>"+acc[i]+"</option>");
                }
            }
        });
    },

    sendFunds: function(amount, address){
        contract = App.contract;
        // console.log(amount);
        contract.SimpleWallet.deployed().then(function(instance){
            web3.eth.sendTransaction({from: address, to: instance.address, value: web3.toWei(amount, 'ether')}, function(error, result) {
                if(error){
                    console.log(error);
                } else {
                    console.log(result);
                }
                return App.getBalance();
            });
        });
    },

    getBalance: function(){
        contract = App.contract;
        contract.SimpleWallet.deployed().then(function(instance){
            balance = web3.eth.getBalance(instance.address).toNumber();
            balanceInEther = web3.fromWei(balance, 'ether');
            $('#bal').html('Balance : '+balance);
            $('#baleth').html('Balance In Ether : '+balanceInEther);
        });
    },

    withdrawFunds: function(amount, address){
        contract = App.contract;
        contract.SimpleWallet.deployed().then(function(instance){
            console.log(instance.address);
            instance.sendFunds(amount, address, {from: web3.eth.accounts[0], gas:3000000}).then(function(newBal){
                console.log(newBal);
                return App.getBalance();
            });
        });
    },

    
}

$(function() {
    $(window).load(function() {
      App.init();
    });
});

$('#send-funds').click(function(){
    $('#accounts').empty();
    App.getAccounts();
});

$('#deposit-funds').click(function(){
    var address = $('#accounts').val();
    var amount = parseInt($('#amount').val());
    App.sendFunds(amount, address);
});

$('#withdraw-funds').click(function(){
    var amount = parseInt($('#withdrawAmount').val());
    var address = $('#addressTo').val();
    App.withdrawFunds(amount, address);
})
