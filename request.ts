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
async function toString(request): Promise<string> {
  const d = new TextDecoder()
  return await d.decode(request.r.buf)
}

// RFC-2068 Start-Line definitions:
//   Request-Line: Method SP Request-URI SP HTTP-Version CRLF
//   Status-Line:  HTTP-Version SP Status-Code SP Reason-Phrase CRLF
const startLine = /^[A-Z_]+(\/\d\.\d)? /
const requestLine = /^([A-Z_]+) (.+) [A-Z]+\/(\d)\.(\d)$/
const statusLine = /^[A-Z]+\/(\d)\.(\d) (\d{3}) (.*)$/

function firstLine(str) {
  var nl = str.indexOf('\r\n')
  if (nl === -1) return str
  else return str.slice(0, nl)
}

function parseHeaders(str:string):HttpHeaders {
  var headers = {}
  var next = nextLine(str)
  var line = next()
  var index, name, value

  if (startLine.test(line)) line = next()

  while (line) {
    // subsequent lines in multi-line headers start with whitespace
    if (line[0] === ' ' || line[0] === '\t') {
      value += ' ' + line.trim()
      line = next()
      continue
    }

    if (name) addHeaderLine(name, value, headers)

    index = line.indexOf(':')
    name = line.substr(0, index)
    value = line.substr(index + 1).trim()

    line = next()
  }

  if (name) addHeaderLine(name, value, headers)

  return headers
}

// The following function is lifted from:
// https://github.com/nodejs/node/blob/f1294f5bfd7f02bce8029818be9c92de59749137/lib/_http_incoming.js#L116-L170
//
// Add the given (field, value) pair to the message
//
// Per RFC2616, section 4.2 it is acceptable to join multiple instances of the
// same header with a ', ' if the header in question supports specification of
// multiple values this way. If not, we declare the first instance the winner
// and drop the second. Extended header fields (those beginning with 'x-') are
// always joined.
function addHeaderLine(field, value, dest) {
  field = field.toLowerCase()
  switch (field) {
    // Array headers:
    case 'set-cookie':
      if (dest[field] !== undefined) {
        dest[field].push(value)
      } else {
        dest[field] = [value]
      }
      break

    // list is taken from:
    // https://mxr.mozilla.org/mozilla/source/netwerk/protocol/http/src/nsHttpHeaderArray.cpp
    case 'content-type':
    case 'content-length':
    case 'user-agent':
    case 'referer':
    case 'host':
    case 'authorization':
    case 'proxy-authorization':
    case 'if-modified-since':
    case 'if-unmodified-since':
    case 'from':
    case 'location':
    case 'max-forwards':
    case 'retry-after':
    case 'etag':
    case 'last-modified':
    case 'server':
    case 'age':
    case 'expires':
      // drop duplicates
      if (dest[field] === undefined) dest[field] = value
      break

    default:
      // make comma-separated list
      if (typeof dest[field] === 'string') {
        dest[field] += ', ' + value
      } else {
        dest[field] = value
      }
  }
}

function nextLine(str) {
  var offset = 0
  str = str.toString()

  return iterator

  function iterator() {
    var i1 = str.indexOf('\r\n', offset)
    var i2 = str.indexOf('\n', offset)
    var i3 = str.indexOf('\r', offset)

    var indexes = [i1, i2, i3]
    var index = indexes
      .sort(function (a, b) {
        if (a > b) return 1
        if (a < b) return -1
        return 0
      })
      .filter(function (index) {
        return index !== -1
      })[0]

    if (index !== undefined) return extract(index, index === i1 ? 2 : 1)

    var length = str.length
    if (length === offset) return null

    return extract(length, 0)
  }

  function extract(index, skip) {
    var line = str.substr(offset, index - offset)
    offset = index + skip
    return line
  }
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
