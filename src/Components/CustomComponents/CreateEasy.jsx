import { Modal, Box, Typography, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PathJson } from '../componentPath'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) scale(1)',
  bgcolor: 'white',
  borderRadius: '5px',
  boxShadow: 24,
  width: '90%',
  maxWidth: 1000,
  maxHeight: '90vh',
  overflow: 'hidden', // Important!
  animation: 'bounceIn 0.5s ease',
};

const bounceAnimation = `
@keyframes bounceIn {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 1;
  }
  80% {
    transform: translate(-50%, -50%) scale(0.95);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
`;

const CreateEasy = ({ open, onClose, FormID,FormName,...props }) => {

    const DynamicComponent = PathJson[FormID];

  return (
    <>
      <style>{bounceAnimation}</style>
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Fade in={open}>
          <Box sx={{ ...style, p: 0, display: 'flex', flexDirection: 'column' }}>
          
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1500,
                bgcolor: 'white',
                borderBottom: '1px solid #eee',
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#eae7e7'
              }}
            >
              <Typography variant="h6"><b>Add {FormName}</b></Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
           {/* Scrollable Content */}
            <Box sx={{ p: 3, overflowY: 'auto' }}>
             <DynamicComponent alert={props.alert} UserPermissions={props.UserPermissions}  setSelectedMenu={props.setSelectedMenu} setFormID={props.setFormID} CreateEasy={true}/>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default CreateEasy;
