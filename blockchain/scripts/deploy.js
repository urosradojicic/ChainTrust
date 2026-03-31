const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // 1. Deploy CMT Token
  const CMTToken = await hre.ethers.getContractFactory("CMTToken");
  const cmt = await CMTToken.deploy();
  await cmt.waitForDeployment();
  const cmtAddr = await cmt.getAddress();
  console.log("CMTToken:", cmtAddr);

  // 2. Deploy ChainMetricsRegistry
  const Registry = await hre.ethers.getContractFactory("ChainMetricsRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  const registryAddr = await registry.getAddress();
  console.log("ChainMetricsRegistry:", registryAddr);

  // 3. Deploy StakingVault
  const Staking = await hre.ethers.getContractFactory("StakingVault");
  const staking = await Staking.deploy(cmtAddr);
  await staking.waitForDeployment();
  const stakingAddr = await staking.getAddress();
  console.log("StakingVault:", stakingAddr);

  // 4. Deploy VerificationBadge
  const Badge = await hre.ethers.getContractFactory("VerificationBadge");
  const badge = await Badge.deploy();
  await badge.waitForDeployment();
  const badgeAddr = await badge.getAddress();
  console.log("VerificationBadge:", badgeAddr);

  // 5. Deploy TimelockController (1 day min delay)
  const TimelockController = await hre.ethers.getContractFactory("TimelockController");
  const timelock = await TimelockController.deploy(
    86400, // 1 day min delay
    [deployer.address], // proposers
    [deployer.address], // executors
    deployer.address    // admin
  );
  await timelock.waitForDeployment();
  const timelockAddr = await timelock.getAddress();
  console.log("TimelockController:", timelockAddr);

  // 6. Deploy ChainMetricsDAO
  const DAO = await hre.ethers.getContractFactory("ChainMetricsDAO");
  const dao = await DAO.deploy(cmtAddr, timelockAddr);
  await dao.waitForDeployment();
  const daoAddr = await dao.getAddress();
  console.log("ChainMetricsDAO:", daoAddr);

  console.log("\n--- Copy these into src/lib/contracts.ts ---");
  console.log(`export const CONTRACTS = {`);
  console.log(`  CMTToken: '${cmtAddr}',`);
  console.log(`  ChainMetricsRegistry: '${registryAddr}',`);
  console.log(`  StakingVault: '${stakingAddr}',`);
  console.log(`  VerificationBadge: '${badgeAddr}',`);
  console.log(`  TimelockController: '${timelockAddr}',`);
  console.log(`  ChainMetricsDAO: '${daoAddr}',`);
  console.log(`} as const;`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
