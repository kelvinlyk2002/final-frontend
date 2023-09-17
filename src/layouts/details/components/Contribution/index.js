// library components
import PropTypes from "prop-types";
import { useChain } from "@thirdweb-dev/react";

// theme components
import { Grid } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// data
import { contractData } from "components/ContractInteractionButtons";

function Contribution({ address, currency, currencyAddress, amount, timestamp, usd_amount, hsh, noGutter }) {
  const rightTrimZero = (amountString) => {
      if (amountString.slice(amountString.length - 1) != "0" && amountString.slice(amountString.length - 1) != ".") {
        return amountString.substring(0, amountString.length);
      } else {
        return rightTrimZero(amountString.substring(0, amountString.length - 1))
      }
  }

  const displayedCurrency = `${currency} (${currencyAddress.substring(0,6)}***${currencyAddress.substring(38)})`;

  const chain = useChain();

  let displayDate = new Date(0);
  displayDate.setUTCMilliseconds(Date.parse(timestamp));

  return (
    <SoftBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      pr={1}
      mb={noGutter ? 0 : 1}
    >
      <Grid container>
        <Grid item xs={9}>
          <SoftBox lineHeight={1}>
            <SoftTypography variant="caption" display="block" fontWeight="medium">
              {address}
            </SoftTypography>
            <SoftTypography variant="caption" display="block" fontWeight="regular" color="text">
              {rightTrimZero(amount)} {displayedCurrency} 
            </SoftTypography>
            <SoftTypography variant="caption" display="block" fontWeight="regular" color="text">
              = USD {usd_amount} 
            </SoftTypography>
            <SoftTypography variant="caption" display="block" fontWeight="regular" color="text">
              {displayDate.toDateString()}
            </SoftTypography>
          </SoftBox>
        </Grid>
        <Grid item xs={3}>
            <SoftBox display="flex" alignItems="center" lineHeight={0} ml={2} sx={{ cursor: "poiner" }}>
              {chain && (
                <SoftButton color="primary" href={contractData['etherscanBaseURI'][chain.name] + hsh} fullWidth>
                  View Txn
                </SoftButton>
              )}
            </SoftBox>
        </Grid>
      </Grid>
    </SoftBox>
  );
}

// Setting default values for the props of Invoice
Contribution.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Invoice
Contribution.propTypes = {
  address: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,]
    ).isRequired,
  timestamp: PropTypes.string.isRequired,
  currencyAddress: PropTypes.string.isRequired,
  usd_amount: PropTypes.string.isRequired,
  hsh: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default Contribution;
