// library imports
import PropTypes from "prop-types";
import { useContractRead, useContract } from "@thirdweb-dev/react";

// theme components
import SoftBox from "components/SoftBox";

// layout components
import ProposalCard from "../ProposalCard";

// data
import { contractData } from "components/ContractInteractionButtons";
 
function CommunityActionProposal({data, projectAddress}) {
    // overseerAddress
    const { contract:projectContract } = useContract(projectAddress, contractData['projectAbi']);
    const { data:overseerAddress, isLoading:isOverseerAddressLoading } = useContractRead(
      projectContract,
      "getOverseerAddress",
    );

    const renderData = data.toReversed().map(({ id, title, description, onchain_proposal_nonce }) => (
      <ProposalCard key={id}
        proposalId = {id}
        title = {title}
        description = {description}
        onchain_proposal_nonce = {onchain_proposal_nonce}
        overseerAddress = {overseerAddress}
      />
    ));

    return (
      <SoftBox>
        {overseerAddress && (
          <SoftBox>
            {renderData}  
          </SoftBox>
        )}
      </SoftBox>
    );
}

CommunityActionProposal.defaultProps = {
  data: []
};

CommunityActionProposal.propTypes = {
  data: PropTypes.array,
  projectAddress: PropTypes.string,
}

export default CommunityActionProposal;
