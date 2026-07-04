import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./smartcontract/contracts",
    tests: "./smartcontract/test",
    cache: "./smartcontract/cache",
    artifacts: "./smartcontract/artifacts",
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    ...(sepoliaRpcUrl && deployerPrivateKey
      ? {
          sepolia: {
            url: sepoliaRpcUrl,
            accounts: [deployerPrivateKey],
          },
        }
      : {}),
  },
};

export default config;
