const hre = require("hardhat");
const { ethers } = require("ethers");

async function getBalances(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return ethers.formatEther(balanceBigInt);
}

async function consoleBalances(addresses) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter} balance:`, await getBalances(address));
    counter++;
  }
}

async function consoleMemos(memos) {
  console.log("\nMemos:");
  for (const memo of memos) {
    console.log(`From: ${memo.from}, Message: ${memo.message}, Timestamp: ${memo.timestamp}`);
  }
}

async function main() {
  try {
    console.log("Starting the script...");

    const [owner, from1, from2, from3] = await hre.ethers.getSigners();
    
    console.log("Signers obtained. Logging addresses:");
    console.log("Owner address:", owner.address);
    console.log("From1 address:", from1.address);
    console.log("From2 address:", from2.address);
    console.log("From3 address:", from3.address);

    const chai = await hre.ethers.getContractFactory("chai");
    const contract = await chai.deploy(); // This deploys the contract

    // Wait for the contract to be mined
    await contract.waitForDeployment();

    console.log("Address of contract:", await contract.getAddress());

    const addresses = [
      owner.address,
      from1.address,
      from2.address,
      from3.address,
    ];
    
    console.log("\nBefore buying chai");
    await consoleBalances(addresses);

    const amount = { value: ethers.parseEther("1") };
    await contract.connect(from1).buyChai("from1", "Very nice chai", amount);
    await contract.connect(from2).buyChai("from2", "Very nice course", amount);
    await contract
      .connect(from3)
      .buyChai("from3", "Very nice information", amount);

    console.log("\nAfter buying chai");
    await consoleBalances(addresses);

    const memos = await contract.getMemos();
    await consoleMemos(memos);

    console.log("Script completed.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exitCode = 1;
});
