// library components
import PropTypes from "prop-types";
import { useState } from "react";
import axios from 'axios';

// thems components
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";

// data
import { contractData } from "components/ContractInteractionButtons";

function CommentButtons({ comment_id, comment }) {
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
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newComment, setNewComment] = useState(comment);

    const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
    }

    const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
    }

    const editComment = async () => {
        try {
          // Send POST request to the API endpoint using Axios
          const url = `${contractData['offchainBackendURI']}api/update_comment/${comment_id}/`
          const response = await axios.put(url, {'details': newComment});
    
          // Check the response status
          if (response.status === 200) {
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


    const deleteComment = async () => {
        try {
          // Send POST request to the API endpoint using Axios
          const url = `${contractData['offchainBackendURI']}api/delete_comment/${comment_id}/`
          const response = await axios.delete(url);
    
          // Check the response status
          if (response.status === 204) {
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
    <SoftBox>
        <SoftButton variant="text" color="dark" onClick={toggleEditModal}>
            <Icon>edit</Icon>&nbsp;edit
        </SoftButton>
        <SoftButton variant="text" color="error" onClick={toggleDeleteModal}>
            <Icon>delete</Icon>&nbsp;delete
        </SoftButton>
        {/* Edit modal */}
        <Modal
            open={editModalOpen}
            onClose={toggleEditModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <SoftBox sx={modalStyle}>
                <SoftTypography variant="h4" component="h2">
                    Edit
                </SoftTypography>
                <SoftBox my={2}>
                    <SoftInput value={newComment} onInput={e=>setNewComment(e.target.value)} />
                </SoftBox>
                <SoftBox mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <SoftButton onClick={editComment} color="primary" variant="gradient" fullWidth>
                                Edit
                            </SoftButton>
                        </Grid>
                        <Grid item xs={6}>
                            <SoftButton onClick={toggleEditModal} variant="gradient" fullWidth>
                                Cancel
                            </SoftButton>
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </Modal>
        {/* Delete modal */}
        <Modal
            open={deleteModalOpen}
            onClose={toggleDeleteModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <SoftBox sx={modalStyle}>
            <SoftTypography variant="h4" component="h2">
                Delete
            </SoftTypography>
            <SoftTypography variant="body2">
                Are you sure to delete this comment?
            </SoftTypography>
            <SoftBox my={2}>
                <SoftTypography variant="body2">
                    {comment}
                </SoftTypography>
            </SoftBox>
            <SoftBox mt={2}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <SoftButton onClick={deleteComment} color="error" variant="gradient" fullWidth>
                        Delete
                    </SoftButton>
                    </Grid>
                    <Grid item xs={6}>
                    <SoftButton onClick={toggleDeleteModal} variant="gradient" fullWidth>
                        Cancel
                    </SoftButton>
                    </Grid>
                </Grid>
            </SoftBox>
        </SoftBox>
        </Modal>
    </SoftBox>
    
  );
}

CommentButtons.propTypes = {
    comment_id: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
};

export default CommentButtons;
