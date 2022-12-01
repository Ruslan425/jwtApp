export default class UserResponse {
    userId
    token
    
    constructor(userId, token) {
        this.token = token
        this.userId = userId
    }
}
