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
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function Description({ name, editable }) {
  return (
    <SoftBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor="grey-100"
      borderRadius="lg"
      p={3}
      mb={1}
      mt={2}
    >
      <SoftBox width="100%" display="flex" flexDirection="column">
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <SoftTypography variant="button" fontWeight="medium">
            {name}
          </SoftTypography>

          <SoftBox
            display="flex"
            alignItems="center"
            mt={{ xs: 2, sm: 0 }}
            ml={{ xs: -1.5, sm: 0 }}
          >
            {editable && (
            <SoftButton variant="text" color="dark">
              <Icon>edit</Icon>&nbsp;edit
            </SoftButton>
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}

// Setting default values for the props of Bill
Description.defaultProps = {
  noGutter: false,
};

// Typechecking props for the Bill
Description.propTypes = {
  name: PropTypes.string.isRequired,
  // company: PropTypes.string.isRequired,
  // email: PropTypes.string.isRequired,
  // vat: PropTypes.string.isRequired,
  editable: PropTypes.bool,
};

export default Description;
