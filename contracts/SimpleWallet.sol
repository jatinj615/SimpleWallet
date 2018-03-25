pragma solidity^0.4.17;

contract SimpleWallet {
    address owner;
    mapping(address => bool) isAllowedToSendFundsMapping;

    event Deposit(address _sender, uint amount);
    event Withdrawl(address _sender, uint amount, address _beneficiary);

    function SimpleWallet() public {
        owner = msg.sender;
    }

    function() public {
        if(msg.sender == owner || isAllowedToSendFundsMapping[msg.sender] == true){
            Deposit(msg.sender, msg.value);
        } else {
            revert();
        }
    }

    function sendFunds(uint amount, address receiver) public returns (uint) {
        if(msg.sender == owner || isAllowedToSendFundsMapping[msg.sender]) {
            if(this.balance >= amount){
                if(!receiver.send(amount)) {
                    revert();
                }
                Withdrawl(msg.sender, amount, receiver);
                return this.balance;
            }
        }
    }

    function allowAddressToSendMoney(address _address) public {
        if(msg.sender == owner) {
            isAllowedToSendFundsMapping[_address] = true;
        }
    }

    function disallowAddressToSendMoney(address _address) public {
        if(msg.sender == owner) {
            isAllowedToSendFundsMapping[_address] = false;
        }
    }

    function isAllowedToSend(address _address) public constant returns (bool) {
        return isAllowedToSendFundsMapping[_address] || _address == owner;
    }

    function killWallet() public {
        if(msg.sender == owner) {
            selfdestruct(owner);
        }
    }

}