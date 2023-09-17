// library components
import PropTypes from "prop-types";
import {  useAddress } from "@thirdweb-dev/react";

// theme components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// layout components
import CurrencyClaimRefund from '../CurrencyClaimRefund';

function ProjectClaimRefund({projectAddress, currencyAddressArray}) {
  const walletAddress = useAddress();
  const renderRefund = currencyAddressArray.map(({ address }) => (
    <CurrencyClaimRefund
      key={address}
      projectAddress={projectAddress}
      currencyAddress={address}
      walletAddress={walletAddress}
  />
  ));

  return (
    <SoftBox mb={1.5}>
      <Card id="community-action">
          <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
            <SoftTypography variant="h6" fontWeight="medium">
              Claimable Refunds
            </SoftTypography>
          </SoftBox>
            { walletAddress && (
              <SoftBox p={2}>
                {renderRefund}
              </SoftBox>
            )}
      </Card>
    </SoftBox>
  );
}

ProjectClaimRefund.propTypes = {
    projectAddress: PropTypes.string.isRequired,
    currencyAddressArray: PropTypes.array.isRequired,
  }

export default ProjectClaimRefund;