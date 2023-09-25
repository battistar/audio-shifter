import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploaderProps {
  onUpload: (file: File) => void;
}

const Uploader = ({ onUpload }: UploaderProps): JSX.Element => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles[0]);
    },
    [onUpload]
  );

  const { isDragAccept, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: { 'audio/mp3': ['.mp3'], 'audio/wav': ['.wav'] },
    onDrop,
  });
  const { onClick, ...rootProps } = getRootProps();
  const inputProps = getInputProps();

  return (
    <Box
      {...rootProps}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: '2px',
        borderStyle: isDragAccept ? 'solid' : 'dashed',
        borderBlockColor: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900],
        borderRadius: 4,
        p: 2,
      }}
    >
      <input {...inputProps} />
      <Stack
        gap={2}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography>Drag & drop to upload file (.mp3, .wav)</Typography>
        <Divider sx={{ width: '50%' }}>OR</Divider>
        <Button variant="contained" onClick={onClick}>
          Browse file
        </Button>
      </Stack>
    </Box>
  );
};

export default Uploader;
