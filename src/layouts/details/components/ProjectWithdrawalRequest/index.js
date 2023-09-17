// library components
import {useState} from 'react'
import PropTypes from "prop-types";
import { utils } from "ethers";
import { useContractRead, useContract } from "@thirdweb-dev/react";

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';

// layout components
import WithdrawalRequest from 'components/ContractInteractionButtons/WithdrawalRequest';
import WithdrawalAbandon from 'components/ContractInteractionButtons/WithdrawalAbandon';

// data
import { contractData } from "components/ContractInteractionButtons";

function ProjectWithdrawalRequest({overseerAddress, currencyAddress, currencyBalance, currencyDecimals, currencySymbol, projectAddress, lastWithdrawalAvailableEpoch}) {

    let lastWithdrawalAvailable = new Date(0);
    lastWithdrawalAvailable.setUTCSeconds(lastWithdrawalAvailableEpoch);

    // get if a withdrawal has been requested
    const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);

    const { data:withdrawalRequested } = useContractRead(overseerContract, "getWithdrawalProposed");

    const [amount, setAmount] = useState('');
    const handleMaxAmount = () => {
        setAmount(utils.formatUnits(currencyBalance, currencyDecimals));
    }
    
    return (
        <SoftBox my={2}>
            <SoftTypography variant="h6" component="h2">
                Request Withdrawal
            </SoftTypography>
            {withdrawalRequested ? (
            <SoftBox>
                <SoftTypography variant="body2">
                    A withdrawal has been requested which would be executable on {lastWithdrawalAvailable.toString()}. Check community actions for details. You may abandon this withdrawal, which would reset all proposed and objected amount.
                </SoftTypography>
                <WithdrawalAbandon
                    overseerAddress={overseerAddress}
                    currencyAddress={currencyAddress}
                />
            </SoftBox>
            ) : (
            <SoftBox>
                <SoftTypography variant="body2">
                    Community oversight enabled projects must allow 7 days for the community to vote for any rejection. After the voting period, the proposed amount less the objected amount would be withdrawable.
                </SoftTypography>
                <SoftBox my={1}>
                    <SoftTypography variant="body2" display="block">
                        Project Token Balance: {utils.formatUnits(currencyBalance, currencyDecimals)}
                    </SoftTypography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                        <SoftInput value={amount} onInput={e=>setAmount(e.target.value)} />
                        </Grid>
                        <Grid item xs={2}>
                        <SoftButton color="info" variant="gradient" onClick={handleMaxAmount} fullWidth>MAX</SoftButton>
                        </Grid>
                        <Grid item xs={4}>
                            {amount > 0 ? (
                                <WithdrawalRequest 
                                    overseerAddress={overseerAddress}
                                    currencyAddress={currencyAddress}
                                    projectAddress={projectAddress}
                                    amountString={amount}
                                    currencyDecimals={currencyDecimals}
                                    currencySymbol={currencySymbol}
                                />
                            ) : (
                                <SoftButton color="info" variant="gradient" disabled fullWidth>Request</SoftButton>
                            )}
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
            )}
        </SoftBox>
    )
}

ProjectWithdrawalRequest.propTypes = {
    overseerAddress: PropTypes.string,
    currencyAddress: PropTypes.string,
    currencyBalance: PropTypes.object, // BigNumber
    currencyDecimals: PropTypes.number,
    currencySymbol: PropTypes.string,
    projectAddress: PropTypes.string,
    lastWithdrawalAvailableEpoch: PropTypes.string.isRequired,
}

export default ProjectWithdrawalRequest;
