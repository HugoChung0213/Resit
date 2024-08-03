// src/utils/uploadToIPFS.js
import axios from 'axios';

const pinataApiKey = '67e11d708b37dc97b3a1';
const pinataSecretApiKey = 'eeb81afe8d013e3bce5458e2b0f6b2939ab167b0107cb6a9db3d1e98c65ce584';

const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
  });

  formData.append('pinataMetadata', metadata);

  try {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });

    return res.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

export default uploadToIPFS;
