// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;
/**
 * @title voteSystem
 * @dev vote & vote counter
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract VotingSystem {

    /** @dev array keys map values **/
    uint256[] private optionsKeys;

    /** @dev array keys map values **/
    bool private isClosedValue = true;

    /** @dev mapping variables **/
    mapping (uint256 => string) private options;
    mapping (uint256 => uint256) private votes;
    mapping (address => bool) private hasVoted;

    /** @dev code modifiers **/
    modifier alreadyVoted() {
        require(!hasVoted[msg.sender], "This address has already voted");
        _;
    }

    modifier validateOption(uint256 option) {
        require(bytes(options[option]).length > 0, "This option is invalid");
        _;
    }

    modifier isClosed() {
        require(isClosedValue, "The voting is closed");
        _;
    }

    modifier isOpened() {
        require(!isClosedValue, "The voting is not opened");
        _;
    }

    /** @dev voting functions **/
    function vote(uint256 option) public isClosed alreadyVoted validateOption(option) {
        votes[option] += 1;
        hasVoted[msg.sender] = true;
    }

    function getVoteCount(uint256 option) public view returns (uint256) {
        return votes[option];
    }

    function getVoteWinner() public isOpened view returns (string memory) {
        require(optionsKeys.length > 0, "No options available for voting");
        uint256 maxVotes = 0;
        string memory winner;
        for (uint256 i = 0; i < optionsKeys.length; i++) {
            if (votes[i] > maxVotes) {
                maxVotes = votes[i];
                winner = options[i];
            }
        }
        return winner;
    }

   /** @dev voting status functions **/
    function openVoting() public returns(string memory) {
        isClosedValue = false;
        return "Voting is opened now";
    }

    function closeVoting() public returns(string memory) {
        isClosedValue = true;
        return "Voting is closed now";
    }

    /** @dev options function **/
    function addOption(uint256 option, string memory name) public isOpened returns(string memory) {
        for (uint256 i = 0; i < optionsKeys.length; i++) {
            require(optionsKeys[i] != option, "This option number already exists");
        }
        options[option] = name;
        optionsKeys.push(option);
        return "Option succesfull Added";
    }
}
