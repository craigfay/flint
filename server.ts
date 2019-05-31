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

export class HttpServer {
  addr:string;

  constructor(addr:string) {
    this.addr = addr;
  }

  async start() {
    const s = serve(this.addr);
    for await (const req of s) {
      req.respond({ body: new TextEncoder().encode("Hello World\n") });
    }
  }

}
