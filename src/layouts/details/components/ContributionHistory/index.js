// library components
import PropTypes from "prop-types";

// theme components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// layout components
import Contribution from "../Contribution";

function ContributionHistory({data}) {
  const contributorSet = new Set();
  for(var i = 0; i < data.length; i++){
    contributorSet.add(data[i]['user']['address']);
  }
  
  // only taking the latest 5 contributions
  const renderContributions = data.slice(-5).toReversed().map(({ hsh, currency, amount, usd_amount, user, created_at}) => (
    <Contribution key={hsh}
      address={user['address']}
      currency={currency['name']}
      currencyAddress={currency['address']}
      amount={amount}
      usd_amount={usd_amount}
      timestamp={created_at}
      hsh={hsh}
    />
  ));

  // read GET params
  const queryParams = new URLSearchParams(window.location.search);
  const projectAddress = queryParams.get('projectAddress');
  
  const contributionHistoryURL = `/contributionHistory?projectAddress=${projectAddress}`
  return (
    <Card id="delete-account" sx={{ height: "100%" }}>
      <SoftBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <SoftTypography variant="h6" fontWeight="medium" display = "block">
          Recent Contributions
        </SoftTypography>
        <SoftButton variant="outlined" color="info" size="small" href={contributionHistoryURL}>
          view all
        </SoftButton>
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox>
          <SoftTypography display="block" variant="body2" verticalAlign="middle">
            <Icon sx={{ fontWeight: "bold", color: ({ palette: { success } }) => success.main }}>
              person
            </Icon>    
            &nbsp; {contributorSet.size} contributor{contributorSet.size > 1 && "s"} made {data.length} contribution{data.length > 1 && "s"}
            </SoftTypography>
        </SoftBox>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {renderContributions}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

ContributionHistory.propTypes = {
  data: PropTypes.array,
};

export default ContributionHistory;
