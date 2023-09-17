// library components
import { useState } from 'react';
import PropTypes from "prop-types";
import { useAddress, useContractRead, useContract } from "@thirdweb-dev/react";
import { BigNumber, utils } from "ethers";

// theme components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton"
import SoftInput from "components/SoftInput";

// layout components
import VoteWeightApprove from 'components/ContractInteractionButtons/VoteWeightApprove';
import VoteWeightDeposit from 'components/ContractInteractionButtons/VoteWeightDeposit';
import VoteWeightRedeem from 'components/ContractInteractionButtons/VoteWeightRedeem';
import VoteWeightTransfer from 'components/ContractInteractionButtons/VoteWeightTransfer';
import CommunityActionPropose from 'components/ContractInteractionButtons/CommunityActionPropose';

// data
import { contractData } from "components/ContractInteractionButtons";

function VotingPowerCard({ projectAddress, overseerAddress, currencyId, currencyAddress }) {
  // retrieve user wallet address
  const walletAddress = useAddress();

  // retrieve nft balance of user
  const { contract:projectContract } = useContract(projectAddress, contractData['projectAbi']);
  const { data:availableWeight, isLoading:isAvailableWeightLoading } = useContractRead(
    projectContract, "balanceOf", [walletAddress, currencyId]);

  // is nft approved
  const { data:isApprovedWeight, isLoading:isApprovedWeightLoading } = useContractRead(
    projectContract, "isApprovedForAll", [walletAddress, overseerAddress]);
 
  // retrieve deposited nft balance of user
  const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);
  const { data:depositedWeight, isLoading:isDepositedWeightLoading } = useContractRead(
    overseerContract, "getDepositedWeight", [currencyAddress, walletAddress]);

  // retrieve earliest withdrawal
  const { data:earliestWithdrawal, isLoading:isEarliestWithdrawalLoading } = useContractRead(
    overseerContract, "getEarliestRedeemTimestamp", [currencyAddress, walletAddress]);

  // parse earliestWithdrawal
  let earliestWithdrawalDateObj = new Date(0);
  if(!isEarliestWithdrawalLoading) {
    earliestWithdrawalDateObj.setUTCSeconds(earliestWithdrawal.toString());
  }

  // retrieve decimals data of currency
  const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20abi']);
  const { data:currencyDecimals, isLoading:isCurrencyDecimalsLoading } = useContractRead(currencyContract, "decimals");

  // retrieve symbol, but can be empty
  const { data:currencySymbol, isLoading:isCurrencySymbolLoading, error: currencySymbolError} = useContractRead(currencyContract, "symbol"); 

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // deposit modal
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  // redeem modal
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');
  const timeNow = Date.now();

  // transfer modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferToAddress, setTransferToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // propose modal
  const [proposeModalOpen, setProposeModalOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [defaultProposalConfig, setDefaultProposalConfig] = useState(true);
  const [deadlineDate, setDeadlineDate] = useState();
  const [deadlineTime, setDeadlineTime] = useState();
  const refreshTime = () => {
    const earliestDeadline = new Date();
    earliestDeadline.setTime(earliestDeadline.getTime() + 309000 * 1000);
    setDeadlineDate(earliestDeadline.toISOString().substring(0, 10));
    setDeadlineTime(earliestDeadline.toISOString().substring(11, 16));
  }
  const proposalEnums = 
  {
    'Block': '1',
    'Unblock': '2',
    'Refund': '3'
  };
  const [typeEnum, setTypeEnum] = useState(Object.keys(proposalEnums)[0]);
  const [quorumPercentage, setQuorumPercentage] = useState(25);
  
  // toggle functions
  const toggleDepositModal = () => {
    setDepositModalOpen(!depositModalOpen);
    }

  const toggleRedeemModal = () => {
    setRedeemModalOpen(!redeemModalOpen);
  }

  const toggleTransferModal = () => {
    setTransferModalOpen(!transferModalOpen);
  }

  const toggleProposeModal = () => {
    // update time everytime when modal is toggled, if default
    if(defaultProposalConfig) {
      refreshTime();
    }
    setProposeModalOpen(!proposeModalOpen);
  }

  const handleSetDefaultProposalConfig = () => {
    setDefaultProposalConfig(!defaultProposalConfig);
  }

  // button functionalities
  const handleMaxDepositAmount = () => {
    setDepositAmount(utils.formatUnits(availableWeight, currencyDecimals));
  }

  const handleMaxRedeemAmount = () => {
    setRedeemAmount(utils.formatUnits(depositedWeight, currencyDecimals));
  }

  const handleMaxTransferAmount = () => {
    setTransferAmount(utils.formatUnits(availableWeight, currencyDecimals));
  }

  return (
    <Card>
      <SoftBox bgColor="white" variant="gradient" p={3} lineHeight={1}>
        <SoftTypography
          variant="button"
          fontWeight="regular"
        >
        Voting Weight - 
        {currencySymbol && (
        <SoftTypography
        variant="button"
        fontWeight="regular"
        > {currencySymbol}
        </SoftTypography>)}
          &nbsp;({currencyAddress.substring(0,6)}***{currencyAddress.substring(38)})
        </SoftTypography>
        {depositedWeight && currencyDecimals && (
        <SoftTypography
          variant="h6"
          fontWeight="medium"
        >
          Deposited Voting Weight: {utils.formatUnits(depositedWeight, currencyDecimals)}
        </SoftTypography>
        )}
        { availableWeight && currencyDecimals && (
          <SoftTypography
          variant="h6"
          fontWeight="medium"
        >
          Available Voting Weight: {utils.formatUnits(availableWeight, currencyDecimals)}
        </SoftTypography>
        )}
        { earliestWithdrawal && earliestWithdrawalDateObj &&
        earliestWithdrawal.toString() != BigNumber.from(0).toString() ?
        (
          <SoftTypography
          variant="button"
          textTransform="capitalize"
          fontWeight="regular"
        >
          Redeemable: {earliestWithdrawalDateObj.toString()}
        </SoftTypography>
        ) : (
          <SoftTypography
            variant="button"
            textTransform="capitalize"
            fontWeight="regular"
          >
          Redeemable: Now
          </SoftTypography>
        )}
        <SoftBox m={1} display="block">
          <SoftBox mx={1} display="inline">
            <SoftButton 
              color="primary"
              variant="gradient"
              onClick={toggleDepositModal}
            >
              deposit
          </SoftButton>
        </SoftBox>
        <SoftBox mx={1} display="inline">
          <SoftButton 
            color="warning"
            variant="gradient"
            onClick={toggleRedeemModal}
          >
            redeem
          </SoftButton>
        </SoftBox>
        <SoftBox mx={1} display="inline">
          <SoftButton 
            color="info"
            variant="gradient"
            onClick={toggleTransferModal}
          >
            transfer
          </SoftButton>
        </SoftBox>
        <SoftBox mx={1} display="inline">
          <SoftButton 
            color="dark"
            variant="gradient"
            onClick={toggleProposeModal}
          >
            propose
          </SoftButton>
        </SoftBox>
        </SoftBox>
      </SoftBox>
       {/* Deposit modal */}
       <Modal
            open={depositModalOpen}
            onClose={toggleDepositModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <SoftBox sx={modalStyle}>
                <SoftTypography variant="h4" component="h2">
                    Deposit Voting Power
                </SoftTypography>
                <SoftTypography variant="body2">
                    Deposit your voting weight to vote in proposals. Deposited voting weight cannot be transferred, and can only be redeemed after the last deadline of the proposals you voted has past. You need to approve before your voting weight can be deposited.
                </SoftTypography>
                <SoftBox my={2}>
                    { availableWeight && currencyDecimals && (
                    <SoftTypography variant="body2" display="block">
                      Available Voting Weight: {utils.formatUnits(availableWeight, currencyDecimals)}
                    </SoftTypography>
                    )}
                    <Grid container spacing={1}>
                      <Grid item xs={10}>
                        <SoftInput value={depositAmount} onInput={e=>setDepositAmount(e.target.value)} />
                      </Grid>
                      <Grid item xs={2}>
                        <SoftButton color="primary" variant="gradient" onClick={handleMaxDepositAmount} fullWidth>MAX</SoftButton>
                      </Grid>
                    </Grid>
                </SoftBox>
                <SoftBox mb={1}>
                    <SoftTypography variant="body2">
                      Currency of the voting weight to be deposited: {currencyAddress}
                    </SoftTypography>
                  </SoftBox>
                <SoftBox mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            { isApprovedWeight ? currencyDecimals && (
                              // Approved, 
                              <SoftButton color="success" variant="gradient" fullWidth disabled>
                                Approved
                              </SoftButton>
                            ) : (
                              <VoteWeightApprove
                              projectAddress={projectAddress}
                              overseerAddress={overseerAddress}
                              />
                            )}
                        </Grid>
                        <Grid item xs={4}>
                        { isApprovedWeight ? currencyDecimals && depositAmount > 0 && (
                              <VoteWeightDeposit
                              overseerAddress={overseerAddress}
                              currencyAddress={currencyAddress}
                              weiAmountString={
                                utils.parseUnits(depositAmount, currencyDecimals).toString()
                              }
                            />
                            ) : (
                            <SoftButton color="error" variant="gradient" fullWidth disabled>
                                Approve first
                              </SoftButton>
                            )}
                        </Grid>
                        <Grid item xs={4}>
                            <SoftButton onClick={toggleDepositModal} variant="gradient" fullWidth>
                                Cancel
                            </SoftButton>
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </Modal>
         {/* Redeem modal */}
         <Modal
            open={redeemModalOpen}
            onClose={toggleRedeemModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <SoftBox sx={modalStyle}>
                <SoftTypography variant="h4" component="h2">
                    Redeem Voting Weight
                </SoftTypography>
                <SoftTypography variant="body2">
                    Redeem your voting weight to transfer your voting weight to others, or claim your refunds if a refund proposal has been passed and executed.
                </SoftTypography>
                <SoftBox my={2}>
                    { availableWeight && currencyDecimals && (
                    <SoftTypography variant="body2" display="block">
                      Deposited Voting Weight: {utils.formatUnits(depositedWeight, currencyDecimals)}
                    </SoftTypography>
                    )}
                    <Grid container spacing={1}>
                      <Grid item xs={10}>
                        <SoftInput value={redeemAmount} onInput={e=>setRedeemAmount(e.target.value)} />
                      </Grid>
                      <Grid item xs={2}>
                        <SoftButton color="warning" variant="gradient" onClick={handleMaxRedeemAmount} fullWidth>MAX</SoftButton>
                      </Grid>
                    </Grid>
                </SoftBox>
                <SoftBox mb={1}>
                    <SoftTypography variant="body2">
                      Currency of voting weight to be withdrawn: {currencyAddress}
                    </SoftTypography>
                  </SoftBox>
                <SoftBox mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            { currencyDecimals && redeemAmount > 0 && (
                              <SoftBox>
                                {earliestWithdrawal && earliestWithdrawal < Date.now() / 1000 ? (
                                <VoteWeightRedeem
                                  overseerAddress={overseerAddress}
                                  currencyAddress={currencyAddress}
                                  weiAmountString={
                                    utils.parseUnits(redeemAmount, currencyDecimals).toString()
                                  }
                                />) : (
                                  <SoftButton fullWidth color="warning" variant="gradient" disabled>
                                    Unredeemable yet
                                  </SoftButton>                      
                                )}
                              </SoftBox>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <SoftButton onClick={toggleRedeemModal} variant="gradient" fullWidth>
                                Cancel
                            </SoftButton>
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </Modal>
         {/* Transfer modal */}
         <Modal
            open={transferModalOpen}
            onClose={toggleTransferModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <SoftBox sx={modalStyle}>
                <SoftTypography variant="h4" component="h2">
                    Transfer Voting Weight
                </SoftTypography>
                <SoftTypography variant="body2">
                    Transfer your voting weight to another address. Note that voting weight represent the fund that you had contributed to the project, which may be used by the fundraiser to identify contributors.
                </SoftTypography>
                <SoftBox my={2}>
                    { availableWeight && currencyDecimals && (
                    <SoftTypography variant="body2" display="block">
                      Available Voting Weight: {utils.formatUnits(availableWeight, currencyDecimals)}
                    </SoftTypography>
                    )}
                    <SoftBox my={1}>
                      <SoftInput value={transferToAddress} onInput={e=>setTransferToAddress(e.target.value)} placeholder="Send to (0x...)"/>
                    </SoftBox>
                    <Grid container spacing={1}>
                      <Grid item xs={10}>
                        <SoftInput value={transferAmount} onInput={e=>setTransferAmount(e.target.value)} />
                      </Grid>
                      <Grid item xs={2}>
                        <SoftButton color="info" variant="gradient" onClick={handleMaxTransferAmount} fullWidth>MAX</SoftButton>
                      </Grid>
                    </Grid>
                </SoftBox>
                <SoftBox mb={1}>
                    <SoftTypography variant="body2">
                      Currency of the voting weight: {currencyAddress}
                    </SoftTypography>
                  </SoftBox>
                <SoftBox mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {currencyDecimals && transferAmount > 0 && (
                              <VoteWeightTransfer
                                projectAddress={projectAddress}
                                toAddress={transferToAddress}
                                currencyId={currencyId}
                                weiAmountString={utils.parseUnits(transferAmount, currencyDecimals).toString()}
                              />  
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <SoftButton onClick={toggleTransferModal} variant="gradient" fullWidth>
                                Cancel
                            </SoftButton>
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </Modal>
        {/* Propose modal */}
            <Modal
              open={proposeModalOpen}
              onClose={toggleProposeModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <SoftBox sx={modalStyle}>
                <SoftTypography variant="h4" component="h2">
                    Propose New Community Action
                </SoftTypography>
                <SoftTypography variant="body2">
                    Propose to block new contribution to the project, to freeze withdrawal, or to refund. Should a refund proposal be passed, note that refunds would be proportional to the overall voting weight and the remaining funds unwithdrawn. Refunds are administered independently, and a separate refund proposal is required for each currencies.
                </SoftTypography>
                <SoftBox my={2}>
                  <SoftBox my={1}>
                    <Autocomplete
                    value={typeEnum}
                    onChange={(event, selectedType) => {
                      setTypeEnum(selectedType);
                    }}
                    options={Object.keys(proposalEnums)}
                    renderInput={(params) => <TextField {...params} label="Proposal Type" />}
                  />
                  </SoftBox>
                  <SoftTypography variant="body2">
                    Community proposals must have a quorum of at least 25% and a voting period of at least 3.5 days. Time displayed below is based on your local timezone.
                  </SoftTypography>
                  <SoftBox my={1}>
                    <Checkbox checked={defaultProposalConfig} onChange={handleSetDefaultProposalConfig} />
                    <SoftTypography variant="button" >
                      Use default voting configuration
                    </SoftTypography>
                  </SoftBox>
                  {!defaultProposalConfig && (
                  <SoftBox my={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                      <SoftInput value={quorumPercentage} onInput={e=>setQuorumPercentage(e.target.value)} placeholder="Quorum Percentage, min 25" type="number"/>
                      </Grid>
                      <Grid item xs={4}>
                      <SoftInput type="date" value={deadlineDate} onChange={e=>setDeadlineDate(e.target.value)}/>
                      </Grid>
                      <Grid item xs={4}>
                      <SoftInput type="time" value={deadlineTime} onChange={e=>setDeadlineTime(e.target.value)}/>
                      </Grid>
                    </Grid>                        
                  </SoftBox>
                  )}
                  <SoftTypography variant="body2">
                    Provide context for your proposal.
                  </SoftTypography>
                  <SoftBox my={1}>
                    <SoftInput value={proposalTitle} onInput={e=>setProposalTitle(e.target.value)} placeholder="Proposal Title (Required)" />
                  </SoftBox>
                  <SoftBox my={1}>
                    <SoftInput
                      type="text"
                      value={proposalDescription} 
                      placeholder="Proposal Description (Required)" 
                      multiline 
                      rows={10}
                      onInput={e=>setProposalDescription(e.target.value)}
                    />
                  </SoftBox>
                  <SoftBox mb={1}>
                    <SoftTypography variant="body2">
                      Currency of the proposal: {currencyAddress}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                          {typeEnum && quorumPercentage && deadlineDate && deadlineTime && proposalTitle && proposalDescription && (
                          <CommunityActionPropose
                            projectAddress={projectAddress}
                            overseerAddress={overseerAddress}
                            typeEnum={proposalEnums[typeEnum]}
                            currencyAddress={currencyAddress}
                            quorumPercentage={quorumPercentage}
                            deadlineEpoch={Date.parse(deadlineDate + " " + deadlineTime) / 1000}
                            proposalTitle={proposalTitle}
                            proposalDescription={proposalDescription}
                          />
                          )}
                        </Grid>
                        <Grid item xs={6}>
                            <SoftButton onClick={toggleProposeModal} variant="gradient" fullWidth>
                                Cancel
                            </SoftButton>
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </Modal>
    </Card>
  );
}

VotingPowerCard.propTypes = {
  projectAddress: PropTypes.string,
  currencyId: PropTypes.string, 
  currencyAddress: PropTypes.string,
  overseerAddress: PropTypes.string,
};

export default VotingPowerCard;
