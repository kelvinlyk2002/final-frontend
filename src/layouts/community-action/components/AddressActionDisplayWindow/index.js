// library imports
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// layout components
import AddressAction from "../AddressAction";

function AddressActionDisplayWindow({title, data, overseerAddress, onchain_proposal_nonce, proposalId}) {
    // last 5 only
    const renderData = data.slice(-5).toReversed().map(({ voter, voter_weight, vote_time, vote }) => (
      <AddressAction key={voter}
        voter={voter}
        voter_weight={voter_weight}
        vote_time={vote_time}
        vote={vote}
        overseerAddress={overseerAddress}
        onchain_proposal_nonce={onchain_proposal_nonce}
      />
    ));

    const votingHistoryURL = `/votingHistory?proposalId=${proposalId}`
    return (
      <Card id="delete-account" sx={{ height: "100%" }}>
        <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography variant="h6" fontWeight="medium">
            {title}
          </SoftTypography>
          <SoftButton variant="outlined" color="info" size="small" href={votingHistoryURL}>
            view all
          </SoftButton>
        </SoftBox>
        <SoftBox p={2}>
          {data.length > 0 ? (
            <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {renderData}
          </SoftBox>
          ) : (
            <SoftTypography variant="body2" fontWeight="regular">
            No vote yet
            </SoftTypography>
          )}
        </SoftBox>
      </Card>
    ); 
}

AddressActionDisplayWindow.defaultProps = {
  title: "list",
};

AddressActionDisplayWindow.propTypes = {
  title: PropTypes.string,
  overseerAddress: PropTypes.string,
  onchain_proposal_nonce: PropTypes.number,
  data: PropTypes.array,
  proposalId: PropTypes.number,
}

export default AddressActionDisplayWindow;
