// library components
import {  useContractWrite, useContract } from "@thirdweb-dev/react";
import {useState, useEffect} from 'react';

// layout components
import Card from "@mui/material/Card";
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import SoftInput from 'components/SoftInput';
import { CircularProgress } from "@mui/material";
import SoftButton from "components/SoftButton";

// data
import { utils } from "ethers";

function Faucet() {
  const [amount, setAmount] = useState('');
  const [amountWei, setAmountWei] = useState();
  const [txnLoading, setTxnLoading] = useState(false);

  const handleAmountInput = (event) => {
    setAmount(event.target.value);
    const amountBN = utils.parseUnits(event.target.value, 18);
    setAmountWei(amountBN);
  }

  const wethABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "guy",
          "type": "address"
        },
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "src",
          "type": "address"
        },
        {
          "name": "dst",
          "type": "address"
        },
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "dst",
          "type": "address"
        },
        {
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "src",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "guy",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "src",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "dst",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "dst",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "src",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "wad",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    }
  ];

  const { contract } = useContract('0xB6d246305098955Df72b171D8D02095dB7b375B7', wethABI);
  const { mutateAsync: deposit, isLoading, error } = useContractWrite(
    contract,
    "deposit",
  );

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await deposit({ overrides: {
        value: amountWei
      }});
        handleSuccess(data);
    } catch (err) {
      console.error("contract call failure", err);
      setTxnLoading(false);
    }
  }

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <SoftBox p={2}>
          <SoftTypography variant="body2">
            This is a helper page to wrap Optimism Goerli ETH for easier testing on this web application.
          </SoftTypography>
          <SoftBox my={2}>
          <SoftTypography variant="h5">
            Acquire Optimism Goerli ETH
          </SoftTypography>
          <SoftTypography variant="body2">
            If you do not have any Optimism Goerli ETH, go to <SoftTypography component="a" href="https://faucet.quicknode.com/optimism/goerli">QuickNode</SoftTypography> or <SoftTypography component="a" href="https://coinbase.com/faucets/optimism-goerli-faucet">Coinbase</SoftTypography> to receive some.
          </SoftTypography>
          </SoftBox>
          <SoftTypography variant="h5">
            Wrap Optimism Goerli ETH
          </SoftTypography>
          <SoftTypography variant="body2">
            Afterwards, you can wrap into WETH to contribute to projects. Token Address: <SoftTypography component="a" href="https://goerli-optimism.etherscan.io/token/0xB6d246305098955Df72b171D8D02095dB7b375B7">0xB6d246305098955Df72b171D8D02095dB7b375B7</SoftTypography>
          </SoftTypography>
          <SoftBox sx={{width: '10rem'}} display="flex-inline">
            <SoftInput value={amount} onInput={handleAmountInput} />
          </SoftBox>
            <SoftBox my={1} display="flex-inline">
            { (!txnLoading) ? (
            <SoftButton onClick={submitTransaction} color="info" variant="gradient">
            Wrap
            </SoftButton>
          ) : (
            <SoftButton color="info" disabled variant="gradient">
              Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
            </SoftButton>
          )}
          </SoftBox>
        </SoftBox>
      </Card>
    </DashboardLayout>
  );
}

export default Faucet;
