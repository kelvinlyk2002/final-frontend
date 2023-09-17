// library components
import PropTypes from "prop-types";

// theme components
import Grid from "@mui/material/Grid";

// layout components
import VotingPowerCard from "../VotingPowerCard";

function VotingPowerCards({projectAddress, overseerAddress, currencyMapping}) {
  const renderVotingPowerCard = [...currencyMapping].map((currencyPair, id) => (
          <Grid item xs={12} lg={6} key={id}>
            <VotingPowerCard
                projectAddress={projectAddress}
                overseerAddress={overseerAddress}
                currencyAddress={currencyPair[0]}
                currencyId={currencyPair[1]}
              />
            </Grid>
  ));
  
  return (
    <Grid container spacing={1}>
      {renderVotingPowerCard}
    </Grid>
  );
}

VotingPowerCards.propTypes = {
  currencyMapping: PropTypes.object,
  projectAddress: PropTypes.string,
  overseerAddress: PropTypes.string,
};

export default VotingPowerCards;
