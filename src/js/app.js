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
    }
}

$(function() {
    $(window).load(function() {
      App.init();
    });
});