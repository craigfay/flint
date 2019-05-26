/**
 * This file is concerned with adapting outgoing Flint style ResponseMaterials...
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
 * Convert a ResponseMaterial object to the deno_std/http compatible equivalent
 * @param {ResponseMaterial} r
 * @return {Response} The Response interface from deno_std/http
 */
export class HttpResponse implements Response {
  status: number;
  headers: Headers;
  body: Uint8Array;
  constructor(r:ResponseMaterial) {
    this.status = convertStatus(r.status);
    this.headers = convertHeaders(r.headers);
    this.body = convertBody(r.body);
  }
}

/**
 * Headers passed in as ResponseMaterial
 */
export interface HttpHeaders {
  [key:string] : string;
}

/**
 * This is the shape of objects that users of the module...
 * ...can use to generate HTTP responses
 */
export interface ResponseMaterial {
  status: number;
  headers: HttpHeaders;
  body: any;
}