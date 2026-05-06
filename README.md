## login, Sessions and authentication

### About 
Login page, with authentication, the ability to choose persistent sessions with cookies or stateless sessions with JWT, Role-Base Access Control to manage user control, security implementations to prevent XSS attacks, CSRF attacks, and Brute-Force attacks, implementations of hashing for storing the passwords securely. 

## Authentication, secure code and prevention of attacks practices on web applications

### Repository structure
* /src
    * /config
        * `dbconection.js`
    * /controllers
        * `authControllers.js`
        * `commentControllers.js`
        * `userController.js`
    * /middlewares
        * `authMiddleware.js`
        * `roleMiddleware.js`
    * /models
        * `commentModel.js`
        * `sessionModel.js`
        * `userModel.js`
    * /public/js
        * `admin.js`
        * `login.js`
        * `register.js`
        * `user.js`
    * /routes
        * `authRoutes.js`
        * `commentRoutes.js`
        * `userRoutes.js`
        * `viewRoutes.js`
    * /views
        * `admin.ejs`
        * `login.ejs`
        * `register.ejs`
        * `user.ejs`
    * `index.js`
* `.env`
* `package.json`
* `README.md`

### Features & Exercise Milestones
* **learn, model and manage databases with MongoDB** 
* **implement good authentication practices**
* **Implement persistent sessions with cookies and stateless sessions with JWT and see what their advantages and disadvantages are**
* **Successfully implement a Role Base Access Control model with well-defined roles, permissions, and capabilities**
* **Implement security methods for various attacks such as XSS, CSRF, Brute-Force, etc.**

### Requirements
* **Node.js** (v18.x or higher)
* **Modern Web Browser** (chrome, firefox, etc for dev-tools)
* **npm** (for management of packages)
* **MongoDB** (local instance or MongoDB Atlas connection string)

### Dependencies
* **bcryptjs** : ^3.0.3
* **dotenv** : ^17.4.2
* **express** : ^5.2.1
* **jsonwebtoken** : ^9.0.3
* **mongoose** : ^9.6.1
* **ejs** : ^5.0.2
* **cookie-parser** : ^1.4.7
* **nodemon** : ^3.1.14
* **express-rate-limit** : ^8.5.0
* **xss** : ^1.0.15
* **express-validator** : ^7.3.2
* **helmet** : ^8.1.0

### Setup & Execution
1. **Clone the repo**
```bash
git clone https://github.com/SadCloud03/loging-security-test.git
cd loging-security-test
```
2. **Install Dependencies**
```bash
npm install
```
3. **Set up the Environment Variables**
```
* Create a .env file in the root of the project.
* Add the following variables:
```
```env
PORT=3001
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
4. **Run the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```
5. **Use the App**
```
* Open your browser and go to http://localhost:3001
* Register a new account at /register
* Login at /login — choose between Cookie Login (stateful) or JWT Login (stateless)
* Regular users are redirected to /user, admins to /admin
```
