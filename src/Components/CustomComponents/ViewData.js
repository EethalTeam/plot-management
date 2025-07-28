import { Modal, Box, Typography, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

const tryParseJSON = (value) => {
  try {
    const corrected = value
      .replace(/([{,])\s*([a-zA-Z0-9_ ]+):/g, '$1"$2":')
      .replace(/'/g, '"');
    return JSON.parse(corrected);
  } catch {
    return null;
  }
};

const renderValue = (value, level = 0) => {
  if (typeof value === 'string' && (value.includes('{') || value.includes('['))) {
    const parsed = tryParseJSON(value);
    if (parsed) return renderValue(parsed, level + 1);
  }

  if (Array.isArray(value)) {
    return (
      <Box pl={2}>
        {value.map((item, index) => (
          <Box
            key={index}
            mb={1}
            pl={2}
            sx={{
              borderLeft: '2px solid #eee',
              ml: 1,
              mb: 3,
              backgroundColor: level === 1 ? '#f6f3f3' : level === 2 ? '#fff' : '#eae7e7',
              borderRadius: '3px',
              p: 1
            }}
          >
            {typeof item === 'object' && item !== null ? (
              Object.entries(item).map(([k, v]) => (
                <Box key={k} display="flex" gap={1} mb={0.5}>
                  <Typography variant="body2" fontWeight="bold">{k}:</Typography>
                  {renderValue(v, level + 1)}
                </Box>
              ))
            ) : (
              <Typography variant="body2">- {String(item)}</Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <Box pl={2}>
        {Object.entries(value).map(([k, v]) => (
          <Box key={k} display="flex" gap={1} mb={0.5}>
            <Typography variant="body2" fontWeight="bold">{k}:</Typography>
            {renderValue(v, level + 1)}
          </Box>
        ))}
      </Box>
    );
  }

  return <Typography variant="body2">{String(value)}</Typography>;
};

const ViewDataModal = ({ open, onClose, data }) => {
  if (!data || typeof data !== 'object') return null;

  return (
    <>
      <style>{bounceAnimation}</style>
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Fade in={open}>
          <Box sx={{ ...style, p: 0, display: 'flex', flexDirection: 'column' }}>
            
            {/* Sticky Header */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 2,
                bgcolor: 'white',
                borderBottom: '1px solid #eee',
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#eae7e7'
              }}
            >
              <Typography variant="h6"><b>View Data</b></Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ p: 3, overflowY: 'auto' }}>
              {Object.entries(data).map(([key, value]) => (
                <Box
                  key={key}
                  mb={2}
                  display="flex"
                  gap={1}
                  alignItems="flex-start"
                  sx={{ borderBottom: '1px solid #eee', pb: 1 }}
                >
                  <Typography variant="subtitle2" sx={{ minWidth: '25%' }}>
                    <strong>{key}</strong>
                  </Typography>
                  <Box flex={1}>{renderValue(value)}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ViewDataModal;
