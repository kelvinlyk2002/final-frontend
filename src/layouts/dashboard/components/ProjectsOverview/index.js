// library components
import PropTypes from "prop-types";
import { useAddress } from "@thirdweb-dev/react";

// theme components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "components/Table";

// layout components
import StatisticsCard from "../StatisticsCard";

function ProjectsOverview({contributionCardData, fundraisingCardData, contributionData }) {
  const walletAddress = useAddress();
  const projectsRaisedURL = `/searchResult?pageTitle=Projects Raised&field=fundraiser&value=${walletAddress}`
  const projectsContributedURL = `/searchResult?pageTitle=Projects Contributed&field=contributor&value=${walletAddress}`

  const columns = [
    { name: "project", align: "center" },
    { name: "category", align: "center" },
    { name: "contribution", align: "center" },
    { name: "raised", align: "center" },
    { name: "updated", align: "center" },
    { name: "voting", align: "center" },
    { name: "link", align: "center" },
  ]

  return (
<SoftBox py={3}>
    <SoftBox mb={3}>
    {walletAddress && (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>  
          <StatisticsCard
            title={{ text: "Contributed" }}
            count={contributionCardData}
            icon={{ color: "primary", component: "paid" }}
            buttonText="View all"
            buttonURL={projectsContributedURL}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatisticsCard
            title={{ text: "Raised" }}
            count={fundraisingCardData}
            icon={{ color: "primary", component: "public" }}
            buttonText="View all"
            buttonURL={projectsRaisedURL}
          />
        </Grid>
      </Grid>
      )}
    </SoftBox>
    <Grid container spacing={3}>
      <Grid item xs={12}>
    <Card>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <SoftBox>
            <SoftTypography variant="h6" gutterBottom>
            Updates from projects contributed
            </SoftTypography>
        </SoftBox>
        </SoftBox>
        <SoftBox
        sx={{
            "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
                borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            },
            },
        }}
        >
        {contributionData.length > 0 ? (
            <Table columns={columns} rows={contributionData} />
            ) : 
            <SoftTypography variant="h4" align="center">
            No contribution yet. Check out the project gallery to donate!
            </SoftTypography>
        }
        </SoftBox>
            </Card>
        </Grid>
    </Grid>
</SoftBox>

  );
}

ProjectsOverview.propTypes = {
    contributionCardData: PropTypes.string,
    fundraisingCardData: PropTypes.string,
    contributionData: PropTypes.array,
  };
  

export default ProjectsOverview;
