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

function ContributeApprove({weiAmountString, currencyAddress}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(currencyAddress, contractData['erc20abi']);
  const { mutateAsync: approve, isLoading, error } = useContractWrite(
    contract,
    "approve",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);
    window.location.reload();
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await approve({ args: [
        contractData['routerAddress'],
        weiAmountString
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

ContributeApprove.propTypes = {
    currencyAddress: PropTypes.string.isRequired,
    weiAmountString:PropTypes.string.isRequired,
}

export default ContributeApprove;
