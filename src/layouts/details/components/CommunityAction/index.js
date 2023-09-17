// library components
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function CommunityAction({projectAddress, count}) {
  const url = `/communityAction?projectAddress=${projectAddress}`
  return (
    <SoftBox mb={1.5}>
    <Card id="community-action">
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="medium">
          Community Actions
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        <SoftButton variant="gradient" color="dark" component="a"
            href={url}
            fullWidth
        >
          {
            count > 1 ? (
              <SoftTypography variant="h6" fontWeight="medium" color="white">
                Community Proposals: {count}      
              </SoftTypography>
            ) : (
              <SoftTypography variant="h6" fontWeight="medium" color="white">
                Community Proposal: {count}
              </SoftTypography>
            )
          } 
        </SoftButton>
      </SoftBox>
    </Card>
    </SoftBox>
  );
}

CommunityAction.defaultProps = {
  count: 0
};

CommunityAction.propTypes = {
  projectAddress: PropTypes.string.isRequired,
  count: PropTypes.number,
}

export default CommunityAction;
