import { Admin } from './../types';
import fs from 'fs';
import path from 'path';

// function to encode file data to base64 encoded string
function base64_encode(file: string) {
  // read binary data
  return `data:image/png;base64,${fs.readFileSync(
    path.join(__dirname, file),
    'base64'
  )}`;
}

const admins: Admin[] = [
  {
    name: 'Evert',
    email: 'evert@test.nl',
    hash: '$2b$10$9FEVf64GA8eUpdMdntTUje37n9nJpbzJ6Ka8is2UlALFCX6w3ZhW6',
    image: base64_encode('./images/evert.png'),
  },
  {
    name: 'Evert thuis',
    email: 'evert@home.nl',
    hash: '$2b$10$2k7N1.ra3W07SuPt1hXgluIwDI/fS83/LPymfng4jHwEflRY.Cmw6',
    image: base64_encode('./images/evert.png'),
  },
  {
    name: 'Admin',
    email: 'admin@admin.nl',
    hash: '$2b$10$WlGCrc25CU6MFts3w1OukulByKxlZEPV74O/yQLy9F39tPsoM9/mG',
    image: base64_encode('./images/lego.jpg'),
  },
];

export default admins;
