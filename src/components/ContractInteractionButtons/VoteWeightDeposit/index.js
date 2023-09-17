// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

// web3 library
import {  useContractWrite, 
          useContract,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function VoteWeightDeposit({overseerAddress, currencyAddress, weiAmountString}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: depositNFT, isLoading, error } = useContractWrite(
    contract,
    "depositNFT",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);    
    // refresh figures
    window.location.reload();    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await depositNFT({ args: [
        currencyAddress,
        weiAmountString
          ]});
        handleSuccess(data);
    } catch (err) {
      console.error("contract call failure", err);
      setTxnLoading(false);
    }
  }

  return (
    <SoftBox>
    { !txnLoading ? (
    <SoftButton onClick={submitTransaction} fullWidth color="primary" variant="gradient">
        Deposit
    </SoftButton>
    ) : (
    <SoftButton color="primary" variant="gradient" fullWidth disabled>
      Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
    </SoftButton>
    )}
  </SoftBox>

  );
}

VoteWeightDeposit.propTypes = {
    overseerAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    weiAmountString:PropTypes.string.isRequired,
}

export default VoteWeightDeposit;