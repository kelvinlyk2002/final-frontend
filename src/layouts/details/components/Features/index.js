// library components
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Features({category, communityOversight, releaseEpoch}) {
    let earliestWithdrawal = new Date(0);
    earliestWithdrawal.setUTCSeconds(releaseEpoch);
    
  const renderCategoryIcon = (_category) => {
    if(_category == "Personal") {
        return (<Icon fontSize="medium">volunteer_activism</Icon>);
    } else if (_category == "NGO") {
        return (<Icon fontSize="medium">account_balance</Icon>);
    } else if (_category == "Political") {
        return (<Icon fontSize="medium">campaigns</Icon>);
    } else if (_category == "Others") {
        return (<Icon fontSize="medium">handshake</Icon>);
    } else {
        return ;
    }
  } 

  return (
    <SoftBox mb={1.5}>
    <Card sx={{ height: "100%" }}>
      <SoftBox pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Features
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <SoftBox component="li" display="flex" alignItems="center" py={1} mb={1}>
                        <SoftBox mr={2}>
                            {renderCategoryIcon(category)}
                        </SoftBox>
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="center"
                        >
                        <SoftTypography variant="button" fontWeight="medium">
                            Category
                        </SoftTypography>
                        <SoftTypography variant="caption" color="text">
                            {category}
                        </SoftTypography>
                        </SoftBox>
                    </SoftBox>
                </Grid>

                <Grid item xs={4}>
                    <SoftBox  component="li" display="flex" alignItems="center" py={1} mb={1}>
                        <SoftBox mr={2}>
                            {communityOversight ? (
                                <Icon fontSize="medium">visibility_on</Icon>
                            ) : (
                                <Icon fontSize="medium">visibility_off</Icon>
                            )}
                        </SoftBox>
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="center"
                        >
                        <SoftTypography variant="button" fontWeight="medium">
                            Community Oversight
                        </SoftTypography>
                            {communityOversight ? (
                                <SoftTypography variant="caption" color="text">
                                Enabled
                                </SoftTypography>
                            ) : (
                                <SoftTypography variant="caption" color="text">
                                Disabled
                                </SoftTypography>
                            )}
                        </SoftBox>
                    </SoftBox>
                </Grid>

                <Grid item xs={4}>
                    <SoftBox  component="li" display="flex" alignItems="center" py={1} mb={1}>
                        <SoftBox mr={2}>
                            <Icon fontSize="medium">calendar_month</Icon>
                        </SoftBox>
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="center"
                        >
                        <SoftTypography variant="button" fontWeight="medium">
                            Withdrawal Available From
                        </SoftTypography>
                        <SoftTypography variant="caption" color="text">
                            {earliestWithdrawal.toString()}
                        </SoftTypography>
                        </SoftBox>
                    </SoftBox>
                </Grid>
            </Grid>  
        </SoftBox>
    </SoftBox>
    </Card>
    </SoftBox>        
    );
}

Features.propTypes = {
  category: PropTypes.string,
  communityOversight: PropTypes.bool,
  releaseEpoch: PropTypes.number,
};

export default Features;
