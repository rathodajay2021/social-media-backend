/* 
HOW TO USE THIS TO SEND RESPONSE

In your controller you can use

res.handler.*function*(data object, message , error*)
Ex : 
res.handler.success()
res.handler.success({userName : "John"})
res.handler.success({userName : "John"}, "User created")
res.handler.success(undefined, "User created")
res.handler.serverError(undefined, undefined, error object)

for message you can pass simple string
1. We have sent an email to your account
or for with values like
We have sent an email to %s,
{
    key : "TRANSLATION KEY",
    value : "value of %s"
}
*/

class ResponseHandler {
    constructor(req, res) {
      this.req = req;
      this.res = res;
    }
  
    sender(code, message, data, error, info) {
      this.res.status(code).json({
        message:
          typeof message === "string"
            ? this.res.__(message)
            : this.res.__(message.key, message.value),
        data,
        error: info,
      });
      if (error) {
        // HANDLE LOGS AND OTHER STUFF
        console.log("ERROR", error);
      }
    }
  
    /* 
          ARGUMENTS : Status code, message, data object,  error object
      */
    custom(...args) {
      this.sender(...args);
    }
  
    /* 
          ARGUMENTS : data o̥̥bject, message, error object
      */
  
    // 2XX SUCCESS
    success(data, message, info) {
      const msg =
        Array.isArray(data) && data.length == 0
          ? "VALIDATION.NOT_FOUND.DATA"
          : "STATUS.SUCCESS";
      this.sender(STATUS_CODES.SUCCESS, message || msg, data, info);
      // this.sender(STATUS_CODES.SUCCESS, message, data, info);
    }
  
    updated(data, message, info) {
      this.sender(STATUS_CODES.SUCCESS, message || "STATUS.SUCCESS", data, info);
    }
  
    created(data, message, info) {
      this.sender(STATUS_CODES.CREATED, message || "STATUS.CREATED", data, info);
    }
  
    // 4XX CLIENT ERROR
    badRequest(message, data, info) {
      this.sender(
        STATUS_CODES.BAD_REQUEST,
        message || "STATUS.BAD_REQUEST",
        data,
        info
      );
    }
  
    unauthorized(message, data, info) {
      this.sender(
        STATUS_CODES.UNAUTHORIZED,
        message || "STATUS.UNAUTHORIZED",
        data,
        info
      );
    }
  
    forbidden(message, data, info) {
      this.sender(
        STATUS_CODES.FORBIDDEN,
        message || "STATUS.FORBIDDEN",
        data,
        info
      );
    }
  
    notFound(message, info) {
      this.sender(STATUS_CODES.NOT_FOUND, message || "STATUS.NOT_FOUND", info);
    }
  
    conflict(message, data, info) {
      this.sender(
        STATUS_CODES.CONFLICT,
        message || "STATUS.CONFLICT",
        data,
        info
      );
    }
  
    notAllowed(message, data, info) {
      this.sender(
        STATUS_CODES.NOT_ALLOWED,
        message || "STATUS.NOT_ALLOWED",
        data,
        info
      );
    }
  
    preconditionFailed(message, data, info) {
      this.sender(
        STATUS_CODES.PRECONDITION_FAILED,
        message || "STATUS.PRECONDITION_FAILED",
        data,
        info,
        false
      );
    }
  
    validationError(message, error) {
      this.sender(
        STATUS_CODES.VALIDATION_ERROR,
        message || "STATUS.VALIDATION_ERROR",
        null,
        null,
        error,
        false
      );
    }
  
    // 5XX SERVER ERROR
    serverError(error) {
      this.sender(
        STATUS_CODES.SERVER_ERROR,
        "STATUS.SERVER_ERROR",
        undefined,
        error
      );
    }
  }
  
  module.exports = ResponseHandler;
  