// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

// web3 library
import { utils } from "ethers";
import {  useContractWrite, 
          useContract,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function WithdrawalApproval({overseerAddress, currencyAddress, amountString, currencyDecimals}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: approveWithdrawal, isLoading, error } = useContractWrite(
    overseerContract,
    "approveWithdrawal",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await approveWithdrawal({ args: [
        currencyAddress,
        utils.parseUnits(amountString, currencyDecimals).toString()
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
            approve
        </SoftButton>
      ) : (
        <SoftButton color="warning" variant="gradient" fullWidth disabled>
          Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
        </SoftButton>
      )}
    </SoftBox>

  );
}

WithdrawalApproval.propTypes = {
    overseerAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    amountString: PropTypes.string.isRequired,
    currencyDecimals: PropTypes.number.isRequired,
}

export default WithdrawalApproval;
