// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
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

function CommunityActionPropose({projectAddress, overseerAddress, typeEnum, currencyAddress, quorumPercentage, deadlineEpoch, proposalTitle, proposalDescription}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: propose, isLoading, error } = useContractWrite(
    contract,
    "propose",
  );

  const handleSuccess = async (onchainCallbackData) => {
    // Proposal nonce
    const onchainNonce = onchainCallbackData['receipt']['events'][0]['args']['proposalNonce'].toString();
    const formData = new FormData();
    formData.append('title', proposalTitle);
    formData.append('description', proposalDescription);
    formData.append('onchain_proposal_nonce', onchainNonce);
    formData.append('projectAddress', projectAddress);

    try {
      const url = contractData['offchainBackendURI'] + 'api/propose_community_action'
      const response = await axios.post(url, formData);
  
      if (response.status === 201) {
        // Successful response handling
        console.log('Form data submitted successfully');
        // Perform any necessary actions after successful submission
      } else {
        // Error handling
        console.error('Error submitting form data');
      }
    } catch (error) {
      // Network or other error handling
      console.error('An error occurred:', error);
    }
    setTxnLoading(false);
    window.location.reload();
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await propose({ args: [
        typeEnum,
        currencyAddress,
        quorumPercentage,
        deadlineEpoch
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
    <SoftButton onClick={submitTransaction} fullWidth color="dark" variant="gradient">
        Propose
    </SoftButton>
    ) : (
    <SoftButton color="dark" variant="gradient" fullWidth disabled>
      Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
    </SoftButton>
    )}
  </SoftBox>

  );
}

CommunityActionPropose.propTypes = {
    projectAddress: PropTypes.string.isRequired,
    overseerAddress: PropTypes.string.isRequired,
    typeEnum: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    quorumPercentage:PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    deadlineEpoch: PropTypes.number.isRequired,
    proposalTitle: PropTypes.string.isRequired,
    proposalDescription: PropTypes.string.isRequired,
}

export default CommunityActionPropose;
