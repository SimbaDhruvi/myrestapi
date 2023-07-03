class CustomErrorHandler extends Error{
    constructor(status,msg){
        super();
        this.status = status;
        this.message = msg;
    }
    static alreadyExist(message) {
        return new CustomErrorHandler(409,message);
    }

    static wrongcredentials(message = 'Username Or Password is Wrong') {
        return new CustomErrorHandler(401,message);
    }

    static unauthorized(message = 'unauthorized') {
        return new CustomErrorHandler(401,message);
    }

    static notfound(message = '404 Not Found') {
        return new CustomErrorHandler(401,message);
    }
    static serverError(message = 'Internal Server Error') {
        return new CustomErrorHandler(401,message);
    }
}
export default CustomErrorHandler;