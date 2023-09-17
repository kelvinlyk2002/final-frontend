/**
=========================================================
* Soft UI Dashboard React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton"

function StatisticsCard({ bgColor, title, count, percentage, icon, buttonText, buttonURL }) {
  return (
    <Card>
      <SoftBox bgColor={bgColor} variant="gradient">
        <SoftBox p={2}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
                <SoftBox
                  variant="gradient"
                  bgColor="primary"
                  color="white"
                  height="3rem"
                  borderRadius="md"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  shadow="md"
                  px={1}
                >
                  <Icon fontSize="small" color="inherit">
                    {icon.component}
                  </Icon>                  
                </SoftBox>
              </Grid>
            <Grid item xs={8}>
              <SoftBox ml={1} lineHeight={1}>
                <SoftTypography
                  variant="button"
                  color="text"
                  opacity={1}
                  textTransform="capitalize"
                  fontWeight={title.fontWeight}
                >
                  {title.text}
                </SoftTypography>
                <SoftTypography
                  variant="h5"
                  fontWeight="bold"
                  color="text"
                >
                  {count}{" "}
                  <SoftTypography variant="button" color={percentage.color} fontWeight="bold">
                    {percentage.text}
                  </SoftTypography>
                </SoftTypography>
              </SoftBox>
            </Grid>
            {buttonText && (
              <Grid item xs={3}>
                {buttonURL ? (
                  <SoftBox mr={1} justifyContent="flex-end">
                  <SoftButton 
                    color="primary"
                    variant="gradient"
                    href={buttonURL}
                    fullWidth
                  >
                    {buttonText}
                  </SoftButton>
                </SoftBox>
                ) : (
                <SoftBox mr={1}>
                  <SoftButton 
                      color="primary"
                      variant="gradient"
                    >
                      {buttonText}
                    </SoftButton>
                  </SoftBox>
                )}
                
                  
              </Grid>
            )}
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Setting default values for the props of MiniStatisticsCard
StatisticsCard.defaultProps = {
  bgColor: "white",
  title: {
    fontWeight: "medium",
    text: "",
  },
  percentage: {
    color: "success",
    text: "",
  },
  direction: "right",
};

// Typechecking props for the MiniStatisticsCard
StatisticsCard.propTypes = {
  bgColor: PropTypes.oneOf([
    "white",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  title: PropTypes.PropTypes.shape({
    fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    component: PropTypes.node.isRequired,
  }).isRequired,
  buttonText: PropTypes.string,
  buttonURL: PropTypes.string,
};

export default StatisticsCard;
