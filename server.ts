import { serve } from "https://deno.land/std@v0.6/http/server.ts"

/**
 * Criticism:
 * req.headers uses get/set instead of acting like a regular obj
 * working with bytes feels too low level for this type of module's interface
 * constructing Headers() seems clunky
 * I'd like ot see the entire request as a string, and have its constituents as properties
 */

const addr = '0.0.0.0:4000'
const s = serve(addr)

async function _raw(req) {
  const d = new TextDecoder()
  return await d.decode(req.r.buf)
}

function makeHeaders(obj) {
  const headers = new Headers()
  Object.keys(obj).forEach(function(key) {
    const value = obj[key]
    headers.set(key, value);
  })
  return headers;
}

function makeBody(str) {
  const e = new TextEncoder()
  if (typeof str == 'string') {
    return e.encode(str)
  }
  return e.encode(JSON.stringify(str))
}

async function main() {
  for await (const req of s) {

    const body = new TextDecoder().decode(await req.body())
    
    const response = {
      status: 200,
      headers: makeHeaders({ 'Content-Type': 'application/json' }),
      body: makeBody({ foo: 'bar' }),
    }
    req.respond(response);
    // Remember setContentLength
  }
}

main()
console.log('listening at', addr)

// This is what I want as a user
interface HttpRequest {
  raw: string;
  proto?: string;
  url: string;
  query: object;
  headers: object;
  body: object;
}
