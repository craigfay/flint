/**
 * This file is concerned with adapting outgoing Flint style HttpResponses...
 * ...to their deno_std/http counterpart
 */

import { Response } from "./deps.ts"

function convertStatus(num) {
  // TODO whitelist status codes
  return num;
}

/**
 * Convert key value pairs to deno's top level Headers interface
 * @param {HttpHeaders} headers
 * @return {Headers}
 */
function convertHeaders(headers:HttpHeaders):Headers {
  const conversion = new Headers();
  Object.keys(headers).forEach(function(key) {
    const value = headers[key]
    conversion.set(key, value);
  });
  return conversion;
}

/**
 * Convert any object to a Uint8Array to be used as a request body
 * Input is most typically a string or an object
 * @param {any} body
 * @return {Uint8Array}
 */
function convertBody(body:any):Uint8Array {
  const e = new TextEncoder()
  if (typeof body == 'string') {
    return e.encode(body)
  }
  return e.encode(JSON.stringify(body))
}

/**
 * Convert an HttpResponse object to the deno_std/http compatible equivalent
 * @param {HttpResponse} r
 * @return {Response} The Response interface from deno_std/http
 */
export function httpResponse(r:HttpResponse):Response {
  return {
    status: convertStatus(r.status),
    headers: convertHeaders(r.headers),
    body: convertBody(r.body),
  }
}

export interface HttpHeaders {
  [key:string] : string;
}

export interface HttpResponse {
  status: number;
  headers: HttpHeaders;
  body: any;
}