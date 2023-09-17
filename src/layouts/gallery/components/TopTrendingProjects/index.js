// library components
import PropTypes from "prop-types";

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";

// layout components
import ProjectsCard from '../ProjectsCard';
import HeroProject from "../HeroProject";

function TopTrendingProjects({projectsStat}) {
  const addTopItemToArray = (itemArray, newItem, key, size) => {
    if(itemArray.length < size){
      itemArray.push(newItem);
      itemArray.sort((a, b) => b[key] - a[key]);  
      return itemArray;
    }
    if(itemArray[size - 1][key] < newItem[key]){
      itemArray[size - 1] = newItem;
    }
    // sort items
    itemArray.sort((a, b) => b[key] - a[key]);  
    return itemArray;
  }
    // iterate and collect the trending and top projects across categories
  let trendingProjectsAll = []
  let topProjectsAll = []
  for(const category of Object.keys(projectsStat)){
      for(const project of projectsStat[category]['trendingProjects']){
          trendingProjectsAll = addTopItemToArray(trendingProjectsAll, project, 'contributionUSDAmountPast168Hours', 5)
      }
      for(const project of projectsStat[category]['topProjects']){
          topProjectsAll = addTopItemToArray(topProjectsAll, project, 'contributionUSDAmount', 5)
      }
  }

  return (
    <SoftBox>
    {/* hero project */}
        {trendingProjectsAll.length > 0 && (
          <SoftBox>
            {trendingProjectsAll[0]['media'].length > 0 ? (
              <HeroProject
              title={trendingProjectsAll[0]['title']}
              description={trendingProjectsAll[0]['description']}
              usdAmount={trendingProjectsAll[0]['contributionUSDAmount']}
              projectAddress={trendingProjectsAll[0]['project_address']}
              imageURL={trendingProjectsAll[0]['media'][0]['image']}
          />
            ) : (
              // no image
              <HeroProject
              title={trendingProjectsAll[0]['title']}
              description={trendingProjectsAll[0]['description']}
              usdAmount={trendingProjectsAll[0]['contributionUSDAmount']}
              projectAddress={trendingProjectsAll[0]['project_address']}
          />
            )}
          </SoftBox>
        )}
      <SoftBox my={3}>
        <Grid container spacing={3}>
          {/* trending project */}
          <Grid item xs={12} lg={6}>
            <ProjectsCard title={"Trending projects (last 7 days)"} data={trendingProjectsAll} />
          </Grid>
          {/* top project */}
          <Grid item xs={12} lg={6}>
            <ProjectsCard title={"Top projects"} data={topProjectsAll} />
          </Grid>
        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

TopTrendingProjects.propTypes = {
    projectsStat: PropTypes.object.isRequired,
  };
  

export default TopTrendingProjects;
