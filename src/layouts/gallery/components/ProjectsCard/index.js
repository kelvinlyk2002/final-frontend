// library components
import PropTypes from "prop-types";

// the,e components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Table from "components/Table";

function ProjectsCard({title, data}) {
  const col = [
    { name: "project", align: "center" },
    { name: "category", align: "center" },
    { name: "raised", align: "center" },
    { name: "link", align: "center" },
  ]

  // parse into required formats
  let rows = [];
  for(const project of data) {
    const url = `/details?projectAddress=${project['project_address']}`;
    rows.push(
      {
        project: (
          <SoftTypography variant="body2" color="text" fontWeight="medium">
            {project['title']}
          </SoftTypography>
        ),
        category:(
          <SoftTypography variant="body2" color="text" fontWeight="medium">
            {project['category']['name']}
          </SoftTypography>
        ),
        raised: (
          <SoftTypography variant="body2" color="text" fontWeight="medium">
            USD {project['contributionUSDAmount']}
          </SoftTypography>
        ),
        link: (
          <SoftButton color="info" href={url}>
            Details
          </SoftButton>
        ),
      }
    )
  }
  
  return (
    <Card>
    <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
      <SoftTypography variant="h6">{title}</SoftTypography>
    </SoftBox>
      <Table columns={col} rows={rows} />
    </Card>
  );
}

ProjectsCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
};

export default ProjectsCard;
