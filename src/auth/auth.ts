import {
  AuthorizationRequest,
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler,
  FetchRequestor,
  GRANT_TYPE_AUTHORIZATION_CODE,
  GRANT_TYPE_REFRESH_TOKEN,
  RevokeTokenRequest,
  StringMap,
  TokenRequest,
  TokenResponse,
} from '@openid/appauth';
import { REFETCH_ALL } from '../eventNames';
import { authVar } from '../apollo/vars';
import { CustomAuthHandler } from './customAuthRequestHandler';

const clientId = '48d3935dab0217fb7eaa593fc21805ead6699ca5a6766600218ddb27522ab38f';
const redirectUri = 'https://deface-37.github.io/Gitlab-Issues-Time-Manager/callback';
const scope = 'api';

// TODO: добавить смену базового url
const baseURL = 'https://gitlab.com';

const configuration = new AuthorizationServiceConfiguration({
  authorization_endpoint: new URL('/oauth/authorize', baseURL).href,
  token_endpoint: new URL('/oauth/token', baseURL).href,
  revocation_endpoint: new URL('/oauth/revoke', baseURL).href,
});

const authorizationHandler = new CustomAuthHandler();
const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());

let tokenResponse: TokenResponse | undefined;
let refreshToken: string | undefined;

interface StoredAuth {
  refreshToken?: string;
}

// Инициализация
const json = localStorage.getItem('auth');
if (json) {
  const storedAuth = JSON.parse(json) as StoredAuth;
  refreshToken = storedAuth.refreshToken;

  requestRefreshToken()
    .then(() => {
      document.dispatchEvent(new CustomEvent(REFETCH_ALL));
    })
    .catch((error) => {
      console.error('Не удалось обновить токен', error);
    });
}

export default {
  async makeAuthRequest(): Promise<TokenResponse> {
    const request = new AuthorizationRequest(
      {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
        scope: scope,
        state: undefined,
      },
      undefined,
      true
    );

    console.log('Делаем авторизационный запрос ', configuration, request);

    authorizationHandler.performAuthorizationRequest(configuration, request);
    const res = await authorizationHandler.authComplete;

    if (!res) throw new Error('Не удалось произвести аутентификацию');

    const { response, error } = res;
    if (!response) throw new Error('Не удалось произвести аутентификацию');
    console.log('Авторизация завершена', response, error);

    const codeVerifier = request.internal?.code_verifier;
    if (!codeVerifier) throw new Error('Не передан code_verifier');

    return makeTokenRequest(response.code, codeVerifier);
  },

  revokeToken() {
    const token = tokenResponse?.accessToken;
    if (!token) {
      console.error('Вы не залогинены');
      return;
    }

    const request = new RevokeTokenRequest({
      client_id: clientId,
      token,
    });

    tokenHandler.performRevokeTokenRequest(configuration, request).then((success) => {
      if (success) {
        tokenResponse = undefined;
        refreshToken = undefined;

        localStorage.removeItem('auth');
        authVar({ isLoggedIn: false });

        console.log('Сбросили токен');
      } else {
        console.log('Не удалось сбросить токен');
      }
    });
  },
};

function makeTokenRequest(code: string, codeVerifier: string): Promise<TokenResponse> {
  const extras: StringMap = { code_verifier: codeVerifier };

  const request = new TokenRequest({
    client_id: clientId,
    grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
    redirect_uri: redirectUri,
    code,
    extras,
  });

  console.log('Делаем запрос за токеном', request);

  return tokenHandler
    .performTokenRequest(configuration, request)
    .then((response: TokenResponse) => {
      console.log('Полученный токен ', response);
      refreshToken = response.refreshToken;
      tokenResponse = response;

      storeAuth();

      document.dispatchEvent(new CustomEvent(REFETCH_ALL));

      return response;
    });
}

async function requestRefreshToken(): Promise<void> {
  if (!refreshToken) {
    throw new Error('Не найден refresh_token');
  }

  const request = new TokenRequest({
    client_id: clientId,
    grant_type: GRANT_TYPE_REFRESH_TOKEN,
    redirect_uri: redirectUri,
    refresh_token: refreshToken,
  });

  const response = await tokenHandler.performTokenRequest(configuration, request);

  console.log('Обновили токен ', response);

  tokenResponse = response;
  refreshToken = response.refreshToken;
  storeAuth();
}

function storeAuth() {
  localStorage.auth = JSON.stringify({
    refreshToken,
  });

  authVar({
    isLoggedIn: true,
    accessToken: tokenResponse?.accessToken,
    refreshToken: refreshToken,
  });
}
