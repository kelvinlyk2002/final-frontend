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

function VoteWeightApprove({projectAddress, overseerAddress}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(projectAddress, contractData['projectAbi']);
  const { mutateAsync: setApprovalForAll, isLoading, error } = useContractWrite(
    contract,
    "setApprovalForAll",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await setApprovalForAll({ args: [
        overseerAddress,
        true
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
          Approve
      </SoftButton>    
    ) : (
      <SoftButton color="primary" variant="gradient" fullWidth disabled>
        Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
      </SoftButton>
    )}
  </SoftBox>
  );
}

VoteWeightApprove.propTypes = {
    overseerAddress: PropTypes.string.isRequired,
    projectAddress: PropTypes.string.isRequired,
}

export default VoteWeightApprove;
