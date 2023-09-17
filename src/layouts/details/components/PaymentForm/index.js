// library components
import {useState } from 'react'
import PropTypes from "prop-types";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { utils, BigNumber } from 'ethers';

// theme components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from 'components/SoftButton';
import borders from "assets/theme/base/borders";

// layout components
import ContributeApproval from 'components/ContractInteractionButtons/ContributeApproval';
import Contribute from 'components/ContractInteractionButtons/Contribute';

// data
import { contractData } from 'components/ContractInteractionButtons';

function PaymentForm({projectAddress, data}) {
  const { borderWidth, borderColor } = borders;
  const [currency, setCurrency] = useState(data[0]['address']);
  const [amount, setAmount] = useState('');
  const [amountWei, setAmountWei] = useState(BigNumber.from(0));

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleAmountInput = (event) => {
    setAmount(event.target.value);
    const amountBN = utils.parseUnits(event.target.value, currencyDecimals)
    setAmountWei(amountBN);
  }

  const handleMaxAmount = () => {   
    if(!isCurrencyBalanceLoading && !isCurrencyDecimalsLoading){
      let maxAmountString = utils.formatUnits(currencyBalance, currencyDecimals);
      setAmountWei(currencyBalance); // in wei, BN
      setAmount(maxAmountString);
    }
  }

  const renderOptions = data.map(({ name, address}) => (
      <option value={address} key={address}>
        {name} - {address.substring(0,6)}***{address.substring(38)}
      </option>
  ));

  const address = useAddress();
  // read currency address for address token holding balance
  const { contract } = useContract(currency, contractData['erc20abi']);
  const { data:currencyBalance, isLoading:isCurrencyBalanceLoading, error:currencyBalanceError } = useContractRead(contract, "balanceOf", [address]);
  const { data:currencyDecimals, isLoading:isCurrencyDecimalsLoading, error:currencyDecimalsError } = useContractRead(contract, "decimals");
  const { data:currencyApproved, isLoading:isCurrencyApprovedLoading, error:currencyApprovedError } = useContractRead(contract, "allowance", [address, contractData['routerAddress']]);
  
  return (
    <Card id="delete-account">
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="medium">
          Contribute
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SoftBox
              border={`${borderWidth[1]} solid ${borderColor}`}
              borderRadius="lg"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
            >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <NativeSelect
                name="currency"
                value={currency}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {renderOptions}
              </NativeSelect>     
            </FormControl>
            <SoftBox>
              <SoftInput value={amount} onInput={handleAmountInput} />
            </SoftBox>
            <SoftBox p={1}>
              <SoftButton color="primary" onClick={handleMaxAmount}>MAX</SoftButton>
            </SoftBox>
          </SoftBox>
          </Grid>
          <Grid item xs={12} sm={6}>
            {address && amount > 0 && (
              <ContributeApproval 
                weiAmountString={amountWei.toString()}
                currencyAddress={currency}
                decimals={currencyDecimals}
              />
            )}            
          </Grid>
          <Grid item xs={12} sm={6}>
            {address && amount > 0 && amountWei.lte(currencyApproved) && (
              <Contribute 
                amount={amount}
                weiAmountString={amountWei.toString()}
                projectAddress={projectAddress}
                currencyAddress={currency}
                decimals={currencyDecimals}
              />
            )}
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

PaymentForm.defaultProps = {
  data: []
};

PaymentForm.propTypes = {
  projectAddress: PropTypes.string,
  data: PropTypes.array,
}

export default PaymentForm;
