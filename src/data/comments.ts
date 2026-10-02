import config from './waline.json'

// This is a public service address. Database credentials stay on the Waline server.
const address = (import.meta.env.PUBLIC_WALINE_SERVER_URL || config.serverURL).trim()
if (address) {
  const url = new URL(address)
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (
    (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
    url.username ||
    url.password
  )
    throw new Error('Waline requires an HTTPS service address without credentials')
  if (url.search || url.hash)
    throw new Error('Waline service address cannot contain a query or fragment')
}

export const comments = {
  serverURL: address.replace(/\/+$/, ''),
  enabled: Boolean(address)
}
