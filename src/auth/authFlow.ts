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
import { REFETCH_ALL, URL_UPDATED } from '../eventNames';
import { authVar, settingsVar } from '../apollo/vars';
import { CustomAuthHandler } from './customAuthRequestHandler';

const clientId = 'a73cd2544ee7dab223274ab6c2d3cc7758cf3a318dcf435eae6783ee8582dad6';
const redirectUri = 'https://deface-37.github.io/Gitlab-Issues-Time-Manager/callback';
const scope = 'api';

interface StoredAuth {
  refreshToken?: string;
  codeVerifier?: string;
}

class AuthFlow {
  private configuration: AuthorizationServiceConfiguration | undefined;

  private authorizationHandler = new CustomAuthHandler();
  private tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());

  private tokenResponse: TokenResponse | undefined;
  private refreshToken: string | undefined;
  private repeatId: number | undefined;
  private codeVerifier: string | undefined;

  constructor() {
    document.addEventListener(URL_UPDATED, () => {
      const settings = settingsVar();
      this.setConfig(settings.url);
    });
    const settings = settingsVar();
    this.setConfig(settings.url);

    const json = localStorage.getItem('auth');
    if (json) {
      const storedAuth = JSON.parse(json) as StoredAuth;
      this.refreshToken = storedAuth.refreshToken;
      this.codeVerifier = storedAuth.codeVerifier;

      this.requestRefreshToken()
        .then(() => {
          document.dispatchEvent(new CustomEvent(REFETCH_ALL));
          this.planUpdateToken();
        })
        .catch((error) => {
          console.error('Не удалось обновить токен', error);
        });
    }
  }

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

    console.log('Делаем авторизационный запрос ', this.configuration, request);

    if (!this.configuration) throw new Error('Не определена конфигурация');
    this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
    const res = await this.authorizationHandler.authComplete;

    if (!res) throw new Error('Не удалось произвести аутентификацию');

    const { response, error } = res;
    if (!response) throw new Error('Не удалось произвести аутентификацию');
    console.log('Авторизация завершена', response, error);

    const codeVerifier = request.internal?.code_verifier;
    if (!codeVerifier) throw new Error('Не передан code_verifier');
    this.codeVerifier = codeVerifier;

    return this.makeTokenRequest(response.code, codeVerifier);
  }

  async revokeToken() {
    const token = this.tokenResponse?.accessToken;
    if (!token) {
      console.error('Вы не залогинены');
      return;
    }

    if (!this.configuration) throw new Error('Нет конфига');

    const request = new RevokeTokenRequest({
      client_id: clientId,
      token,
    });

    const success = await this.tokenHandler.performRevokeTokenRequest(this.configuration, request);
    if (success) {
      this.tokenResponse = undefined;
      this.refreshToken = undefined;

      localStorage.removeItem('auth');
      authVar({ isLoggedIn: false });
      clearInterval(this.repeatId);

      console.log('Сбросили токен');
    } else {
      console.log('Не удалось сбросить токен');
    }
  }

  private async makeTokenRequest(code: string, codeVerifier: string): Promise<TokenResponse> {
    if (!this.configuration) throw new Error('Нет конфига');

    const extras: StringMap = { code_verifier: codeVerifier };

    const request = new TokenRequest({
      client_id: clientId,
      grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
      redirect_uri: redirectUri,
      code,
      extras,
    });

    console.log('Делаем запрос за токеном', request);

    const response = await this.tokenHandler.performTokenRequest(this.configuration, request);
    console.log('Полученный токен ', response);
    this.refreshToken = response.refreshToken;
    this.tokenResponse = response;

    this.storeAuth();
    this.planUpdateToken();
    document.dispatchEvent(new CustomEvent(REFETCH_ALL));
    return response;
  }

  private async requestRefreshToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('Не найден refresh token');
    }
    if (!this.codeVerifier) {
      throw new Error('Не найден core verifier');
    }

    if (!this.configuration) throw new Error('Нет конфига');

    const request = new TokenRequest({
      client_id: clientId,
      grant_type: GRANT_TYPE_REFRESH_TOKEN,
      redirect_uri: redirectUri,
      refresh_token: this.refreshToken,
      extras: { code_verifier: this.codeVerifier },
    });

    const response = await this.tokenHandler.performTokenRequest(this.configuration, request);

    console.log('Обновили токен ', response);

    this.tokenResponse = response;
    this.refreshToken = response.refreshToken;
    this.storeAuth();
  }

  private storeAuth() {
    localStorage.auth = JSON.stringify({
      refreshToken: this.refreshToken,
      codeVerifier: this.codeVerifier,
    });

    authVar({
      isLoggedIn: true,
      accessToken: this.tokenResponse?.accessToken,
      refreshToken: this.refreshToken,
    });
  }

  private planUpdateToken() {
    if (this.repeatId) {
      clearInterval(this.repeatId);
    }
    this.repeatId = setInterval(
      this.requestRefreshToken.bind(this) as TimerHandler,
      1000 * 60 * 90
    );
  }

  private setConfig(baseUrl: string) {
    if (this.tokenResponse?.accessToken) {
      this.revokeToken();
    }

    try {
      this.configuration = new AuthorizationServiceConfiguration({
        authorization_endpoint: new URL('/oauth/authorize', baseUrl).href,
        token_endpoint: new URL('/oauth/token', baseUrl).href,
        revocation_endpoint: new URL('/oauth/revoke', baseUrl).href,
      });
      console.log('Обновили конфиг', this.configuration);
    } catch (error) {
      console.error('Ошибка при создании конфига: ', error);
    }
  }
}

export default new AuthFlow();
