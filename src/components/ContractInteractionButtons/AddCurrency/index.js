// React and http library
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// web3 library
import {  useContractWrite, 
          useContract,
          useChain,
         } from "@thirdweb-dev/react";

// theme
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";

// data
import { contractData } from 'components/ContractInteractionButtons';

function AddCurrency({projectAddress, currencyAddress}) {
  const chain = useChain(); 
  const [txnLoading, setTxnLoading] = useState(false);

  const { contract } = useContract(contractData['controllerAddress'], contractData['controllerAbi']);
  const { mutateAsync: addProjectCurrency, isLoading, error } = useContractWrite(
    contract,
    "addProjectCurrency",
  );
  
  const formData = new FormData();
  formData.append('projectAddress', projectAddress);
  formData.append('currencyAddress', currencyAddress);
  if( chain ){
    formData.append('chain', chain.name);
    formData.append('chainid', chain.chainId);
  }

  const handleSuccess = async (onchainCallbackData) => {
    const url = contractData['offchainBackendURI'] + 'api/add_currency'
    const response = await axios.post(url, formData);
    
    // Check the response status
    if (response.status === 201) {
      // Successful response handling
      console.log('Form data submitted successfully');
      
      // reload page to refresh currencies
      window.location.reload();

    } else {
      // Error handling
      console.error('Error submitting form data');
    }
    setTxnLoading(false);
  }

  const submitTransaction = async () => {
    setTxnLoading(true);
    try {
      const data = await addProjectCurrency({ args: [
        projectAddress,
        currencyAddress
          ]});
        handleSuccess(data);
    } catch (err) {
      console.error("contract call failure", err);
      setTxnLoading(false);
    }
  }

  return (
    <SoftBox>
      { (chain && !txnLoading) ? (
        <SoftButton onClick={submitTransaction} color="info" variant="gradient">
        Add Currency
        </SoftButton>
      ) : (
        <SoftButton color="info" disabled variant="gradient">
          Do Not Navigate Away <CircularProgress color="inherit" size="1rem"/>
        </SoftButton>
      )}
    </SoftBox>
      
  );
}

AddCurrency.propTypes = {
    projectAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
  }

export default AddCurrency;
