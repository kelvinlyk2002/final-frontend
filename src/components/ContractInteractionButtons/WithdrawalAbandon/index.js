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

function WithdrawalRequest({overseerAddress, currencyAddress}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: abandonWithdrawal, isLoading, error } = useContractWrite(
    overseerContract,
    "abandonWithdrawal",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false); 
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await abandonWithdrawal({ args: [
        currencyAddress,
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
        <SoftButton onClick={submitTransaction} fullWidth color="info" variant="gradient">
          Abandon
        </SoftButton>
      ) : (
        <SoftButton color="info" variant="gradient" fullWidth disabled>
          Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
        </SoftButton>
      )}
    </SoftBox>

  );
}

WithdrawalRequest.propTypes = {
    overseerAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
}

export default WithdrawalRequest;
