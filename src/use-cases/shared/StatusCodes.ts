enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    GONE = 410,
    PRECONDITION_FAILED = 412,
    TOO_MANY_REQUESTS = 429,

    INTERNAL_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    NOT_IMPLEMENTED = 501,
}

export default StatusCode