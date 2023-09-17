// library imports
import PropTypes from "prop-types";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAddress, useContractRead, useContract } from "@thirdweb-dev/react";
import { utils } from "ethers";

// theme components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// layout components
import Description from "components/Description";
import AddressActionDisplayWindow from "../AddressActionDisplayWindow";
import CommunityActionVote from "components/ContractInteractionButtons/CommunityActionVote";
import CommunityActionExecute from "components/ContractInteractionButtons/CommunityActionExecute";

// data
import { contractData } from "components/ContractInteractionButtons";

function ProposalCard({proposalId, title, description, onchain_proposal_nonce, overseerAddress}) {
    const walletAddress = useAddress();
    // retrieve proposal made on chain
    const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);

    const { data:proposalType, isLoading:isProposalTypeLoading } = useContractRead(
        overseerContract,
        "getProposalType",
        [onchain_proposal_nonce]
    );

    const { data:proposalDeadline, isLoading:isProposalDeadlineLoading } = useContractRead(
        overseerContract,
        "getProposalDeadline",
        [onchain_proposal_nonce]
    );

    // parse earliestWithdrawal
    let proposalDeadlineDateObj = new Date(0);
    if(!isProposalDeadlineLoading) {
        proposalDeadlineDateObj.setUTCSeconds(proposalDeadline.toString());
    }

    const { data:quorumWeight, isLoading:isQuorumWeightLoading } = useContractRead(
        overseerContract,
        "getQuromWeight",
        [onchain_proposal_nonce]
    );

    const { data:yayWeight, isLoading:isYayWeightLoading } = useContractRead(
        overseerContract,
        "getYayWeight",
        [onchain_proposal_nonce]
    );

    const { data:nayWeight, isLoading:isNayWeightLoading } = useContractRead(
        overseerContract,
        "getNayWeight",
        [onchain_proposal_nonce]
    );

    const { data:isExecutable, isLoading:isExecutableLoading } = useContractRead(
        overseerContract,
        "isExecutable",
        [onchain_proposal_nonce]
    );

    const { data:isProposalExecuted, isLoading:isProposalExecutedLoading } = useContractRead(
        overseerContract,
        "getProposalExecuted",
        [onchain_proposal_nonce]
    );

    const { data:currencyAddress, isLoading:isProposalCurrencyLoading } = useContractRead(
        overseerContract,
        "getProposalCurrency",
        [onchain_proposal_nonce]
      );
    
    const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20Abi']);
    
    const { data:currencySymbol, isLoading:isCurrencySymbolLoading } = useContractRead(
        currencyContract,
        "symbol",
    );

    const { data:currencyDecimals, isLoading:isCurrencyDecimalsLoading } = useContractRead(
        currencyContract,
        "decimals",
    );
    
    const [votingHistory, setVotingHistory] = useState([]);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCasted, setVoteCasted] = useState();

    const rightTrimZero = (amountString) => {
        if (amountString.slice(amountString.length - 1) != "0" && amountString.slice(amountString.length - 1) != ".") {
          return amountString.substring(0, amountString.length);
        } else {
          return rightTrimZero(amountString.substring(0, amountString.length - 1))
        }
      }    
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
      try {
        const url = `${contractData['offchainBackendURI']}/api/get_votes/${proposalId}/`
        const response = await axios.get(url);
        if(response.status == 200 && response.data['response'] == 1) {
            let votingHistoryParsing = [];
            for(let votingRecord of response.data['data']){
                // parse response
                votingRecord['voter'] = votingRecord['voter']['address'];
                votingRecord['voter_weight'] = rightTrimZero(votingRecord['weight']);
                let vote_time = new Date(Date.parse(votingRecord['created_at']))
                votingRecord['vote_time'] = vote_time.toString();
                votingHistoryParsing.push(votingRecord);
                // check if voted
                if(votingRecord['voter'] == walletAddress) {
                    setHasVoted(true);
                    setVoteCasted(votingRecord['vote']);
                }
            }
            setVotingHistory(votingHistoryParsing);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    return (
    <SoftBox mb={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={9}>
          <Card>
            <SoftBox px={2} py={1}>
              <Grid container>
                <Grid item xs={12} lg={9}>
                  <SoftBox display="flex" flexDirection="column" height="100%">
                    <SoftBox pt={1} mb={0.5}>
                        <SoftTypography variant="body2" color="text" fontWeight="medium">
                            Proposal Nonce #{onchain_proposal_nonce}
                        </SoftTypography>
                        {proposalType !== undefined && (
                        <SoftTypography variant="body2" color="text" fontWeight="medium">
                            Proposal Category: To {contractData['proposalEnum'][proposalType]}
                        </SoftTypography>
                        )}
                        {proposalDeadline && (
                            <SoftTypography variant="body2" color="text" fontWeight="medium">
                                Voting deadline: {proposalDeadlineDateObj.toString()}
                            </SoftTypography>
                        )}
                        {currencySymbol && currencyAddress && (
                            <SoftTypography variant="body2" color="text" fontWeight="medium">
                                Proposal Currency: {currencySymbol} ({currencyAddress})
                            </SoftTypography>
                        )}
                    </SoftBox>
                    <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                      {title}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} lg={3} sx={{ position: "relative", ml: "auto" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {hasVoted == true ? (
                        <SoftBox mt={1}>
                            <SoftTypography display="inline" variant="body2" color="text" fontWeight="medium">
                                You voted: 
                            </SoftTypography>
                            {voteCasted ? (
                                <SoftTypography display="inline" variant="body2" color="success" fontWeight="medium"> YAY</SoftTypography>
                            ) : (
                                <SoftTypography display="inline" variant="body2" color="error" fontWeight="medium"> NAY</SoftTypography>
                            )}
                        </SoftBox>
                        ) : (
                        <SoftBox mt={1}>
                            <SoftTypography display="inline" variant="body2" color="text" fontWeight="medium">
                                You voted: not voted yet
                            </SoftTypography>
                        </SoftBox>
                        )}
                    </Grid>
                    {hasVoted == false && (
                    <Grid item xs={6}>
                        {overseerAddress && (
                            <CommunityActionVote
                                proposalId={proposalId}
                                color="success"
                                text="YAY"
                                onchain_proposal_nonce={onchain_proposal_nonce}
                                overseerAddress={overseerAddress}
                                voteChoice={true}
                            />
                        )}
                    </Grid>
                    )}
                    {hasVoted == false && (
                    <Grid item xs={6}>
                        {overseerAddress && (
                            <CommunityActionVote
                                proposalId={proposalId}
                                color="error"
                                text="NAY"
                                onchain_proposal_nonce={onchain_proposal_nonce}
                                overseerAddress={overseerAddress}
                                voteChoice={false}
                            />
                        )}
                    </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Description
                    name = {description}
                    />
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                    {currencySymbol && quorumWeight && currencyDecimals && (
                        <SoftTypography variant="body2" color="text" fontWeight="medium">
                            Quorum Required: {utils.formatUnits(quorumWeight, currencyDecimals)}&nbsp;
                            {currencySymbol}
                        </SoftTypography>
                        )}
                    </Grid>
                    <Grid item xs={4}>
                    {currencySymbol && yayWeight && currencyDecimals && (
                        <SoftTypography variant="body2" color="success" fontWeight="medium">
                            Yay: {utils.formatUnits(yayWeight, currencyDecimals)}&nbsp;{currencySymbol}
                        </SoftTypography>
                        )}
                    </Grid>
                    <Grid item xs={4}>
                    {currencySymbol && nayWeight && currencyDecimals && (
                        <SoftTypography variant="body2" color="error" fontWeight="medium">
                            Nay: {utils.formatUnits(nayWeight, currencyDecimals)}&nbsp;{currencySymbol}
                        </SoftTypography>
                        )}
                    </Grid>
                </Grid>
              </Grid>
              {!isProposalExecuted ? (
                <SoftBox my={1}>
                    {isExecutable ? (
                    <CommunityActionExecute
                        overseerAddress={overseerAddress}
                        onchain_proposal_nonce={onchain_proposal_nonce}
                        proposalType={proposalType}
                    />
                    ) : (
                        <SoftButton disabled fullWidth color="secondary">Execution Condition Not Met</SoftButton>
                    )}
                </SoftBox>
              ) : (
                <SoftBox my={1}>
                    <SoftButton disabled fullWidth color="secondary">Executed</SoftButton>
                </SoftBox>
              )}
            </SoftBox>
          </Card>
        </Grid>
        <Grid item xs={12} lg={3}>
            <SoftBox mb={1}>
                {votingHistory && (
                <AddressActionDisplayWindow
                    title="Voting History"
                    data={votingHistory}
                    overseerAddress={overseerAddress}
                    onchain_proposal_nonce={onchain_proposal_nonce}
                    proposalId={proposalId}
                />
                )}
            </SoftBox>
      </Grid>
      </Grid>
      </SoftBox>
      );
  
}

ProposalCard.propTypes = {
    proposalId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onchain_proposal_nonce: PropTypes.number.isRequired,
    overseerAddress: PropTypes.string,
}

export default ProposalCard;