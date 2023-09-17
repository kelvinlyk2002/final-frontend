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

function CommunityActionExecute({overseerAddress, onchain_proposal_nonce, proposalType}) {
  const [txnLoading, setTxnLoading] = useState(false);
  
  const { contract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: execute, isLoading, error } = useContractWrite(
    contract,
    "execute",
  );

  const handleSuccess = async (onchainCallbackData) => {
    setTxnLoading(false);    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await execute({ args: [
        onchain_proposal_nonce,
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
            Execute
        </SoftButton>        
        ) : (
          <SoftButton color="primary" variant="gradient" fullWidth disabled>
            Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
          </SoftButton>
        )}
      </SoftBox>
  );
}

CommunityActionExecute.propTypes = {
    overseerAddress: PropTypes.string.isRequired,
    onchain_proposal_nonce: PropTypes.number.isRequired,
    proposalType: PropTypes.number.isRequired,
}

export default CommunityActionExecute;
