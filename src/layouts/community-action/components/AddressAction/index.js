// library components
import { useContractRead, useContract } from "@thirdweb-dev/react";
import PropTypes from "prop-types";

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// data
import { contractData } from "components/ContractInteractionButtons";

function AddressAction({ voter, voter_weight, vote_time, vote, overseerAddress, onchain_proposal_nonce }) {
  const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { data:currencyAddress, isLoading:isProposalCurrencyLoading } = useContractRead(
    overseerContract,
    "getProposalCurrency",
    [onchain_proposal_nonce]
  );

  const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20Abi']);
  const { data:currencySymbol, isLoading:isCurrencySymbolLoading } = useContractRead(
      currencyContract,
      "symbol",
  );

  return (
    <SoftBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      lineHeight={1}
    >
      <Grid container>
        <Grid item xs={12}>
        <SoftTypography variant="caption" display="block" fontWeight="medium">
          {voter}
        </SoftTypography>
        {currencySymbol && (
          <SoftTypography variant="caption" fontWeight="regular" color="text">
            {currencySymbol} ({currencyAddress.substring(0,6)}***{currencyAddress.substring(38)}) {voter_weight}
          </SoftTypography>
        )}
        <SoftTypography variant="caption" display="block" fontWeight="regular" color="text">
          {vote_time}
        </SoftTypography>
          {vote ? (
            <SoftBox>
            <SoftTypography variant="body2" fontWeight="medium" color="success">YAY</SoftTypography>
          </SoftBox>    
          ) : (
            <SoftBox>
            <SoftTypography variant="body2" fontWeight="medium" color="error">NAY</SoftTypography>
          </SoftBox>    
          )}
        </Grid>
      </Grid>
    </SoftBox>
  );
}

// Typechecking props for the Invoice
AddressAction.propTypes = {
  voter: PropTypes.string.isRequired,
  voter_weight: PropTypes.string.isRequired,
  vote_time: PropTypes.string.isRequired,
  vote: PropTypes.bool,
  overseerAddress: PropTypes.string,
  onchain_proposal_nonce: PropTypes.number,
};

export default AddressAction;
