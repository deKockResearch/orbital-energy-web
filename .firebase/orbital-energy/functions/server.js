import { onRequest } from 'firebase-functions/v2/https';
  const server = import('firebase-frameworks');
  export const ssrorbitalenergy = onRequest({"region":"us-central1"}, (req, res) => server.then(it => it.handle(req, res)));
  