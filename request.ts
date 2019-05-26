/**
 * This file is concerned with adapting incoming deno_std/http `ServerRequest`s...
 * ...to their Flint counterpart, `HttpRequest`
 */

import { ServerRequest } from "./deps.ts";
import { HttpHeaders } from "./response.ts";

/**
 * Return the raw http request as a utf8 string
 * @param {ServerRequest} request the incoming request
 * This won't compile if the `request` argument is typed; why?
 */
export async function convertRaw(request): Promise<string> {
  const d = new TextDecoder()
  return await d.decode(request.r.buf)
}

/**
 * 
 */
function convertHeaders(headers:HttpHeaders):Headers {
  // ...
}

/**
 * 
 */
function convertBody(body:any):Uint8Array {
  // ...
}

interface HttpRequest {
  raw: string;
  proto?: string;
  url: string;
  query: object;
  headers: object;
  body: object;
}
