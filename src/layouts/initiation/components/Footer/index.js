// theme components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function Footer() {
  return (
    <SoftBox component="footer" py={6}>
      <Grid container justifyContent="center">
        <Grid item xs={10} lg={8}>
          <Card>
            <SoftBox p={3} textAlign="center">
              <SoftTypography variant="h5" fontWeight="medium">
                What is community oversight?
              </SoftTypography>
            </SoftBox>
            <SoftBox px={3} mb={1} textAlign="left">
              <SoftTypography variant="body2" fontWeight="regular" paragraph="true">
                Community oversight is an OPTIONAL feature that allows contributors to have a say on your project. They would be entitled to vote on objecting any withdrawals you requested, blocking or unblocking new contributions to your project, or refunding unwithdrawn balances from the project. Such functionality may boost confidence in your contributors.
                </SoftTypography>
              <SoftTypography variant="body2" fontWeight="regular" paragraph="true">
                 All withdrawals will have a voting period of at least 7 days and other proposals will have a voting period of 3.5 days. Amount objecting the withdrawal would be unavailable to be withdrawn, but any proposed less the objected amount would be withdrawable. Blocking, unblocking or refunding proposals must have quorum of at least 25% and the majority of the vote to pass.
              </SoftTypography>
            </SoftBox>
            <SoftBox p={3} textAlign="center">
              <SoftTypography variant="h5" fontWeight="medium">
                What is voluntary delay?
              </SoftTypography>
            </SoftBox>
            <SoftBox px={3} mb={2} textAlign="left">
              <SoftTypography variant="body2" fontWeight="regular">
                Voluntary delay is an OPTIONAL feature that you voluntarily restrict yourself from withdrawing until the time specified. It may be useful for setting milestones in a series of fundraising campaigns and may boost confidence in contributors. There can only be 1 specified withdrawal time and cannot be changed.
              </SoftTypography>
            </SoftBox>
          </Card>
        </Grid>
      </Grid>
    </SoftBox>
  );
}

export default Footer;
