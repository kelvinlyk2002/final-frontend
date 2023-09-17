// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
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

function WithdrawalRequest({overseerAddress, projectAddress, currencyAddress, amountString, currencyDecimals, currencySymbol}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { mutateAsync: requestWithdrawalApproval, isLoading, error } = useContractWrite(
    overseerContract,
    "requestWithdrawalApproval",
  );

  const handleSuccess = async (onchainCallbackData) => {
    // Proposal nonce
    const onchainNonce = onchainCallbackData['receipt']['events'][0]['args']['proposalNonce'].toString();
    const formData = new FormData();
    formData.append('title', `Withdrawal Request for ${amountString} ${currencySymbol}`);
    const description = `
    This is an automated community proposal as the fundraiser has requested withdrawal of ${amountString} ${currencySymbol} (${currencyAddress}). Vote 'yay' if you object this withdrawal. The fundraiser would be able to withdraw the proposed amount less the objected amount after the voting period of this proposal passes. This proposal does not require execution. If you wish to block all withdrawals, raise a block proposal. A block proposal is executable if the 'yay' has quorum and majority. The voting period for a block proposal is at least 3.5 days. An executed block proposal is effective across all currencies.
    `
    formData.append('description', description);
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
    // reload to update displayed community action counter
    window.location.reload();    
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await requestWithdrawalApproval({ args: [
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
      <SoftButton onClick={submitTransaction} fullWidth color="info" variant="gradient">
          Request
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
    projectAddress:  PropTypes.string.isRequired,
    amountString: PropTypes.string.isRequired,
    currencyDecimals: PropTypes.number.isRequired,
    currencySymbol: PropTypes.string.isRequired,
}

export default WithdrawalRequest;
