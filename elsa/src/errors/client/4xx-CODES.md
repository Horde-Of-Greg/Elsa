# 4xx Client Error Status Codes

These codes indicate the client fucked up. There is no internal error and we could process them, but we won't. Only the ones we will realistically use.

---

### `400`: Bad Request

Client sent malformed or invalid data.

`Example`: `!add`

### `403`: Forbidden

Server understood but refuses to authorize. Client does not have the perms.

### `404`: Not Found

The requested resource doesn't exist.

### `408`: Request Timeout

Client took too long to send the request. For some sort of interactive command? Probably not useful.

### `409`: Conflict

Request conflicts with current resource state (like adding a tag that already exists).

### `410`: Gone

Resource used to exist but was permanently deleted. Niche use cases, mostly will be 404.

### `415`: Unsupported Media Type

Server doesn't support the request's media type. If we ever add raw image/video support.

### `422`: Unprocessable Content

Request syntax is valid but semantically incorrect.

### `429`: Too Many Requests

Client sent too many requests in a given timeframe. Rate limited.

### `451`: Unavailable for Legal Reasons

Self explanatory. Could be implemented if we add LLMs or web searches.

`Example`: command to searches wikipedia, finds an article that is declared +18. Do not send because no guarantee users would be +18.
