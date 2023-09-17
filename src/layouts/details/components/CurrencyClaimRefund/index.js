// library components
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {  useContractRead, useContract } from "@thirdweb-dev/react";
import { BigNumber, utils } from "ethers";

// theme components
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import borders from "assets/theme/base/borders";

// layout components
import ClaimRefund from "components/ContractInteractionButtons/ClaimRefund"

// data
import { contractData } from 'components/ContractInteractionButtons';

function CurrencyClaimRefund({projectAddress, currencyAddress, walletAddress}) {
  const { borderWidth, borderColor } = borders;

  const [userClaimable, setUserClaimable] = useState(0);
  const [userClaimDisplay, setUserClaimDisplay] = useState('');
  const [userClaimWei, setUserClaimWei] = useState('');

  const { contract:projectContract } = useContract(projectAddress, contractData['projectAbi']);
  // data for refund amount calculation 
  // refund pot size
  const { data:refundPot, isLoading: isRefundPotLoading } = useContractRead(projectContract, "getRefundPot", [currencyAddress]);
  // project lifetime contribution  
  const { data:projectLifetimeContribution, isLoading: isProjectLifetimeContributionLoading } = useContractRead(projectContract, "getProjectLifetimeContribution", [currencyAddress]);

  // user nft balance
  const currencyId = BigNumber.from(currencyAddress);
  const { data:userBalance, isLoading: isUserBalanceLoading } = useContractRead(projectContract, "balanceOf", [walletAddress, currencyId]);

  // project currency balance
  const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20abi']);
  const { data:projectCurrencyBalance, isLoading: isProjectCurrencyBalanceLoading } = useContractRead(currencyContract, "balanceOf", [projectAddress]);

  // currency details
  const { data:currencyDecimals, isLoading: isCurrencyDecimalsLoading } = useContractRead(currencyContract, "decimals");
  const { data:currencySymbol, isLoading: isCurrencySymbolLoading } = useContractRead(currencyContract, "symbol");

  
  useEffect(() => {
    // when everything has loaded initially
    if( !isRefundPotLoading &&
        !isUserBalanceLoading &&
        !isProjectCurrencyBalanceLoading && 
        !isProjectLifetimeContributionLoading &&
        !isCurrencyDecimalsLoading &&
        !isCurrencySymbolLoading
        ) {
            if(projectLifetimeContribution.isZero()){
                // uncontributed currencies
                setUserClaimable(BigNumber.from('0'));
            } else {
                // max
                setUserClaimable(userBalance);
                // max by default
                setUserClaimWei(userBalance);
                // display parsed string
                setUserClaimDisplay(utils.formatUnits(userBalance, currencyDecimals));
            }
    }
  }, [userBalance, projectCurrencyBalance, projectLifetimeContribution, currencyDecimals, currencySymbol]); // listen for changes
    
  const handleUserInput = (event) => {
    if(!isCurrencyDecimalsLoading){
        setUserClaimDisplay(event.target.value);
        setUserClaimWei(utils.parseUnits(event.target.value, currencyDecimals));
    }
  }

  const handleMaxAmount = () => {   
    if(!isCurrencyDecimalsLoading){
        setUserClaimDisplay(utils.formatUnits(userClaimable, currencyDecimals));
        setUserClaimWei(userClaimable); // in wei, BN
    }
  }

  const [modalOpen, setModalOpen] = useState(false);
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

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }


  return (
    <SoftBox sx={{alignItems: 'center'}}>
    { refundPot && !refundPot.isZero() && 
      userClaimable && !userClaimable.isZero() ? (
    <SoftBox>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <SoftBox
          border={`${borderWidth[1]} solid ${borderColor}`}
          borderRadius="lg"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={1}
        >
            <SoftTypography variant="body2" fontWeight="regular">
                {currencySymbol} 
            </SoftTypography>
        <SoftBox mx={1}>
          <SoftInput value={userClaimDisplay} onInput={handleUserInput}/>
        </SoftBox>
        <SoftBox p={1}>
          <SoftButton color="primary" onClick={handleMaxAmount}>MAX</SoftButton>
        </SoftBox>
      </SoftBox>
      </Grid>
      <Grid item xs={12}>
        {currencySymbol && (
        <SoftButton color="primary" fullWidth onClick={toggleModal}>
            Claim {currencySymbol}
        </SoftButton>
        )}
      </Grid>
    </Grid>
    <Modal
                open={modalOpen}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <SoftBox sx={modalStyle}>
                  <SoftTypography variant="h4" component="h2">
                    Withdraw {currencySymbol}
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    If the fundraiser had withdrawn, only the unwithdrawn amount could be refunded and all refunds would be pro-rata. Before you can claim executed refunds, you must redeem your voting weight from the community oversight.
                  </SoftTypography>
                  <SoftBox my={2}>
                    <SoftTypography variant="body2">
                      Your balance: {utils.formatUnits(userBalance, currencyDecimals)} {currencySymbol}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Requesting refund: {userClaimDisplay} {currencySymbol}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Adjustment for withdrawn funds: {utils.formatUnits(utils.parseUnits("100", currencyDecimals).mul(refundPot).div(projectLifetimeContribution))}% {currencySymbol}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Pro-rated refund you can receive: {utils.formatUnits(userClaimWei.mul(refundPot).div(projectLifetimeContribution))} {currencySymbol}
                    </SoftTypography>
                  </SoftBox>
                  <SoftTypography variant="body2">
                    Unclaimed refunds would remain claimable.
                  </SoftTypography>
                  <SoftBox mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        {userClaimWei && (
                            <ClaimRefund
                                projectAddress={projectAddress}
                                currencyAddress={currencyAddress}
                                userClaimWei={userClaimWei}
                            />
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <SoftButton onClick={toggleModal} color="error" variant="gradient" fullWidth>
                          Cancel
                        </SoftButton>
                      </Grid>
                    </Grid>
                    </SoftBox>
                </SoftBox>
              </Modal>

  </SoftBox>
    ) : (
        <SoftBox>
            { currencySymbol && (
            <SoftTypography variant="body2" fontWeight="light">
                No refund claimable for {currencySymbol}.
            </SoftTypography>
            )}
        </SoftBox>
    )}

  </SoftBox>
  );
}

CurrencyClaimRefund.propTypes = {
    projectAddress: PropTypes.string.isRequired,
    currencyAddress: PropTypes.string.isRequired,
    walletAddress: PropTypes.string,
  }

export default CurrencyClaimRefund;