class CustomApiError extends Error{
    constructor(message, statusCode){
        super(message);
    }
}

module.exports = CustomApiError