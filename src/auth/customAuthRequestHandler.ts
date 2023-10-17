import {
  AuthorizationError, AuthorizationRequest, AuthorizationRequestHandler,
  AuthorizationRequestResponse, AuthorizationResponse, AuthorizationServiceConfiguration,
  DefaultCrypto,
} from "@openid/appauth";
import { WindowsQueryStringUtils } from "./queryStringUtils";

export class CustomAuthHandler extends AuthorizationRequestHandler {

  authComplete: Promise<AuthorizationRequestResponse> | undefined

  constructor() {
    const utils = new WindowsQueryStringUtils()
    const crypto = new DefaultCrypto()

    super(utils, crypto)
  }

  performAuthorizationRequest(configuration: AuthorizationServiceConfiguration, request: AuthorizationRequest): void {
    request.setupCodeVerifier().then(() => {
      const url = this.buildRequestUrl(configuration, request)
      console.log('Переходим на сайт для логина');
      
      window.electron.openExternal(url)
    })

    this.authComplete = new Promise((resolve, reject) => {
      window.ipc.startAuth().then((urlStr: string) => {
        const url = new URL(urlStr);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
  
        let error: AuthorizationError | null = null;
        let response: AuthorizationResponse | null = null;
  
        if (code && state) {
          response = new AuthorizationResponse({ code, state })
        } else {
          error = new AuthorizationError({ error: 'Не удалось найти code или state' })
        }
  
        const requestResponse: AuthorizationRequestResponse = {
          request,
          response,
          error
        }

        resolve(requestResponse)
      })
    })

  }
  protected completeAuthorizationRequest(): Promise<AuthorizationRequestResponse | null> {
    if (!this.authComplete) {
      return Promise.reject('Аутентификация еще не начата')
    }

    return this.authComplete
  }

}