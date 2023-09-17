// library components
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react';
import { utils } from 'ethers';

// theme components
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// layout components
import ProjectWithdrawal from 'layouts/details/components/ProjectWithdrawal';

// data
import { contractData } from 'components/ContractInteractionButtons';

function ProjectCurrencyData({currencyAddress, projectAddress, fundraiser, releaseEpoch, raised_amount, raised_usd_amount}) {
  const walletAddress = useAddress();

  const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20abi']);

  const { data:currencyBalance, isLoading:isCurrencyBalanceLoading, error:currencyBalanceError } = useContractRead(currencyContract, "balanceOf", [projectAddress]);

  // get project token decimals
  const { data:currencyDecimals, isLoading:isCurrencyDecimalsLoading, error:currencyDecimalsError } = useContractRead(currencyContract, "decimals");

  // get project token symbol
  const { data:currencySymbol } = useContractRead(currencyContract, "symbol");

  return (
    <Grid item xs={6}>
      {currencyBalance && currencyDecimals && currencySymbol && (
      <Grid container>
        <Grid item xs={9}>
        <SoftBox  component="li" display="flex" alignItems="center" py={1} mb={1}>
          <SoftBox
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
          >
            <SoftTypography variant="button" fontWeight="medium">
              {currencySymbol} - {currencyAddress.substring(0,6)}***{currencyAddress.substring(38)}
            </SoftTypography>
            <SoftTypography variant="button" fontWeight="medium">
              Raised {raised_amount} = USD {raised_usd_amount}
            </SoftTypography>
            <SoftTypography variant="button" fontWeight="medium">
              Available {utils.formatUnits(currencyBalance, currencyDecimals)}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        </Grid>
      {walletAddress == fundraiser && (
        <Grid item xs={3}>
          <ProjectWithdrawal 
            projectAddress={projectAddress}
            currencyAddress={currencyAddress}
            releaseEpoch={releaseEpoch}
          />
        </Grid>
      )}
    </Grid>
      )}
    </Grid>
  );
}

ProjectCurrencyData.propTypes = {
  currencyAddress: PropTypes.string,
  projectAddress: PropTypes.string,
  fundraiser: PropTypes.string,
  releaseEpoch: PropTypes.string,
  raised_amount: PropTypes.number,
  raised_usd_amount: PropTypes.number,
}

export default ProjectCurrencyData;
