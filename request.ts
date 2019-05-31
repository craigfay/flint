/**
 * This file is concerned with adapting incoming deno_std/http `ServerRequest`s...
 * ...to their Flint counterpart, `HttpRequest`
 */

import { ServerRequest } from "./deps.ts";
import { HttpHeaders } from "./headers.ts";

/**
 * Return the raw http request as a utf8 string
 * @param {ServerRequest} request the incoming request
 * This won't compile if the `request` argument is typed; why?
 */
export async function toString(request): Promise<string> {
  const d = new TextDecoder()
  return await d.decode(request.r.buf)
}

interface HttpRequest {
  raw: string;
  version: {
    major:number;
    minor:number;
  };
  url: string;
  query: object;
  headers: HttpHeaders;
  body: object;
}
