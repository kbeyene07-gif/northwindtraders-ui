import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '64f97808-3331-4ed8-9f60-980ac0d545d5',
    authority: 'https://login.microsoftonline.com/c3506676-4145-4ee8-8fa0-b6c0954ee57e',
    redirectUri: 'http://localhost:4200'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

//  API scope (the one I created in "Expose an API")
export const API_SCOPE =
  'api://8a7f203e-58b4-438c-b266-e22882742480/access_as_user';
