// library components
import { useState } from "react";
import PropTypes from "prop-types";

// theme components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// layout components
import ProjectCard from "./components/ProjectCard";

function ProjectListView({pageTitle, projectData}) {
  const sortingOptions = {
    'Trending': 'usd_amount_1week',
    'Newest': 'created_at',
    'Most raised': 'usd_amount'
  }
    
  const [sortDisplay, setSortDisplay] = useState(Object.keys(sortingOptions)[0]);
  const [sortBy, setSortBy] = useState(sortingOptions[sortDisplay]);

  const handleSorting = (event, selectedSorting) => {
    setSortDisplay(selectedSorting);
    setSortBy(sortingOptions[selectedSorting])
  }
  
  projectData.sort((a, b) => b[sortBy] - a[sortBy]);  
  const renderProject = projectData.map(({ title,
      project_id,
      community_oversight,
      category,
      earliest_withdrawal,
      contributor_count,
      usd_amount,
      description,
      project_address,
      imageURL,
     }) => {
      return (
        <Grid item xs={12} md={6} xl={4} key={project_id}>
        <ProjectCard
          image={imageURL}
          label={category}
          title={title}
          description={description}
          action={{
            type: "internal",
            route: "/pages/profile/profile-overview",
            color: "primary",
            label: "view project",
          }}
          raisedCurrency="USD"
          raisedAmount={usd_amount}
          communityOversight={community_oversight}
          earliestWithdrawal={earliest_withdrawal}
          contributorCount={contributor_count}
          projectAddress={project_address}
        />
      </Grid>
      );
    });
  
  return (
      <SoftBox mb={3}>
        <Card>
          <SoftBox pt={2} px={2}>
            <SoftBox mb={0.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={10}>
                <SoftTypography variant="h6" fontWeight="medium">
                    {pageTitle}
                </SoftTypography>
                </Grid>
              <Grid item xs={12} lg={2}>
              <SoftBox justifyContent="flex-end">
              <Autocomplete
                value={sortDisplay}
                onChange={handleSorting}
                options={Object.keys(sortingOptions)}
                renderInput={(params) => <TextField {...params} label="Sort" />}
              />
              </SoftBox>
                </Grid>
              </Grid>
            </SoftBox>
          </SoftBox>
          <SoftBox p={2}>
            <Grid container spacing={3}>
              {renderProject}
            </Grid>
          </SoftBox>
        </Card>
      </SoftBox>
  );
}

ProjectListView.propTypes = {
  pageTitle: PropTypes.string,
  projectData: PropTypes.array
};

export default ProjectListView;
