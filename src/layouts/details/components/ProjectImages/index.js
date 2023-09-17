// library components
import PropTypes from "prop-types";
import Carousel from "react-material-ui-carousel";

// theme components
import SoftBox from "components/SoftBox";

function ProjectImages({imageList}) {
    const renderImages = imageList.map(( imageURL ) => (
        <SoftBox 
            key={imageURL}
            display="flex"
            alignItems="center"
            position="relative"
            minHeight="37.5rem"
            borderRadius="xl"
            sx={{
                backgroundImage: `url(${imageURL})`,
                backgroundSize: "contain",
                backgroundPosition: "100%",
                overflow: "hidden",
            }}
        />
  ));
    
    return (
        <Carousel>
            {renderImages}
        </Carousel>
    );
  }
  
  ProjectImages.propTypes = {
    imageList: PropTypes.array,
  };
  
  export default ProjectImages;
  