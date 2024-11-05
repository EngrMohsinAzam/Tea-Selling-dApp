const hre = require("hardhat");

async function main() {
  console.log("Deploying Chai contract to Sepolia testnet...");

  const Chai = await hre.ethers.getContractFactory("chai");
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  const chaiContract = await Chai.deploy();

  await chaiContract.waitForDeployment();

  console.log("Chai contract deployed to:", await chaiContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });