// https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#4-create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token
// custom effect to use the aut0 api

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface IApiOptions {
  [property: string] : any;
  headers?: {[key: string | symbol]: string};
}

interface IUseApiProps {
  audience: string;
  scope: string;
  apiOptions: IApiOptions;
}

export const useApi = (url: string, options: IUseApiProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, apiOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...apiOptions,
          headers: {
            ...apiOptions.headers,
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (err: any) {
        setState({
          ...state,
          error: err,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};