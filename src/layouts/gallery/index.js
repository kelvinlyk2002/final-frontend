// library components
import axios from 'axios';
import {useState, useEffect} from 'react';

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// layout components
import CategoryInfoCard from "./components/CategoryInfoCard";
import TopTrendingProjects from './components/TopTrendingProjects';

// data
import { contractData } from 'components/ContractInteractionButtons';

function Gallery() {
  const categories = {
    'Personal': {
      'description': 'Emergency help for individuals',
      'icon': 'handshake'
    },
    'NGO': {
      'description': 'Programmes from NGOs',
      'icon': 'account_balance'
    },
    'Political':{
      'description': 'Political & environmental clauses',
      'icon': 'language'
    },
    'Others':{
      'description': 'Other campaigns',
      'icon': 'help'
    }
  }

  const [projectsStat, setProjectsStat] = useState({
    'Personal': {
      'usd_sum': 0,
      'count': 0,
      'trendingProjects': [],
      'topProjects': []
    },
    'NGO': {
      'usd_sum': 0,
      'count': 0,
      'trendingProjects': [],
      'topProjects': []
    },
    'Political': {
      'usd_sum': 0,
      'count': 0,
      'trendingProjects': [],
      'topProjects': []
    },
    'Others': {
      'usd_sum': 0,
      'count': 0,
      'trendingProjects': [],
      'topProjects': []
    }
  });

  const updateProjectsStats = (category, usd_sum, count, trendingProjects, topProjects) => {
    setProjectsStat((prevProjectsStat) => {
      const updatedObject = {... prevProjectsStat};
      updatedObject[category] = {
        'usd_sum': usd_sum,
        'count': count,
        'trendingProjects': trendingProjects,
        'topProjects': topProjects
      };
      return updatedObject;
    });
  }

  useEffect(() => {
    for(const category of Object.keys(categories)) {
      fetchData(category);
    }
  }, []);

  const addTopItemToArray = (itemArray, newItem, key, size) => {
    if(itemArray.length < size){
      itemArray.push(newItem);
      return itemArray;
    }
    if(itemArray[size - 1][key] < newItem[key]){
      itemArray[size - 1] = newItem;
    }
    // sort items
    itemArray.sort((a, b) => b[key] - a[key]);  
    return itemArray;
  }

  const fetchData = async (categoryName) => {
    try {
      const url = `${contractData['offchainBackendURI']}api/search_projects?field=category&value=${categoryName}`
      const response = await axios.get(url);
      if(response.status == 200 && response.data['response'] == 1) {
          let trendingProjectsCategory = []
          let topProjectsCategory = []
          let categoryUSDAmount = 0
          
          for(let project of response.data['data']) {
            // compute all time and this week contribution sum
            let contributionUSDAmount = 0; // all time
            let contributionUSDAmountPast168Hours = 0; // this week

            for(const contribution of project['contribution']){
              contributionUSDAmount += parseFloat(contribution['usd_amount']);
              categoryUSDAmount += parseFloat(contribution['usd_amount']);
              if(Date.parse(contribution['created_at']) + 604800000 > Date.now()){
                contributionUSDAmountPast168Hours += parseFloat(contribution['usd_amount']);
              }
            }
            project['contributionUSDAmount'] = contributionUSDAmount;
            project['contributionUSDAmountPast168Hours'] = contributionUSDAmountPast168Hours;
            // collect top 5 projects of each categories
            trendingProjectsCategory = addTopItemToArray(trendingProjectsCategory, project, 'contributionUSDAmountPast168Hours', 5)
            topProjectsCategory = addTopItemToArray(topProjectsCategory, project, 'contributionUSDAmount', 5)
          }
          // add data to the object variable
          updateProjectsStats(categoryName, parseFloat(categoryUSDAmount.toFixed(2)), response.data['data'].length, trendingProjectsCategory, topProjectsCategory);
        }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const renderCategories = Object.keys(categories).map((category) => (
    <Grid item xs={12} sm={6} lg={3} key={category}>
      <CategoryInfoCard
        icon={categories[category]['icon']}
        title={category}
        description={categories[category]['description']}
        projectCount={projectsStat[category]['count']}
        projectSum={projectsStat[category]['usd_sum']}
      />
    </Grid>
  ));


  return (
    <DashboardLayout>
      <DashboardNavbar />
       <SoftBox py={3}>
      {projectsStat && (
        <TopTrendingProjects
          projectsStat = {projectsStat}
        />
      )}
      
      <SoftBox my={1}>
        <SoftTypography variant="h3">Categories</SoftTypography>
      </SoftBox>
 
        <Grid container spacing={3}>
          {renderCategories}
        </Grid>

      </SoftBox>
    </DashboardLayout>
  );
}

export default Gallery;
