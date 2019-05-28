import { serve } from "./deps.ts"
import { HttpResponse } from "./response.ts"
import { toString } from "./request.ts"

/**
 * Criticism:
 * req.headers uses get/set instead of acting like a regular obj
 * working with bytes feels too low level for this type of module's interface
 * constructing Headers() seems clunky
 * I'd like ot see the entire request as a string, and have its constituents as properties
 */

const addr = '0.0.0.0:4000'
const s = serve(addr)

async function main() {
  for await (const req of s) {

    const body = new TextDecoder().decode(await req.body())
    
    const response = new HttpResponse({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { foo: 'bar' },
    })

    req.respond(response);
    // Remember setContentLength
  }
}

main()
console.log('listening at', addr)
