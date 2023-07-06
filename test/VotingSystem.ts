import { expect } from "chai";
import { ethers } from "hardhat";

describe("VotingSystem", function () {
  let votingSystem: any;

  beforeEach(async function () {
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    votingSystem = await VotingSystem.deploy();
    await votingSystem.deployed();
  });
  
  it("Open the voting successfully", async function () {
    
    const result = await votingSystem.openVoting();

    expect(result).to.equal("Voting is opened now");
  });

  it("Should add an option successfully", async function () {
    const option = 1;
    const name = "Option 1";

    const result = await votingSystem.addOption(option, name);

    expect(result).to.equal("Option succesfull Added");
    expect(await votingSystem.options(option)).to.equal(name);
  });

  it("Should vote successfully", async function () {
    const option = 1;
    const name = "Option 1";

    await votingSystem.addOption(option, name);

    const result = await votingSystem.vote(option);

    expect(result).to.be.not.reverted;
    expect(await votingSystem.getVoteCount(option)).to.equal(1);
  });

  it("Should not allow voting for an invalid option", async function () {
    const option = 2;
    const name = "Option 2";

    await votingSystem.addOption(1, "Option 1");

    await expect(votingSystem.vote(option)).to.be.revertedWith("This option is invalid");
    expect(await votingSystem.getVoteCount(option)).to.equal(0);
  });

  it("Should not allow voting more than once", async function () {
    const option = 1;
    const name = "Option 1";

    await votingSystem.addOption(option, name);

    await votingSystem.vote(option);

    await expect(votingSystem.vote(option)).to.be.revertedWith("This address has already voted");
    expect(await votingSystem.getVoteCount(option)).to.equal(1);
  });

  it("Should get the correct vote count", async function () {
    const option1 = 1;
    const option2 = 2;
    const name1 = "Option 1";
    const name2 = "Option 2";

    await votingSystem.addOption(option1, name1);
    await votingSystem.addOption(option2, name2);

    await votingSystem.vote(option1);
    await votingSystem.vote(option2);
    await votingSystem.vote(option2);

    expect(await votingSystem.getVoteCount(option1)).to.equal(1);
    expect(await votingSystem.getVoteCount(option2)).to.equal(2);
  });

  it("Should get the correct vote winner", async function () {
    const option1 = 1;
    const option2 = 2;
    const name1 = "Option 1";
    const name2 = "Option 2";

    await votingSystem.addOption(option1, name1);
    await votingSystem.addOption(option2, name2);

    await votingSystem.vote(option1);
    await votingSystem.vote(option2);
    await votingSystem.vote(option2);

    expect(await votingSystem.getVoteWinner()).to.equal(name2);
  });

  it("Should open and close voting successfully", async function () {
    expect(await votingSystem.isClosed()).to.equal(true);

    const openResult = await votingSystem.openVoting();
    expect(openResult).to.equal("Voting is opened now");
    expect(await votingSystem.isClosed()).to.equal(false);

    const closeResult = await votingSystem.closeVoting();
    expect(closeResult).to.equal("Voting is closed now");
    expect(await votingSystem.isClosed()).to.equal(true);
  });
});
