// library components
import { useState } from 'react'
import PropTypes from "prop-types";
import { useContractRead, useContract } from "@thirdweb-dev/react";

// layout components
import ProjectWithdrawalRequest from "layouts/details/components/ProjectWithdrawalRequest"
import ProjectWithdrawalApproval from "layouts/details/components/ProjectWithdrawalApproval"
import ProjectWithdrawalExecution from 'layouts/details/components/ProjectWithdrawalExecution';

// theme components
import Modal from '@mui/material/Modal';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from 'components/SoftButton';

// data
import { contractData } from "components/ContractInteractionButtons";

function ProjectWithdrawal({projectAddress, currencyAddress}) {
    // read if there is overseer address
    const { contract:projectContract } = useContract(projectAddress, contractData['projectAbi']);

    // no overseer = '0x0000000000000000000000000000000000000000'
    const { data:overseerAddress, isLoading:isOverseerAddressLoading } = useContractRead(
      projectContract,
      "getOverseerAddress",
    );

    const { data:releaseEpoch, isLoading:isReleaseEpochLoading } = useContractRead(
        projectContract,
        "getReleaseTime",
      );

    // get project token balance
    const { contract:currencyContract } = useContract(currencyAddress, contractData['erc20abi']);

    const { data:currencyBalance, isLoading:isCurrencyBalanceLoading, error:currencyBalanceError } = useContractRead(currencyContract, "balanceOf", [projectAddress]);

    // get project token decimals
    const { data:currencyDecimals, isLoading:isCurrencyDecimalsLoading, error:currencyDecimalsError } = useContractRead(currencyContract, "decimals");

    // get project token symbol
    const { data:currencySymbol } = useContractRead(currencyContract, "symbol");
    
    // get if withdrawal proposed
    const { contract:overseerContract } = useContract(overseerAddress, contractData['overseerAbi']);
    const { data:withdrawalRequested } = useContractRead(overseerContract, "getWithdrawalProposed");

    // get last proposed withdrawal
    const { data: lastWithdrawalProposalId}= useContractRead(overseerContract, "getLastWithdrawalProposalId");

    const { data: lastWithdrawalAvailableEpoch}= useContractRead(overseerContract, "getProposalDeadline", [lastWithdrawalProposalId]);

    // withdraw modal
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
    const [modalOpen, setModalOpen] = useState(false);
    const toggleModal = () => {
        setModalOpen(!modalOpen);
      }
    
    return (
        <SoftBox>
            <SoftButton color="info" fullWidth variant="gradient" onClick={toggleModal} >
                Withdraw
            </SoftButton>
                 {/* Withdraw modal */}
            <Modal
                open={modalOpen}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <SoftBox sx={modalStyle}>
                <SoftTypography variant="h4" component="h2">
                    Withdraw
                </SoftTypography>
                <SoftTypography variant="body2">
                    Separate withdrawal is required for each currency. 
                </SoftTypography>
            
            {/* load when lastWithdrawalAvailableEpoch has been loaded */}
            {overseerAddress && overseerAddress != '0x0000000000000000000000000000000000000000' && lastWithdrawalAvailableEpoch !== undefined && (
                <ProjectWithdrawalRequest
                    overseerAddress={overseerAddress}
                    currencyAddress={currencyAddress}
                    currencyBalance={currencyBalance}
                    currencyDecimals={currencyDecimals}
                    currencySymbol={currencySymbol}
                    projectAddress={projectAddress}
                    lastWithdrawalAvailableEpoch={lastWithdrawalAvailableEpoch.toString()}
                />
            )}
            {/* only when withdrawal has been identified to be requested */}
            {overseerAddress && overseerAddress != '0x0000000000000000000000000000000000000000' && lastWithdrawalAvailableEpoch !== undefined && withdrawalRequested && (
                <ProjectWithdrawalApproval 
                    overseerAddress={overseerAddress}
                    currencyAddress={currencyAddress}
                    currencyDecimals={currencyDecimals}
                    lastWithdrawalAvailableEpoch={lastWithdrawalAvailableEpoch.toString()}
                />
            )}
            {releaseEpoch && (
                <ProjectWithdrawalExecution 
                projectAddress={projectAddress}
                overseerAddress={overseerAddress}
                currencyBalance={currencyBalance}
                currencyAddress={currencyAddress}
                currencyDecimals={currencyDecimals}
                releaseEpoch={releaseEpoch.toString()}
            />
            )}  
            </SoftBox>
        </Modal>
        </SoftBox>
    )
}

ProjectWithdrawal.propTypes = {
    projectAddress: PropTypes.string,
    currencyAddress: PropTypes.string,
    releaseEpoch: PropTypes.number
}

export default ProjectWithdrawal;
