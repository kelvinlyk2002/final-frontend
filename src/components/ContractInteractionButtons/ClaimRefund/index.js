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

function ClaimRefund({projectAddress, currencyAddress, userClaimWei}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(projectAddress, contractData['projectAbi']);
  const { mutateAsync: claimRefund, isLoading, error } = useContractWrite(
    contract,
    "claimRefund",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);
    window.location.reload();
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await claimRefund({ args: [
        currencyAddress,
        userClaimWei
          ]});
        handleSuccess(data);
    } catch (err) {
      setTxnLoading(false);
      console.error("contract call failure", err);
    }
  }

  return (
    <SoftBox>
    { !txnLoading ? (
      <SoftButton onClick={submitTransaction} fullWidth color="primary" variant="gradient">
          Claim
      </SoftButton>
      ) : (
        <SoftButton color="primary" variant="gradient" fullWidth disabled>
          Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
        </SoftButton>
      )}
    </SoftBox>
  );
}

ClaimRefund.propTypes = {
    projectAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    userClaimWei: PropTypes.object.isRequired, // BN
}

export default ClaimRefund;
