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

function WithdrawalExecute({projectAddress, currencyAddress, amountString, currencyDecimals, isShutdown}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract:controllerContract } = useContract(contractData['controllerAddress'], contractData['controllerAbi']);
  const { mutateAsync: withdrawProjectBalance, isLoading, error } = useContractWrite(
    controllerContract,
    "withdrawProjectBalance",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);  
  }

  const submitTransaction = async () => {
    setTxnLoading(true);

    try {
      const data = await withdrawProjectBalance({ args: [
        projectAddress,
        currencyAddress,
        utils.parseUnits(amountString, currencyDecimals).toString(),
        isShutdown
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
          Withdraw
      </SoftButton>  
    ) : (
      <SoftButton color="primary" variant="gradient" fullWidth disabled>
        Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
      </SoftButton>
    )}
  </SoftBox>


  );
}

WithdrawalExecute.propTypes = {
  projectAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    amountString: PropTypes.string.isRequired,
    currencyDecimals: PropTypes.number.isRequired,
    isShutdown: PropTypes.bool.isRequired
}

export default WithdrawalExecute;
