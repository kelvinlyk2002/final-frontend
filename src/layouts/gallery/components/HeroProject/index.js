// library components
import PropTypes from "prop-types";

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton"

function HeroProject({title, description, usdAmount, projectAddress, imageURL}) {
  const url = `/details?projectAddress=${projectAddress}`;
  return (
    <SoftBox>
    {/* hero project */}
      {imageURL && (
        <SoftBox 
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="37.5rem"
          borderRadius="xl"
          mb={1}
          sx={{
            backgroundImage: `url(${imageURL})`,
            backgroundSize: "contain",
            backgroundPosition: "100%",
            overflow: "hidden",
          }}
        />
      )}
      
      <SoftBox mb={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <SoftTypography variant="h3" align="left">
                {title}
              </SoftTypography>
              <SoftTypography variant="body2" align="left">
                {description}
              </SoftTypography>
            </Grid>
            
            <Grid item xs={12} sm={5} display="flex" justifyContent="flex-end" alignItems="flex-start">
              <SoftBox display="flex">
              <SoftTypography variant="h3" align="right" display="flex">
                Raised USD {usdAmount}
                </SoftTypography>
              </SoftBox>
              <SoftBox display="flex" ml={1}>
              <SoftButton color="info" href={url}>
                  Details
                </SoftButton>        
              </SoftBox>
            </Grid>
          </Grid>
      </SoftBox>
    </SoftBox>
  );
}

HeroProject.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    usdAmount: PropTypes.number.isRequired,
    projectAddress: PropTypes.string.isRequired,
    imageURL: PropTypes.string,
  };
  

export default HeroProject;
