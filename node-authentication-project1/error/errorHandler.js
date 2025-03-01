class CustomError extends Error {

   constructor(message, statusCode){
            this.message = message;
            this.name = this.constructor.name;
            this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor)
   }
}