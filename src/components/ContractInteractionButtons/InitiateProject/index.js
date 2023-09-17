// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// web3 library
import {  useContractRead,
          useContractWrite, 
          useContract,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function InitiateProject({formData}) {
  const [txnLoading, setTxnLoading] = useState(false);
  // unstringify community oversight
  let communityOversight = false;
  if(formData.get("communityOversight") === 'true') {
    communityOversight = true;
  }

  // define success callback
  const handleSuccess = async (onchainCallbackData) => {
    try {
      // append data from onchain response to the form data
      const walletAddress = onchainCallbackData['receipt']['from'];
      const projectAddress = onchainCallbackData['receipt']['events'][0]['address'];
      const transactionHash = onchainCallbackData['receipt']['transactionHash'];
      
      formData.append('currencyName', currencySymbol);
      formData.append('walletAddress', walletAddress);
      formData.append('projectAddress', projectAddress);
      formData.append('transactionHash', transactionHash);

      // Send POST request to the API endpoint using Axios
      const url = contractData['offchainBackendURI'] + 'api/initiate_project'
      const response = await axios.post(url, formData);

      // Check the response status
      if (response.status === 200) {
        // Successful response handling
        console.log('Form data submitted successfully');
        // redirect to the page's page
        window.location.href = `/details?projectAddress=${projectAddress}`;
      } else {
        // Error handling
        console.error('Error submitting form data');
      }
      
    } catch (error) {
      // Network or other error handling
      console.error('An error occurred:', error);
    }
    // Turnoff loading state
    setTxnLoading(false);    
  }

  const { contract } = useContract(contractData['factoryAddress'], contractData['factoryAbi']); // factory
  const { mutateAsync: initiateProject, isLoading } = useContractWrite(contract, "initiateProject");

  const { contract:currencyContract } = useContract(formData.get("currency"), contractData['erc20abi']);
  const { data:currencySymbol } = useContractRead(currencyContract, "symbol");

  const submitTransaction = async () => {
    // change the button into a loading logo
    setTxnLoading(true);
    try {
      const data = await initiateProject({ args: [
        formData.get("currency"),
        contractData['controllerAddress'],
        contractData['routerAddress'],
        communityOversight,
        formData.get("releaseEpoch")
          ]});
        handleSuccess(data);
    } catch (err) {
      setTxnLoading(false);
      console.error("contract call failure", err);
    }
  }

  return (
    <SoftBox>
      {/* Only after symbol could be read. */}
      { (currencySymbol && !txnLoading) ? (
        <SoftButton onClick={submitTransaction} fullWidth color="success" variant="gradient">
          Initiate Project
        </SoftButton>
      ) : (
        <SoftButton color="success" variant="gradient" fullWidth disabled>
          Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
        </SoftButton>
      )}
    </SoftBox>
        
  );
}

InitiateProject.propTypes = {
  formData: PropTypes.object.isRequired,
  }

export default InitiateProject;
