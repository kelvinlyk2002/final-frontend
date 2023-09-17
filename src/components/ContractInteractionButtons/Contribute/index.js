// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// web3 library
import {  useAddress,
          useContractWrite, 
          useContract,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function Contribute({amount, weiAmountString, projectAddress, currencyAddress}) {
  const [txnLoading, setTxnLoading] = useState(false);

  const address = useAddress();
  const { contract:router_contract } = useContract(contractData['routerAddress'], contractData['routerAbi']);
  const { mutateAsync: contribute, isLoading, error } = useContractWrite(
    router_contract,
    "contribute",
  );

  // build formData object
  const formData = new FormData();
  formData.append('projectAddress', projectAddress);
  formData.append('contributor', address);
  formData.append('currencyAddress', currencyAddress);
  formData.append('amount', amount);

  const handleSuccess = async (onchainCallbackData) => {
    try {
      const transactionHash = onchainCallbackData['receipt']['transactionHash'];

      // append transaction hash from onchain response to the form data
      formData.append('hsh', transactionHash);
      
      // Send POST request to the API endpoint using Axios
      const url = contractData['offchainBackendURI'] + 'api/contribute_project'
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
      const data = await contribute({ args: [
        projectAddress,
        currencyAddress,
        weiAmountString
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
      <SoftButton onClick={submitTransaction} fullWidth color="success" variant="gradient">
        Contribute
      </SoftButton>
    ) : (
      <SoftButton color="success" variant="gradient" fullWidth disabled>
        Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
      </SoftButton>
    )}
  </SoftBox>
  );
}

Contribute.propTypes = {
    projectAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    weiAmountString: PropTypes.string.isRequired,
  }

export default Contribute;