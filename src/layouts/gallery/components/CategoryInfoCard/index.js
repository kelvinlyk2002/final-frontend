// library components
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function CategroyInfoCard({ icon, title, description, projectCount, projectSum }) {
  const link = `/searchResult?pageTitle=${title} Projects&field=category&value=${title}`
  return (
    <Card>
      <SoftBox p={2} mx={3} display="flex" justifyContent="center">
        <SoftBox
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor="info"
          color="white"
          width="4rem"
          height="4rem"
          shadow="md"
          borderRadius="lg"
          variant="gradient"
        >
          <Icon fontSize="default">{icon}</Icon>
        </SoftBox>
      </SoftBox>
      <SoftBox pb={2} px={2} textAlign="center" lineHeight={1.25}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
        <SoftTypography variant="button" color="text" fontWeight="regular">
            {description}
          </SoftTypography>
        <SoftBox my={1}>
          <SoftButton component="a" href={link} color='info' fullWidth>Browse</SoftButton>
        </SoftBox>
        <SoftBox>
          {projectCount > 1 ? (
            <SoftTypography variant="body2" color="text" fontWeight="medium">
              {projectCount} Projects Raising ${projectSum}
            </SoftTypography>
          ) : (
            <SoftTypography variant="body2" color="text" fontWeight="medium">
              {projectCount} Project Raising ${projectSum}
            </SoftTypography>
          )}
        </SoftBox>

      </SoftBox>
    </Card>
  );
}

CategroyInfoCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  projectCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  projectSum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CategroyInfoCard;
