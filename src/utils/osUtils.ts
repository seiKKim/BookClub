import axios from "axios";

const OS_TENANTID = process.env.OS_TENANTID; // Tenant ID
const OS_USERNAME = process.env.OS_USERNAME; // Object Storage username
const OS_PASSWORD = process.env.OS_PASSWORD; // Object Storage password

let token: string | undefined;
let tokenExpiresTime: string | undefined;

// 오브젝트 스토리지 토큰 발급
export const getOSAccessToken = async (): Promise<{ token: string; tokenExpiresTime: string }> => {
  const tokenURL = "https://api-identity.infrastructure.cloud.toast.com/v2.0/tokens";
  const tokenHeader = {
    headers: { "Content-Type": "application/json" },
  };
  const body = {
    auth: {
      tenantId: OS_TENANTID,
      passwordCredentials: {
        username: OS_USERNAME,
        password: OS_PASSWORD,
      },
    },
  };

  try {
    const result = await axios.post(tokenURL, body, tokenHeader);
    token = result.data.access.token.id;
    tokenExpiresTime = result.data.access.token.expires;

    // token과 tokenExpiresTime이 undefined가 아닌지 확인
    if (!token || !tokenExpiresTime) {
      throw new Error("Token or expiration time is undefined.");
    }

    return { token, tokenExpiresTime };
  } catch (error) {
    // error를 적절한 타입으로 단언
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get access token: ${error.response?.data?.error || error.message}`);
    } else {
      throw new Error(`Failed to get access token: ${String(error)}`);
    }
  }
};

// 오브젝트 업로드 시 헤더 생성
export const putUploadHeader = (token: string, file_type: string) => ({
  headers: {
    "X-Auth-Token": token,
    "Content-Type": file_type,
  },
});

// 오브젝트 삭제 시 헤더 생성
export const putDeleteHeader = (token: string) => ({
  headers: { "X-Auth-Token": token },
});

// 토큰 만료 시 재발급
export const getValidOSAccessToken = async (): Promise<string> => {
  if (!token || !tokenExpiresTime || new Date(tokenExpiresTime) <= new Date()) {
    const osTokenData = await getOSAccessToken();
    token = osTokenData.token;
    tokenExpiresTime = osTokenData.tokenExpiresTime;
  }

  // token이 undefined가 아닌지 확인 후 반환
  if (!token) {
    throw new Error("Token is undefined.");
  }

  return token;
};
