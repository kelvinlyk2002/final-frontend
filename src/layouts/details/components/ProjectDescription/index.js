// theme components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// layout components
import DescriptionCard from "components/DescriptionCard";

function ProjectDescription() {
  return (
    <Card id="delete-account">
      <SoftBox pt={3} px={2}>
        <SoftTypography variant="h6" fontWeight="medium">
          Project Description
        </SoftTypography>
      </SoftBox>
      <SoftBox pt={1} pb={2} px={2}>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <DescriptionCard
            name="Description"
          />
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default ProjectDescription;
