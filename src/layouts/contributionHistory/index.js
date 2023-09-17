// library components
import axios from 'axios';
import {useState, useEffect} from 'react';
import { useChain } from '@thirdweb-dev/react';

// theme components
import SoftButton from 'components/SoftButton';

// layout components
import ListView from "templates/line-view"

// data
import { contractData } from 'components/ContractInteractionButtons';

function ContributionHistory() {
  // read GET params
  const queryParams = new URLSearchParams(window.location.search);
  const projectAddress = queryParams.get('projectAddress');
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
    { name: "contributor", align: "center" },
    { name: "currency", align: "center" },
    { name: "amount", align: "center" },
    { name: "usd_amount", align: "center" },
    { name: "onchain", align: "center" },
  ]

  useEffect(() => {
    fetchData();
  }, [chain]);

  const fetchData = async () => {
    try {
      const url = `${contractData['offchainBackendURI']}api/get_project_data/${projectAddress}/`;
      const response = await axios.get(url);
      if(response.status == 200 && response.data['response'] == 1 && chain) {
        let contributions = []
        for(const contribution of response.data['data']['contribution']) {
          // parsing currency names
          const currency = `${contribution["currency"]["name"]} (${contribution["currency"]["address"].substring(0,6)}***${contribution["currency"]["address"].substring(38)})`
          // put into contributions array
          contributions = [...contributions, 
            {
              timestamp: contribution["created_at"].substring(0, 10) + " " + contribution["created_at"].substring(11, 16),
              contributor: contribution["user"]["address"],
              currency: currency,
              amount: rightTrimZero(contribution["amount"]),
              usd_amount: contribution["usd_amount"],
              onchain: hshToExplorer(contribution["hsh"]),
            }
          ]
        }
        setRows(contributions);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ListView
      tableTitle={"Contribution History"}
      columns={col}
      rows={rows}
    >
    </ListView>
  );
}

export default ContributionHistory;
