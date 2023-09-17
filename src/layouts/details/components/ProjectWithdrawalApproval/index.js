// library components
import {useState} from 'react'
import PropTypes from "prop-types";
import { useContractRead, useContract } from "@thirdweb-dev/react";
import { utils } from "ethers";

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';

// layout components
import WithdrawalApproval from 'components/ContractInteractionButtons/WithdrawalApproval';

// data
import { contractData } from "components/ContractInteractionButtons";

function ProjectWithdrawalApproval({overseerAddress, currencyAddress, currencyDecimals, lastWithdrawalAvailableEpoch}) {
    let lastWithdrawalAvailable = new Date(0);
    lastWithdrawalAvailable.setUTCSeconds(lastWithdrawalAvailableEpoch);

    const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);

    const { data:proposedWithdrawalAmount } = useContractRead(
        overseerContract,
        "getProposedWithdrawalAmount",
        [currencyAddress]
    );

    const { data:objectedWithdrawalAmount } = useContractRead(
        overseerContract,
        "getObjectedWithdrawalAmount",
        [currencyAddress]
    );

    const [amount, setAmount] = useState('');
    const handleMaxAmount = () => {
        setAmount(utils.formatUnits(proposedWithdrawalAmount.sub(objectedWithdrawalAmount), currencyDecimals));
    }
    
    return (
        <SoftBox my={2}>
            <SoftTypography variant="h6" component="h2">
                Approve Withdrawal
            </SoftTypography>
            <SoftTypography variant="body2">
                Approve an amount to be withdrawn. Approved tokens can be withdrawn immediately.
            </SoftTypography>
            {proposedWithdrawalAmount && objectedWithdrawalAmount && (
            <SoftBox my={1}>
                <SoftTypography variant="body2" display="block">
                    Approvable Token Balance: {utils.formatUnits(proposedWithdrawalAmount.sub(objectedWithdrawalAmount), currencyDecimals)}
                </SoftTypography>
                <SoftTypography variant="body2" display="block">
                    Approvable From: {lastWithdrawalAvailable.toString()}
                </SoftTypography>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                    <SoftInput value={amount} onInput={e=>setAmount(e.target.value)} />
                    </Grid>
                    <Grid item xs={2}>
                    <SoftButton color="warning" variant="gradient" onClick={handleMaxAmount} fullWidth>MAX</SoftButton>
                    </Grid>
                    <Grid item xs={4}>
                        {amount > 0 && Date.now() / 1000 > lastWithdrawalAvailableEpoch ? (
                            <WithdrawalApproval
                                overseerAddress={overseerAddress}
                                currencyAddress={currencyAddress}
                                amountString={amount}
                                currencyDecimals={currencyDecimals}
                            />
                        ) : (
                            <SoftButton color="warning" variant="gradient" disabled fullWidth>Approve</SoftButton>
                        )}
                    </Grid>
                </Grid>
            </SoftBox>
            )}
        </SoftBox>
    )
}

ProjectWithdrawalApproval.propTypes = {
    overseerAddress: PropTypes.string,
    currencyAddress: PropTypes.string,
    currencyDecimals: PropTypes.number,
    lastWithdrawalAvailableEpoch: PropTypes.string.isRequired,
}

export default ProjectWithdrawalApproval;
