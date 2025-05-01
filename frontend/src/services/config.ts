export const BASE_URL = 'http://localhost:4000/api/v1';

let _token: string | null = null;
let _setInContext: (t: string | null) => void = () => {};

/** Called by your AuthProvider to wire up the context setter */
export function registerAccessTokenContextSetter(fn: (t: string | null) => void) {
  _setInContext = fn;
}

export function setAccessTokenService(t: string | null) {
  _token = t;
  _setInContext(t);
}

export function getAccessToken() {
  return _token;
}