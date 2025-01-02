import axios from 'axios';

let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

async function fetchStorageToken() {
  try {
    const response = await axios.post(
      `${process.env.OS_IDENTITY_ENDPOINT}`,
      {
        auth: {
          identity: {
            methods: ['password'],
            password: {
              user: {
                id: process.env.OS_USER_ID,
                password: process.env.OS_PASSWORD
              }
            }
          },
          scope: {
            project: {
              id: process.env.OS_TENANTID
            }
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const token = response.headers['x-subject-token'];
    const tokenLife = 60 * 60 * 1000; // Assume a 1-hour token lifetime
    
    if (!token) {
      throw new Error('Token not received');
    }

    cachedToken = token;
    tokenExpiry = new Date(Date.now() + tokenLife);

    return token;
  } catch (error) {
    console.error('Failed to issue token:', error);
    throw error;
  }
}

async function getCachedStorageToken(): Promise<string> {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }
  return fetchStorageToken();
}

export async function generateSignedUrl(containerName: string, objectName: string) {
  try {
    const token = await getCachedStorageToken();
    
    const fullPath = `${process.env.OS_STORAGE_ENDPOINT}/${containerName}/${objectName}`;
    console.log('Request URL:', fullPath);

    const response = await axios.head(fullPath, {
      headers: {
        'X-Auth-Token': token,
        'X-Debug-Token': token.substring(0, 10) + '...'
      }
    });

    if (response.status === 200) {
      console.log('Object found, returning URL.');
      return fullPath;
    }

    throw new Error('Object not found');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Detailed error info:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        config: error.config && {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        }
      });
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
