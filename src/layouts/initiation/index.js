// library components
import { useState } from "react";
import { DropzoneArea } from 'material-ui-dropzone'
import { useChain } from "@thirdweb-dev/react";

// theme components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// layout components
import BasicLayout from "./components/BasicLayout";
import InitiateProject from "components/ContractInteractionButtons/InitiateProject";

// data
import { contractData } from "components/ContractInteractionButtons";

// image
import curved6 from "assets/images/curved-images/curved14.jpg";
 
function Initiation() {
  // default variables
  const currency = contractData["currency"]
  const categories = contractData["categories"]

  // stateful and local form variables
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState(Object.keys(currency)[0]);
  const [customCurrency, setCustomCurrency]= useState('');
  const [category, setCategory] = useState(categories[0]);
  const [communityOversight, setCommunityOversight] = useState(false);
  const [delay, setDelay] = useState(false);
  const [releaseDate, setReleaseDate] = useState('');
  const [releaseTime, setReleaseTime] = useState('');
  const [formObject, setFormObject] = useState(new FormData());

  // confirmation modal
  const [modalOpen, setModalOpen] = useState(false);
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

  // thirdweb chain detection
  const chain = useChain();

  const toggleModal = () => {
    const localFormData = new FormData();

    localFormData.append('title', title);
    localFormData.append('description', description);
    if(defaultCurrency == 'Custom') {
      localFormData.append('currency', customCurrency);
    } else {
      localFormData.append('currency', currency[defaultCurrency]);
    }
    localFormData.append('chain', chain.name);
    localFormData.append('chainid', chain.chainId);
    localFormData.append('category', category);
    localFormData.append('communityOversight', communityOversight);
    if (delay) {
      localFormData.append('releaseEpoch', Date.parse(releaseDate + " " + releaseTime) / 1000);
    } else {
      localFormData.append('releaseEpoch', Math.floor(Date.now() / 1000));
    }
    for (const image of images) {
      localFormData.append('images', image);
    }

    setFormObject(localFormData);
    setModalOpen(!modalOpen);
  }
  
  // event handlers
  const handleDropzoneChange = (files) => {
    setImages(files);
  };
  const handleSetCommunityOversight = () => setCommunityOversight(!communityOversight);
  const handleSetDelay = () => setDelay(!delay);

  const epochToUTC = (epoch) => {
    let date = new Date(epoch * 1000);
    return date.toString();
  }

  return (
    <BasicLayout
      title="New Project"
      description="A low cost, trustless, borderless fundraiser initiated by you."
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Project Details
          </SoftTypography>
        </SoftBox>
        
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <SoftInput value={title} onInput={e=>setTitle(e.target.value)} placeholder="Project Title" />
            </SoftBox>
            <SoftBox mb={2}>
            <DropzoneArea
              filesLimit={20}
              acceptedFiles={['image/*']}
              maxFileSize={10000000}
              showFileNames={true}      
              dropzoneText={"Drag and drop or click here to upload image"} 
              onChange={handleDropzoneChange}
              />
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                type="text"
                value={description} 
                placeholder="Project Description" 
                multiline 
                rows={10}
                onInput={e=>setDescription(e.target.value)}
              />
            </SoftBox>

            <SoftBox mb={2}>
            <Autocomplete
              value={defaultCurrency}
              onChange={(event, selectedCurrency) => {
                setDefaultCurrency(selectedCurrency);
              }}
              id="currency"
              options={Object.keys(currency)}
              renderInput={(params) => <TextField {...params} label="Project Currency" />}
            />

            </SoftBox>
            {defaultCurrency == 'Custom' && (
              <SoftBox mb={2}>
                <SoftInput onInput={e=>setCustomCurrency(e.target.value)} placeholder="Enter token address" />
              </SoftBox>
            )}
            <SoftBox mb={2}>
            <Autocomplete
              value={category}
              onChange={(event, selectedCategory) => {
                setCategory(selectedCategory);
              }}
              id="category"
              options={categories}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />
            </SoftBox>
            

            <SoftBox display="flex" alignItems="center" mb={2}>
              <Checkbox checked={communityOversight} onChange={handleSetCommunityOversight} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                Community Oversight
              </SoftTypography>
            </SoftBox>

            <SoftBox display="flex" alignItems="center" mb={2}>
              <Checkbox checked={delay} onChange={handleSetDelay} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                Voluntary funds withdrawal delay
              </SoftTypography>
            </SoftBox>

            {delay ? (
              <SoftBox display="flex" justifyContent='flex-start' alignItems="center" mb={2}>
                <SoftBox mx={1}>
                <SoftTypography variant="button" noWrap fontWeight="regular" mr="auto">
                  Disable withdrawal until:
                </SoftTypography>
                </SoftBox>
                <SoftBox mx={1}>
                  <SoftInput type="date" onChange={e=>setReleaseDate(e.target.value)}/>
                </SoftBox>
                <SoftBox mx={1}>
                  <SoftInput type="time" onChange={e=>setReleaseTime(e.target.value)}/>
                </SoftBox>
              </SoftBox>
            ): null}
              
            <SoftBox mt={4} mb={1}>
              <SoftButton onClick={toggleModal} variant="gradient" color="dark" fullWidth value="submit">
                Launch Project
              </SoftButton>
              <Modal
                open={modalOpen}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <SoftBox sx={modalStyle}>
                  <SoftTypography variant="h4" component="h2">
                    Review Project
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    Please review the below data as they would be deployed on-chain and unchangeable.
                  </SoftTypography>
                  <SoftBox my={2}>
                  <SoftTypography variant="body2">
                      Network: {chain ? chain.name : ""}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Currency Selected: {defaultCurrency}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Currency Address: {formObject.get("currency")}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Community Oversight: {formObject.get("communityOversight")}
                    </SoftTypography>
                    <SoftTypography variant="body2">
                      Withdrawal Available After: {epochToUTC(formObject.get("releaseEpoch"))}
                    </SoftTypography>
                  </SoftBox>
                  <SoftTypography variant="body2">
                    Other details are stored off-chain and can be edited after deployment.
                  </SoftTypography>
                  <SoftBox mt={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <InitiateProject
                          formData={formObject}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <SoftButton onClick={toggleModal} color="error" variant="gradient" fullWidth>
                          Cancel
                        </SoftButton>
                      </Grid>
                    </Grid>
                    </SoftBox>
                </SoftBox>
              </Modal>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default Initiation;
