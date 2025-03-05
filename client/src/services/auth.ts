import moment from "moment";
import { User } from "../interfaces/user";
import axios, { AxiosError } from "axios";
import { Token } from "../interfaces/auth";
import { SignUpData } from "../pages/SignUp";

const AUTH_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

enum LocalStorageNames {
  AccessToken = "ACCESS_TOKEN",
  RefreshToken = "REFRESH_TOKEN",
}

export const getToken = async () =>
  getAuthTokenFromStorage() ?? (await generateNewToken());

const getAuthTokenFromStorage = () => {
  try {
    const accessToken = JSON.parse(
      localStorage.getItem(LocalStorageNames.AccessToken) ?? ""
    ) as Token;
    if (verifyAuthTokenExpireDate(accessToken?.expireDate)) {
      return accessToken.token;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error, "Failed to get access token from storage");
  }
};

const generateNewToken = async () => {
  try {
    const refreshToken = JSON.parse(
      localStorage.getItem(LocalStorageNames.RefreshToken) ?? ""
    ) as Token;

    if (!verifyAuthTokenExpireDate(refreshToken?.expireDate)) {
      throw new Error("Refresh token is expired");
    }

    const token = await initAuthFromRefreshToken(refreshToken.token);

    return token;
  } catch (err) {
    console.log(err, "Failed to generate new token");

    return null;
  }
};

const verifyAuthTokenExpireDate = (tokenExpireDate: Date) =>
  tokenExpireDate &&
  moment(tokenExpireDate).isAfter(moment().add(1, "minutes"));

const initAuthFromRefreshToken = async (refreshToken: string) => {
  try {
    const { accessToken, refreshToken: newRefreshToken } = (
      await axios.post<{ accessToken: Token; refreshToken: Token }>(
        `${AUTH_BASE_URL}/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )
    ).data;

    localStorage.setItem(
      LocalStorageNames.AccessToken,
      JSON.stringify(accessToken)
    );

    localStorage.setItem(
      LocalStorageNames.RefreshToken,
      JSON.stringify(newRefreshToken)
    );

    return accessToken.token;
  } catch (err) {
    console.log(err, "Failed to init auth from refresh token");
  }
};

export const authLogout = async () => {
  try {
    const { token } = JSON.parse(
      localStorage.getItem(LocalStorageNames.RefreshToken) ?? ""
    ) as Token;

    await axios.post(
      `${AUTH_BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem(LocalStorageNames.AccessToken);
    localStorage.removeItem(LocalStorageNames.RefreshToken);
  } catch (err) {
    console.log(err, "Failed to logout");
    throw err;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const { accessToken, refreshToken, user } = (
      await axios.post<{ accessToken: Token; refreshToken: Token; user: User }>(
        `${AUTH_BASE_URL}/login`,
        {
          username,
          password,
        }
      )
    ).data;

    localStorage.setItem(
      LocalStorageNames.AccessToken,
      JSON.stringify({ accessToken })
    );

    localStorage.setItem(
      LocalStorageNames.RefreshToken,
      JSON.stringify(refreshToken)
    );

    return user;
  } catch (err) {
    console.log(err, "Failed to login");
    throw err;
  }
};

export const googleLogin = async (credential?: string) => {
  try {
    const { accessToken, refreshToken, user } = (
      await axios.post<{ accessToken: Token; refreshToken: Token; user: User }>(
        `${AUTH_BASE_URL}/google-login`,
        {
          credential,
        }
      )
    ).data;

    localStorage.setItem(
      LocalStorageNames.AccessToken,
      JSON.stringify({ accessToken })
    );

    localStorage.setItem(
      LocalStorageNames.RefreshToken,
      JSON.stringify(refreshToken)
    );

    return user;
  } catch (err) {
    console.log(err, "Failed to google login");
    throw err;
  }
};

export const signup = async (userData: SignUpData) => {
  try {
    const formData = new FormData();
    const { photo, ...userInfo } = userData;

    if (photo) {
      formData.append("file", photo[0]);
    }

    formData.append("user", JSON.stringify(userInfo));

    const { accessToken, refreshToken, user } = (
      await axios.post<{ accessToken: Token; refreshToken: Token; user: User }>(
        `${AUTH_BASE_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "image/jpeg",
          },
        }
      )
    ).data;

    localStorage.setItem(
      LocalStorageNames.AccessToken,
      JSON.stringify({ accessToken })
    );

    localStorage.setItem(
      LocalStorageNames.RefreshToken,
      JSON.stringify(refreshToken)
    );

    return user;
  } catch (err) {
    if (
      err instanceof AxiosError &&
      err.response?.status === 400 &&
      err.response.data.userExist
    ) {
      throw new Error(err.message);
    } else {
      throw new Error("Failed to signup user, please try again.");
    }
  }
};
