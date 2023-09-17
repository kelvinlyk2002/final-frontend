// library components
import PropTypes from "prop-types";
import { useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import axios from 'axios';

// theme components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// layout components
import Comment from "../Comment";

// data
import { contractData } from "components/ContractInteractionButtons";

function Comments({projectAddress, fundraiser, data}) {
  const [fundraiserOnly, setFundraiserOnly] = useState(false);
  const renderComments = data.toReversed().map(({ id, user, details, created_at}) => (
    <Comment
      fundraiser={fundraiser}
      comment_id={id}
      key={id}
      commentor={user['address']}
      comment={details}
      time={created_at}
      fundraiserOnly={fundraiserOnly}
  />
  ));

  const [comment, setComment] = useState('');
  
  const address = useAddress();

  const handleFundraiserOnlyToggle = () => {
    setFundraiserOnly(!fundraiserOnly);
  }

  const handleCommentInput = (event) => {
    setComment(event.target.value);
  }

  const handleCommentSubmit = async () => {
    const formData = new FormData();
    formData.append('user', address);
    formData.append('projectAddress', projectAddress);
    try {
      // append transaction hash from onchain response to the form data
      formData.append('details', comment);
      
      // Send POST request to the API endpoint using Axios
      const url = `${contractData['offchainBackendURI']}api/add_project_comment`
      const response = await axios.post(url, formData);

      // Check the response status
      if (response.status === 201) {
        // Successful response handling
        console.log('Form data submitted successfully');
        // Perform any necessary actions after successful submission
      } else {
        // Error handling
        console.error('Error submitting form data');
      }
    } catch (error) {
      // Network or other error handling
      console.error('An error occurred:', error);
    }
    window.location.reload();
  }
  
  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Comments
        </SoftTypography>
        <SoftBox display="flex" alignItems="flex-start">
          <FormGroup>
      <FormControlLabel control={<Switch onChange={handleFundraiserOnlyToggle} />} label="Show fundraiser only" />
    </FormGroup>
        </SoftBox>
      </SoftBox>
      <SoftBox px={3} py={3}>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <SoftInput
              multiline 
              row={4}
              placeholder="Leave a comment"
              value={comment}
              onInput={handleCommentInput}
              />
          </Grid>
          <Grid item xs={2}>
            {address && (
              <SoftButton color="primary" onClick={handleCommentSubmit} fullWidth>Submit</SoftButton>
            )}
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox pt={3} px={2}>
        <SoftBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
         {renderComments}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

Comments.defaultProps = {
  data: []
};

Comments.propTypes = {
  fundraiser:PropTypes.string,
  data: PropTypes.array,
  projectAddress: PropTypes.string,
}

export default Comments;
