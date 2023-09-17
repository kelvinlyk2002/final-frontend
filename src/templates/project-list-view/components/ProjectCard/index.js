// library components
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function ProjectCard({ image, label, title, description, raisedCurrency, raisedAmount, earliestWithdrawal, communityOversight, contributorCount, projectAddress }) {
  const projectURL = `/details?projectAddress=${projectAddress}`
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <SoftBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
        { image && (
          <CardMedia
            src={image}
            component="img"
            title={title}
            sx={{
              maxWidth: "100%",
              margin: 0,
              boxShadow: ({ boxShadows: { md } }) => md,
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
      </SoftBox>
      <SoftBox pt={3} px={0.5}>
        <SoftBox mb={1}>
          <SoftTypography
            variant="button"
            fontWeight="regular"
            textTransform="capitalize"
            textGradient
          >
            {label}
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={1}>
            <SoftTypography
              component={Link}
              to={projectURL}
              variant="h5"
              textTransform="capitalize"
            >
              {title}
            </SoftTypography>
        </SoftBox>
        <SoftBox lineHeight={0}>
          
          {communityOversight ? (
        
        <SoftTypography variant="button" fontWeight="regular" color="text">
          Community Oversight Activated
          </SoftTypography>
        
      ) : (<SoftTypography variant="button" fontWeight="regular" color="text">
      Community Oversight Not Activated
      </SoftTypography>)
      } 
          
        </SoftBox>
        <SoftBox lineHeight={0}>
          <SoftTypography variant="button" fontWeight="regular" color="text">
            Earliest withdrawal: {earliestWithdrawal}
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={3} lineHeight={0}>
          <SoftTypography variant="button" fontWeight="regular" color="text">
            {contributorCount} contributors
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={3} lineHeight={0}  display="flex">
          <SoftTypography variant="button" fontWeight="regular" color="text" sx={{ textOverflow: 'ellipsis' }} noWrap>
            {description}
          </SoftTypography>
        </SoftBox>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center">
            <SoftButton
              component={Link}
              to={projectURL}
              variant="outlined"
              size="small"
              color="primary"
            >
              view project
            </SoftButton>
          <SoftBox justifyContent="flex-end" display="flex">
            <SoftTypography variant="body2" fontWeight="regular">
              Raised {raisedCurrency} {raisedAmount}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

ProjectCard.defaultProps = {
  authors: [],
};

ProjectCard.propTypes = {
  image: PropTypes.string,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  raisedCurrency: PropTypes.string.isRequired,
  raisedAmount: PropTypes.number.isRequired,
  contributorCount: PropTypes.number.isRequired,
  communityOversight: PropTypes.bool.isRequired,
  earliestWithdrawal: PropTypes.string.isRequired,
  projectAddress: PropTypes.string.isRequired,
};

export default ProjectCard;
