// library components
import axios from 'axios';
import {useState, useEffect} from 'react';
import { useChain } from '@thirdweb-dev/react';

// theme components
import SoftTypography from "components/SoftTypography";
import SoftButton from 'components/SoftButton';

// layout components
import ListView from "templates/line-view"

// data
import { contractData } from 'components/ContractInteractionButtons';

function VotingHistory() {
  // read GET params
  const queryParams = new URLSearchParams(window.location.search);
  const proposalId = queryParams.get('proposalId');
  const chain = useChain();

  function hshToExplorer(hsh){
    return (
      <SoftButton color="primary" href={contractData['etherscanBaseURI'][chain.name] + hsh} fullWidth>
        View Txn
      </SoftButton>
    )
  }

  const rightTrimZero = (amountString) => {
    if (amountString.slice(amountString.length - 1) != "0" && amountString.slice(amountString.length - 1) != ".") {
      return amountString.substring(0, amountString.length);
    } else {
      return rightTrimZero(amountString.substring(0, amountString.length - 1))
    }
  }

  const [rows, setRows] = useState([]);
  const col = [
    { name: "timestamp", align: "center" },
    { name: "voter", align: "center" },
    { name: "weight", align: "center" },
    { name: "vote", align: "center"},
    { name: "onchain", align: "center" },
  ]

  useEffect(() => {
    fetchData();
  }, [chain]);

  const fetchData = async () => {
    try {
      const url = `${contractData['offchainBackendURI']}api/get_votes/${proposalId}/`;
      const response = await axios.get(url);
      if(response.status == 200 && response.data['response'] == 1 && chain) {
        let votes = []        
        for(const vote of response.data['data']) {
          // put into rendering array
          votes = [...votes, 
            {
              timestamp: vote["created_at"].substring(0, 10) + " " + vote["created_at"].substring(11, 16),
              voter: vote["voter"]["address"],
              vote: vote['vote'] ? 
              <SoftTypography variant="body2" fontWeight="medium" color="success">YAY</SoftTypography> : <SoftTypography variant="body2" fontWeight="medium" color="error">NAY</SoftTypography>,
              weight: rightTrimZero(vote["weight"]),
              onchain: hshToExplorer(vote["hsh"]),
            }
          ]
        }
        setRows(votes);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ListView
      tableTitle={"Voting History"}
      columns={col}
      rows={rows}
    >
    </ListView>
  );
}

export default VotingHistory;
