// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// web3 library
import { utils } from "ethers";
import {  useContractWrite, 
          useContract,
          useContractRead,
          useAddress,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function CommunityActionVote({proposalId, color, text, onchain_proposal_nonce, overseerAddress, voteChoice}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const walletAddress = useAddress();
  const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);

  // get proposal currency
  const { data:currencyAddress, isLoading:isCurrencyAddressLoading } = useContractRead(
    overseerContract, "getProposalCurrency", [onchain_proposal_nonce]);

  // get deposited weight
  const { data:depositedWeight, isLoading:isDepositedWeightLoading } = useContractRead(
    overseerContract, "getDepositedWeight", [currencyAddress, walletAddress]);

  // retrieve decimals data of currency
  const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20abi']);

  const { data:currencyDecimals, isLoading:isCurrencyDecimalsLoading } = useContractRead(currencyContract, "decimals");
  
  const { mutateAsync: vote, isLoading, error } = useContractWrite(
    overseerContract,
    "vote",
  );

  const handleSuccess = async (onchainCallbackData) => {
  // build formData object
    const formData = new FormData();
    formData.append('user', walletAddress);
    formData.append('proposal', proposalId);
    formData.append('weight', utils.formatUnits(depositedWeight, currencyDecimals));
    formData.append('vote', voteChoice);
    const transactionHash = onchainCallbackData['receipt']['transactionHash'];
    formData.append('hsh', transactionHash);

    try {      
      // Send POST request to the API endpoint using Axios
      const url = contractData['offchainBackendURI'] + 'api/vote_community_action'
      const response = await axios.post(url, formData);

      // Check the response status
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
      const data = await vote({ args: [
        onchain_proposal_nonce,
        voteChoice,
          ]});
        handleSuccess(data);
    } catch (err) {
      console.error("contract call failure", err);
      setTxnLoading(false);
    }
  }

  return (
    <SoftBox>
      {depositedWeight && currencyAddress && currencyDecimals
      && !depositedWeight.isZero() ? (
        <SoftBox>
        { !txnLoading ? (
        <SoftButton onClick={submitTransaction} fullWidth color={color} variant="gradient">
          {text}
        </SoftButton>
        ) : (
          <SoftButton color={color} variant="gradient" fullWidth disabled>
             <CircularProgress color="inherit" size="1rem"/>
          </SoftButton>
        )}
      </SoftBox>

      ) : (
        <SoftButton fullWidth color={color} variant="gradient" disabled>
          Deposit First
        </SoftButton>
      )}
    </SoftBox>
  );
}

CommunityActionVote.propTypes = {
    proposalId: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onchain_proposal_nonce: PropTypes.number.isRequired,
    overseerAddress: PropTypes.string.isRequired,
    voteChoice: PropTypes.bool.isRequired,
  }

export default CommunityActionVote;