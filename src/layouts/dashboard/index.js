// library components
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAddress } from "@thirdweb-dev/react";

// theme components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton"
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// layout components
import ProjectsOverview from "./components/ProjectsOverview";

// data
import { contractData } from 'components/ContractInteractionButtons';

function Dashboard() {
  const walletAddress = useAddress();

  const [contributionData, setContributionData] = useState([]);
  const [contributionCardData, setContributionCardData] = useState('');
  const [fundraisingCardData, setFundraisingCardData] = useState('');

  useEffect(() => {
    fetchData();
  }, [walletAddress]);

  const fetchData = async () => {
    try {
      const contributionURL = `${contractData['offchainBackendURI']}api/search_projects?field=contributor&value=${walletAddress}`
      const contributionResponse = await axios.get(contributionURL);
      if(contributionResponse.status == 200 && contributionResponse.data['response'] == 1) {
        let rows = [];
        let contributionUSDAmountUserAllProjects = 0;
        for(const project of contributionResponse.data['data']) {
          // compute all time and user contribution sum
          let contributionUSDAmount = 0; // all time
          let contributionUSDAmountUser = 0; // user
          for(const contribution of project['contribution']){
            contributionUSDAmount += parseFloat(contribution['usd_amount']);
            if(contribution['user']['address'] == walletAddress){
              contributionUSDAmountUser += parseFloat(contribution['usd_amount']);
              contributionUSDAmountUserAllProjects += parseFloat(contribution['usd_amount']);
            }
          }
          
          // last update: latest comment / created_at
          let lastUpdateEpoch = 0;
          if (project['comments'].length == 0){
            lastUpdateEpoch = Date.parse(project['created_at']);
          } else {
            for(const comment of project['comments']) {
              lastUpdateEpoch = Math.max(lastUpdateEpoch, Date.parse(comment['created_at']) )
            }
          }
          const lastUpdate = new Date(0);
          lastUpdate.setMilliseconds(lastUpdateEpoch);
          
          const projectURL = `/details?projectAddress=${project['project_address']}`
          // parse into rows to be rendered
          rows.push(
            {
              project: (
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  {project['title']}
                </SoftTypography>
              ),
              category: (
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  {project['category']['name']}
                </SoftTypography>
              ),
              contribution: (
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  ${contributionUSDAmountUser}
                </SoftTypography>
              ),
              raised: (
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  ${contributionUSDAmount}
                </SoftTypography>
              ),
              updated: (
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  {lastUpdate.toISOString().substring(0, 10)}
                </SoftTypography>
              ),
              voting: (
                <SoftTypography variant="body2" color="text" fontWeight="medium">
                  {project['community_proposals'].length}
              </SoftTypography>
            ),
              link: (
                <SoftBox display="flex">
                  <SoftBox>
                    <SoftButton color="primary" href={projectURL}>
                        Details
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              ),
            }
          )
        }
        setContributionData(rows);
        const formattedUSDContributed = parseFloat(contributionUSDAmountUserAllProjects.toFixed(2));
        if (contributionResponse.data['data'].length > 1) {
          setContributionCardData(`USD ${formattedUSDContributed} / ${contributionResponse.data['data'].length} Projects`);
        } else {
          setContributionCardData(`USD ${formattedUSDContributed} / ${contributionResponse.data['data'].length} Project`);
        }
      }

    
      const fundraisingURL = `${contractData['offchainBackendURI']}api/search_projects?field=fundraiser&value=${walletAddress}`
      const fundraisingResponse = await axios.get(fundraisingURL);
      if(fundraisingResponse.status == 200 && fundraisingResponse.data['response'] == 1) {
        let fundraisingUSDAmountUserAllProjects = 0;
        for(const project of contributionResponse.data['data']) {
          // compute all time and user contribution sum
          for(const contribution of project['contribution']){
            fundraisingUSDAmountUserAllProjects += parseFloat(contribution['usd_amount']);
          }
        }
        const formattedUSDRaised = parseFloat(fundraisingUSDAmountUserAllProjects.toFixed(2));
        if (fundraisingResponse.data['data'].length > 1) {
          setFundraisingCardData(`USD ${formattedUSDRaised} / ${fundraisingResponse.data['data'].length} Projects`);
        } else {
          setFundraisingCardData(`USD ${formattedUSDRaised} / ${fundraisingResponse.data['data'].length} Project`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
        {contributionData && contributionCardData && fundraisingCardData && (
          <ProjectsOverview
            contributionCardData={contributionCardData}
            contributionData={contributionData}
            fundraisingCardData={fundraisingCardData}
          />
        )}
    </DashboardLayout>
  );
}

export default Dashboard;
