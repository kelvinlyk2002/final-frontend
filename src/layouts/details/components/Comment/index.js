// library components
import PropTypes from "prop-types";
import { useAddress } from "@thirdweb-dev/react";

// theme components
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// layout components
import CommentButtons from "../CommentButtons"

function Comment({ comment_id, fundraiserOnly, fundraiser, commentor, comment, time }) {
  const address = useAddress();

  let displayDate = new Date(0);
  displayDate.setUTCMilliseconds(Date.parse(time));

  // return null if fundraiser only and fundraiser is not commentor
  if(fundraiserOnly && (fundraiser != commentor)) {
    return null;
  }

  return (
    <SoftBox key={commentor} component="li" py={1} mb={1}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center">
      <Grid container spacing={1}>
        <Grid item xs={12}>
        <SoftBox display="flex" alignItems="center">
          <SoftBox display="flex" flexDirection="column">
          <SoftTypography variant="body2" color="text" display="block">
              {comment}
            </SoftTypography>
            <SoftTypography variant="caption" color="secondary" fontWeight="medium" display="block">
              Commentor: {commentor} {fundraiser == commentor && (" (Fundraiser)")}
            </SoftTypography>
            <SoftTypography variant="caption" color="secondary" fontWeight="medium" display="block">
              Commented on: {displayDate.toString()}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
          {address == commentor && (
            <CommentButtons
              comment_id={comment_id}
              comment={comment}
            />
          )}
        </Grid>
      </Grid>
      </SoftBox>
    </SoftBox>
  );
}

Comment.propTypes = {
  fundraiserOnly: PropTypes.bool.isRequired,
  fundraiser: PropTypes.string.isRequired,
  commentor: PropTypes.string.isRequired,
  comment: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  comment_id: PropTypes.number.isRequired,
};

export default Comment;
