// library components
import axios from 'axios';
import {useState, useEffect} from 'react';

// layout components
import ProjectListView from "templates/project-list-view"
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// data
import { contractData } from 'components/ContractInteractionButtons';

function SearchResult() {
  const queryParams = new URLSearchParams(window.location.search);
  const pageTitle = queryParams.get('pageTitle');
  const field = queryParams.get('field');
  const value = queryParams.get('value');

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const url = `${contractData['offchainBackendURI']}api/search_projects?field=${field}&value=${value}`
      const response = await axios.get(url);
      if(response.status == 200 && response.data['response'] == 1) {
        let parsedData = [];
        for(const returnedData of response.data['data']){
          // parse earliest withdrawal
          const earliest_withdrawal = new Date(0);
          earliest_withdrawal.setUTCSeconds(returnedData['release_epoch']);
          
          // parse contribution
          let contributionUSDAmount = 0; // all time
          let contributionUSDAmountPast168Hours = 0; // this week
          let contributors = new Set();

          for(const contribution of returnedData['contribution']){
            contributionUSDAmount += Number.parseFloat(contribution['usd_amount']);
            if(Date.parse(contribution['created_at']) + 604800000 > Date.now()){
              contributionUSDAmountPast168Hours += Number.parseFloat(contribution['usd_amount']);
            }
            contributors.add(contribution['user']['address']);
          }

          let projectObject = {
            "title": returnedData['title'],
            "project_id": returnedData['id'],
            "community_oversight": returnedData['community_oversight'],
            "category": returnedData['category']['name'],
            "earliest_withdrawal": earliest_withdrawal.toString(),
            "contributor_count": contributors.size,
            "usd_amount": contributionUSDAmount,
            "usd_amount_1week": contributionUSDAmountPast168Hours,
            "created_at": Date.parse(returnedData['created_at']),
            "description": returnedData['description'],
            "project_address": returnedData['project_address'],
          }

          // optionally include image, if any
          if(returnedData['media'].length > 0){
            projectObject["imageURL"] = returnedData['media'][0]['image'];
          }

          parsedData.push(projectObject);
        }
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ProjectListView
            pageTitle={pageTitle}
            projectData={data}
          >
          </ProjectListView>
    </DashboardLayout>
  );
}

export default SearchResult;
