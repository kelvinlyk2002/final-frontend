// library components
import {useState} from 'react'
import PropTypes from "prop-types";
import { useContractRead, useContract } from "@thirdweb-dev/react";
import { utils } from "ethers";

// theme components
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from 'components/SoftInput';
import SoftButton from 'components/SoftButton';

// layout components
import WithdrawalExecute from 'components/ContractInteractionButtons/WithdrawalExecute';

// data
import { contractData } from "components/ContractInteractionButtons";

function ProjectWithdrawalExecution({projectAddress, overseerAddress, currencyAddress, currencyBalance, currencyDecimals, releaseEpoch}) {
    const releaseDate = new Date(0);
    releaseDate.setUTCSeconds(releaseEpoch);
    const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);

    const { data:approvedWithdrawalAmount } = useContractRead(
        overseerContract,
        "getApprovedWithdrawalAmount",
        [currencyAddress]
    );

    const [amount, setAmount] = useState('');
    const [isShutdown, setIsShutdown] = useState(false);

    const handleMaxAmount = () => {
        if (overseerAddress != '0x0000000000000000000000000000000000000000'){
            setAmount(utils.formatUnits(approvedWithdrawalAmount, currencyDecimals));
        } else {
            setAmount(utils.formatUnits(currencyBalance, currencyDecimals));
        }
    }

    const handleToggleIsShutdown = () => {
        setIsShutdown(!isShutdown)
    }
    
    return (
        <SoftBox my={2}>
            {overseerAddress != '0x0000000000000000000000000000000000000000' && approvedWithdrawalAmount && !approvedWithdrawalAmount.isZero() && (
                <SoftBox>
            <SoftTypography variant="h6" component="h2">
                Execute Withdrawal
            </SoftTypography>
            <SoftTypography variant="body2">
                Withdraw tokens to your wallet.
            </SoftTypography>
            <SoftBox mt={1}>
            <SoftTypography variant="body2" display="block">
                Withdrawable Token Balance: {utils.formatUnits(approvedWithdrawalAmount, currencyDecimals)}
            </SoftTypography>            
            <SoftTypography variant="body2" display="block">
                Withdrawable From: {releaseDate.toString()}
            </SoftTypography>
            <Checkbox checked={isShutdown} onChange={handleToggleIsShutdown} />
            <SoftTypography variant="button" >
                Shutdown project after withdrawal
            </SoftTypography>
            </SoftBox>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <SoftInput value={amount} onInput={e=>setAmount(e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                    <SoftButton color="primary" variant="gradient" onClick={handleMaxAmount} fullWidth>MAX</SoftButton>
                </Grid>
                <Grid item xs={4}>
                    {amount > 0 && Date.now() / 1000 > releaseEpoch ? (
                        <WithdrawalExecute
                            projectAddress={projectAddress}
                            currencyAddress={currencyAddress}
                            amountString={amount}
                            currencyDecimals={currencyDecimals}
                            isShutdown={isShutdown}
                        />
                    ) : (
                        <SoftButton color="primary" variant="gradient" disabled fullWidth>Withdraw</SoftButton>
                    )}
                </Grid>
            </Grid>
            </SoftBox>
            )}
            {overseerAddress == '0x0000000000000000000000000000000000000000' && currencyBalance && !currencyBalance.isZero() && (
                <SoftBox>
            <SoftTypography variant="h6" component="h2">
                Execute Withdrawal
            </SoftTypography>
            <SoftTypography variant="body2">
                Withdraw tokens to your wallet.
            </SoftTypography>
            <SoftBox mt={1}>
            <SoftTypography variant="body2" display="block">
                Withdrawable Token Balance: {utils.formatUnits(approvedWithdrawalAmount, currencyDecimals)}
            </SoftTypography>
            <SoftTypography variant="body2" display="block">
                Withdrawable Token Balance: {utils.formatUnits(currencyBalance, currencyDecimals)}
            </SoftTypography>
            <SoftTypography variant="body2" display="block">
                Withdrawable From: {releaseDate.toString()}
            </SoftTypography>
            <Checkbox checked={isShutdown} onChange={handleToggleIsShutdown} />
            <SoftTypography variant="button" >
                Shutdown project after withdrawal
            </SoftTypography>
            </SoftBox>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <SoftInput value={amount} onInput={e=>setAmount(e.target.value)} />
                </Grid>
                <Grid item xs={2}>
                    <SoftButton color="primary" variant="gradient" onClick={handleMaxAmount} fullWidth>MAX</SoftButton>
                </Grid>
                <Grid item xs={4}>
                    {amount > 0 && Date.now() / 1000 > releaseEpoch ? (
                        <WithdrawalExecute
                            projectAddress={projectAddress}
                            currencyAddress={currencyAddress}
                            amountString={amount}
                            currencyDecimals={currencyDecimals}
                            isShutdown={isShutdown}
                        />
                    ) : (
                        <SoftButton color="primary" variant="gradient" disabled fullWidth>Withdraw</SoftButton>
                    )}
                </Grid>
            </Grid>
            </SoftBox>
            )}
        </SoftBox>   
    )
}

ProjectWithdrawalExecution.propTypes = {
    projectAddress: PropTypes.string,
    overseerAddress: PropTypes.string,
    currencyAddress: PropTypes.string,
    currencyBalance: PropTypes.any, // BN
    currencyDecimals: PropTypes.number,
    releaseEpoch: PropTypes.string,
}

export default ProjectWithdrawalExecution;
