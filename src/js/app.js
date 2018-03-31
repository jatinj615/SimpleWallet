App = {
    web3provider: null,
    contract: {},

    init: function(){
        // if (typeof web3 !== 'undefined') {
        //     App.web3Provider = web3.currentProvider;
        //   } else {
            // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        //   }
        web3 = new Web3(App.web3Provider);
        // web3.eth.getAccounts(function(err, acc){console.log(acc)});
        // return App.initContract();          
    },

    initContract: function(){
        $.getJSON('../build/contracts/SimpleWallet.json', function(err, data){
            var walletArifact = data;
            App.contract.SimpleWallet = TruffleContract(walletArifact);
            App.contract.SimpleWallet.setProvider(App.web3provider);
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
    }


    
}

$(function() {
    $(window).load(function() {
      App.init();
      App.initContract();
    });
});

$('#send-funds').click(function(){
    $('#accounts').empty();
    App.getAccounts();
});

$('#deposit-funds').click(function(){
    var address = input;
    var amount = parseInt();
});