// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

// web3 library
import {  useAddress,
          useContractWrite, 
          useContract,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function VoteWeightTransfer({projectAddress, toAddress, currencyId, weiAmountString}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const address = useAddress();
  const { contract } = useContract(projectAddress, contractData['projectAbi']);
  const { mutateAsync: safeTransferFrom, isLoading, error } = useContractWrite(
    contract,
    "safeTransferFrom",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);
    window.location.reload();    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await safeTransferFrom({ args: [
        address,
        toAddress,
        currencyId,
        weiAmountString,
        []
          ]});
        handleSuccess(data);
    } catch (err) {
      console.error("contract call failure", err);
      setTxnLoading(false);
    }
  }

  return (
    <SoftBox>
    { !txnLoading && address ? (
      <SoftButton onClick={submitTransaction} fullWidth color="info" variant="gradient">
        Transfer
      </SoftButton>
    ) : (
      <SoftButton color="info" variant="gradient" fullWidth disabled>
        Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
      </SoftButton>
    )}
  </SoftBox>
  );
}

VoteWeightTransfer.propTypes = {
    toAddress: PropTypes.string.isRequired,
    currencyId: PropTypes.string.isRequired,
    weiAmountString: PropTypes.string.isRequired,
    projectAddress: PropTypes.string.isRequired,
}

export default VoteWeightTransfer;
