pragma solidity^0.4.17;

contract SimpleWallet {
    address owner;
    
    struct WithdrawlStruct {
        address to;
        uint amount;
    }

    struct Senders {
        bool allowed;
        uint amount_sends;
        mapping(uint => WithdrawlStruct) withdrawls;
    }

    mapping(address => Senders) isAllowedToSendFundsMapping;

    event Deposit(address _sender, uint amount);
    event Withdrawl(address _sender, uint amount, address _beneficiary);

    function SimpleWallet() public {
        owner = msg.sender;
    }

    function() public payable{
        require(msg.sender == owner || isAllowedToSendFundsMapping[msg.sender].allowed == true);
        Deposit(msg.sender, msg.value);
        
    }

    function sendFunds(uint amount, address receiver) public returns (uint) {
        if(isAllowedToSend(msg.sender)) {
            if(this.balance >= amount){
                require(receiver.send(amount) == true);
                Withdrawl(msg.sender, amount, receiver);
                isAllowedToSendFundsMapping[msg.sender].amount_sends++;
                isAllowedToSendFundsMapping[msg.sender].withdrawls[isAllowedToSendFundsMapping[msg.sender].amount_sends].to = receiver;
                isAllowedToSendFundsMapping[msg.sender].withdrawls[isAllowedToSendFundsMapping[msg.sender].amount_sends].amount = amount;
                return this.balance;
            }
        }
    }

    function allowAddressToSendMoney(address _address) public {
        if(msg.sender == owner) {
            isAllowedToSendFundsMapping[_address].allowed = true;
        }
    }

    function disallowAddressToSendMoney(address _address) public {
        if(msg.sender == owner) {
            isAllowedToSendFundsMapping[_address].allowed = false;
        }
    }

    function isAllowedToSend(address _address) public constant returns (bool) {
        return isAllowedToSendFundsMapping[_address].allowed || _address == owner;
    }

    function killWallet() public {
        if(msg.sender == owner) {
            selfdestruct(owner);
        }
    }

}