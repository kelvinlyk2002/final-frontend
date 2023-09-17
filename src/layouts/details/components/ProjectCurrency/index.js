// library components
import {useState} from 'react'
import PropTypes from "prop-types";
import { useAddress } from "@thirdweb-dev/react";

// theme components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from 'components/SoftInput';

// layout components
import AddCurrency from 'components/ContractInteractionButtons/AddCurrency';
import ProjectCurrencyData from '../ProjectCurrencyData';

// Images
function ProjectCurrency({fundraiser, projectAddress, releaseEpoch, data}) {
  const walletAddress = useAddress();
  const [newCurrency, setNewCurrency] = useState([]);
  const renderCurrency = data.map(({ address, amount, usd_amount }) => (
    <ProjectCurrencyData key={address}
      currencyAddress={address}
      projectAddress={projectAddress}
      fundraiser={fundraiser}
      releaseEpoch={releaseEpoch}
      raised_amount={amount}
      raised_usd_amount={usd_amount}
      />
  ));

  return (
    <Card sx={{ height: "100%" }}>
    <SoftBox pt={2} px={2}>
      <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
      Project Currencies
      </SoftTypography>
    </SoftBox>
    <SoftBox p={2}>
      <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        <Grid container spacing={3}>
              {renderCurrency}
        </Grid>  
      </SoftBox>
    </SoftBox>
    <SoftBox pb={2} px={2}>
        {
        walletAddress == fundraiser && (
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <SoftInput
                        placeholder={"Add new currency address"}
                        onInput={e=>setNewCurrency(
                            <AddCurrency
                            projectAddress={projectAddress}
                            currencyAddress={e.target.value}                        
                        />
                        )}
                    />
                </Grid>
                <Grid item xs={4}>
                    {newCurrency} 
                </Grid>    
            </Grid>
        )
        }
    </SoftBox>
  </Card>

  );
}

ProjectCurrency.propTypes = {
  fundraiser: PropTypes.string,
  releaseEpoch: PropTypes.number,
  projectAddress: PropTypes.string,
  data: PropTypes.array,
}

export default ProjectCurrency;
