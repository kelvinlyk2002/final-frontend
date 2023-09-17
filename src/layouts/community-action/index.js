// library components
import axios from 'axios';
import {useState, useEffect} from 'react';
import { BigNumber } from "ethers";
import { useContractRead, useContract } from "@thirdweb-dev/react";

// theme components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// layout components
import CommunityActionProposal from "./components/CommunityActionProposal";
import VotingPowerCards from "./components/VotingPowerCards";

// data
import { contractData } from "components/ContractInteractionButtons";

function CommunityAction() {
  // read GET params
  const queryParams = new URLSearchParams(window.location.search);
  const projectAddress = queryParams.get('projectAddress');

  const projectPageUrl = `/details?projectAddress=${projectAddress}`

  // variable initiations
  const [proposalData, setProposalData] = useState([]);

  // overseerAddress
  const { contract:projectContract } = useContract(projectAddress, contractData['projectAbi']);
  const { data:overseerAddress, isLoading:isOverseerAddressLoading } = useContractRead(
    projectContract,
    "getOverseerAddress",
  );

  // retrieve the project currencies on-chain, turn into currencyIds and de-duplicate
  const { data:projectCurrencies, isLoading:isProjectCurrenciesLoading } = useContractRead(
    projectContract,
    "getProjectCurrencies",
  );
  
  const currencyMapping = new Map();
  if(!isProjectCurrenciesLoading && !isOverseerAddressLoading){
    for(const address of projectCurrencies){
      let currencyId = BigNumber.from(address);
      currencyMapping.set(address, currencyId.toString());
    }  
  }
  
  const [title, setTitle] = useState('');

  useEffect(() => {
      fetchProposalData();
      fetchProjectData();
  }, []);

  const fetchProposalData = async () => {
    try {
      const url = `${contractData['offchainBackendURI']}api/get_community_proposals/${projectAddress}/`
      const response = await axios.get(url);
      if(response.status == 200 && response.data['response'] == 1) {
        setProposalData(
          <CommunityActionProposal 
            data={response.data['data']}
            projectAddress={projectAddress}
          />
          );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchProjectData = async () => {
    try {
        const url = `${contractData['offchainBackendURI']}api/get_project_data/${projectAddress}/`;
        const response = await axios.get(url);  
        if(response.status == 200 && response.data['response'] == 1) {
          setTitle(
            response.data['data']['title']
          )
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={1}>
          <SoftTypography variant="h3" align="left">
              {title} &nbsp;
          <SoftButton variant="gradient" color="dark" component="a" href={projectPageUrl}>
            Back To Project
          </SoftButton>
        </SoftTypography>
      </SoftBox>
      
              {currencyMapping.size > 0 && (
                <VotingPowerCards
                  projectAddress={projectAddress}
                  overseerAddress={overseerAddress}
                  currencyMapping={currencyMapping}
                />
              )}
      
      <SoftBox py={3} mb={3}>        
          {proposalData}
      </SoftBox>
    </DashboardLayout>
  );
}

export default CommunityAction;
