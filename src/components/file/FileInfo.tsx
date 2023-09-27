import { Box, IconButton, Stack, Tooltip, Typography, styled } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import Metadata from 'models/Metadata';
import { useCallback, useMemo } from 'react';
import noCover from 'assets/images/no-cover.png';

const Cover = styled('img')({
  width: 150,
  height: 150,
  objectFit: 'cover',
});

interface FileInfoProps {
  metadata: Metadata;
  deleteDisabled?: boolean;
  onDeleteClick?: () => void;
}

const FileInfo = ({ metadata, onDeleteClick, deleteDisabled = false }: FileInfoProps): JSX.Element => {
  const handleClick = useCallback((): void => {
    if (onDeleteClick) {
      onDeleteClick();
    }
  }, [onDeleteClick]);

  const cover = useMemo(() => {
    if (metadata.cover) {
      return `data:${metadata.cover.format};base64,${metadata.cover.data.toString('base64')}`;
    }

    return null;
  }, [metadata.cover]);

  return (
    <Stack direction="row" gap={2}>
      <Box sx={{ width: 150, aspectRatio: '1/1' }}>
        <Cover src={cover ?? noCover} alt="audio" />
      </Box>
      <Stack sx={{ flex: 1 }}>
        <Typography variant="h4" component="div">
          {metadata.title ?? 'Unknown'}
        </Typography>
        <Typography component="div">{metadata.artist ?? 'Unknown'}</Typography>
        <Typography component="div">{metadata.album ?? 'Unknown'}</Typography>
      </Stack>
      <Tooltip title="Remove file">
        <IconButton onClick={handleClick} disabled={deleteDisabled} sx={{ alignSelf: 'center' }}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default FileInfo;
