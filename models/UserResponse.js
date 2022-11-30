export default class UserResponse {
    username
    token
    
    constructor(username, token) {
        this.token = token
        this.username = username
    }
}
