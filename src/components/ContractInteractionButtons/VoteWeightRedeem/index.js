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

function VoteWeightRedeem({overseerAddress, currencyAddress, weiAmountString}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: redeemNFT, isLoading, error } = useContractWrite(
    contract,
    "redeemNFT",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);

    try {
      const data = await redeemNFT({ args: [
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
      <SoftButton onClick={submitTransaction} fullWidth color="warning" variant="gradient">
        Redeem
      </SoftButton>
    ) : (
      <SoftButton color="warning" variant="gradient" fullWidth disabled>
        Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
      </SoftButton>
    )}
  </SoftBox>

  );
}

VoteWeightRedeem.propTypes = {
    overseerAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    weiAmountString:PropTypes.string.isRequired,
}

export default VoteWeightRedeem;
