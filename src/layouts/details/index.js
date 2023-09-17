// library components
import axios from 'axios';
import {useState, useEffect} from 'react';

// theme components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "components/DashboardLayout";
import DashboardNavbar from "components/DashboardNavbar";

// layout components
import Features from "./components/Features"
import PaymentForm from "./components/PaymentForm";
import ContributionHistory from "./components/ContributionHistory";
import Description from "components/Description";
import Comments from "./components/Comments";
import CommunityAction from "./components/CommunityAction";
import ProjectCurrency from "./components/ProjectCurrency";
import ProjectImages from "./components/ProjectImages";
import ProjectClaimRefund from "./components/ProjectClaimRefund";

// data
import { contractData } from 'components/ContractInteractionButtons';

function Details() {
  const [title, setTitle] = useState([]);
  const [features, setFeatures] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [currenciesRefund, setCurrenciesRefund] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [comments, setComments] = useState([]);
  const [communityProposal, setCommunityProposal] = useState([]);
  const [payment, setPayment] = useState([]);
  const [contributionHist, setContributionHist] = useState([]);
  const [imageList, setImageList] = useState([]);

  // read GET params
  const queryParams = new URLSearchParams(window.location.search);
  const projectAddress = queryParams.get('projectAddress');

  useEffect(() => {
    fetchData();
  }, []);
  
  const rightTrimZero = (amountString) => {
    if (amountString.slice(amountString.length - 1) != "0" && amountString.slice(amountString.length - 1) != ".") {
      return amountString.substring(0, amountString.length);
    } else {
      return rightTrimZero(amountString.substring(0, amountString.length - 1))
    }
  }

  const fetchData = async () => {
    try {
      const url = `${contractData['offchainBackendURI']}api/get_project_data/${projectAddress}/`;
      const response = await axios.get(url);  
      if(response.status == 200 && response.data['response'] == 1) {
        setTitle(
          response.data['data']['title']
        )

        setFeatures(
          <Features
            category = {response.data['data']['category']['name']}
            communityOversight = {response.data['data']['community_oversight']}
            releaseEpoch = {response.data['data']['release_epoch']}
            createdAt = {response.data['data']['created_at']}
          />
        );

        let images = [];
        // append image to the list
        for(const image of response.data['data']['media']) {
          images = [...images, 
            image['image']
          ]
        }
        setImageList(images);

        let acceptedCurrencies = [];
        for(const currency of response.data['data']['currencies']){
          // data for project currency
          let amountContributed = 0;
          let usdAmountContributed = 0;
          for(const contribution of response.data['data']['contribution']){
            if( contribution['currency']['address'] == currency['address'] ){
                let amount = rightTrimZero(contribution['amount']);
                amountContributed += parseFloat(amount);
                usdAmountContributed += parseFloat(contribution['usd_amount']);
            }
          }

          acceptedCurrencies.push(
            {
              name: currency['name'],
              address: currency['address'],
              amount: amountContributed,
              usd_amount: usdAmountContributed
            }
          );
        }

        setCurrencies(
          <ProjectCurrency
            projectAddress={response.data['data']['project_address']}
            fundraiser={response.data['data']['fundraiser']['address']}
            data={acceptedCurrencies}
          />
        );

        setCurrenciesRefund(
          <ProjectClaimRefund
            projectAddress={projectAddress}
            currencyAddressArray={acceptedCurrencies}
          />
        )

        setDescriptions(
          <Description
            name={response.data['data']['description']}
            editable={true}
          />
        );

        setComments(
          <Comments
            fundraiser={response.data['data']['fundraiser']['address']} 
            data={response.data['data']['comments']}
            projectAddress={response.data['data']['project_address']}
          />
        );

        if(response.data['data']['community_oversight']){
          setCommunityProposal(
            <CommunityAction
              projectAddress={response.data['data']['project_address']}
              count={response.data['data']['community_proposals'].length}
            />
          );
        }
        
        setPayment(
          <PaymentForm 
            projectAddress={response.data['data']['project_address']}
            data={response.data['data']['currencies']}
          />
        );
        
        setContributionHist(
          <ContributionHistory 
            data={response.data['data']['contribution']}
          />
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={4}>
        <SoftBox my={2}>
        {imageList && (
          <ProjectImages 
            imageList = {imageList}
          />
        )}
        </SoftBox>
        <SoftBox mb={1.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
            <SoftBox mb={1.5}>
                <Card>
                  <SoftBox pt={3} px={2}>
                    <SoftTypography variant="h6" fontWeight="medium">
                      {title}
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox pt={1} pb={2} px={2}>
                    <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                      {descriptions}
                    </SoftBox>
                  </SoftBox>
                </Card>
                </SoftBox>
                {features}
                <SoftBox mb={1.5}>
                  {currencies}
                </SoftBox>        

                <SoftBox mb={1.5}>
                  {comments}
                </SoftBox>
            </Grid>
            <Grid item xs={12} lg={4}>
              {communityProposal}
              <SoftBox mb={1.5}>
                {payment}
              </SoftBox>
              <SoftBox mb={1.5}>
                {contributionHist}
              </SoftBox>
              {currenciesRefund}
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox> 
    </DashboardLayout>
  );
}

export default Details;
