import { IPicture } from 'music-metadata';

type Metadata = {
  cover: IPicture | null;
  title?: string;
  artist?: string;
  album?: string;
};

export default Metadata;
