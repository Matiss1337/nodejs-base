# Stack So Far Used

High-level reference for the Node course up to roughly section 16.

This is not "final stack only".
It includes tools and concepts used along the way, even if the current project no longer uses all of them at the same time.

## Core Runtime

- `Node.js`
  JavaScript runtime on the server.

- `npm`
  Package manager for installing dependencies and running scripts.

- `nodemon`
  Restarts the server automatically during development.

## Server / App Framework

- `Express`
  Main backend framework for routes, middleware, requests, and responses.

- `body-parser`
  Parses incoming form data so `req.body` works for POST requests.

- `path`
  Node core module used for safe filesystem path building.

## App Structure / Patterns

- `MVC`
  Split code into models, views, and controllers.

- `Routing`
  Separate route files like `routes/shop.js`, `routes/auth.js`, `routes/admin.js`.

- `Middleware`
  Reusable request pipeline logic such as auth checks, user loading, CSRF setup, and locals setup.

- `Error handling`
  Handling 404s and general request failures.

## Templating / Rendering

- `EJS`
  Current server-side templating engine used in this app.

- `Pug`
  Another templating engine covered in the course.

- `Express Handlebars`
  Another templating option covered in the course.

- `Server-rendered views`
  Backend renders HTML and passes data into templates with `res.render(...)`.

- `Partials / includes`
  Shared template pieces like navigation and reusable form blocks.

## Databases / Persistence

### MongoDB Track

- `MongoDB`
  Document database used for app data.

- `mongodb`
  Native MongoDB driver for Node.js.

- `Mongoose`
  ODM used to define schemas, models, relations, and document methods.

- `Schemas and models`
  Used for things like `User`, `Product`, and `Order`.

- `References / populate`
  Store related document IDs and later load full related documents.

### SQL Track Covered In Course

- `MySQL`
  Relational database covered earlier in the course.

- `mysql2`
  Node driver for MySQL.

- `Sequelize`
  ORM used with SQL databases.

## Authentication / Security

- `express-session`
  Session middleware for persistent login state across requests.

- `Cookies`
  Browser stores session identifier and sends it back with requests.

- `connect-mongodb-session`
  Stores Express session data in MongoDB.

- `bcryptjs`
  Hashes passwords before saving them.

- `Authentication`
  Signup, login, logout, and restoring user state from session.

- `Authorization`
  Restricting routes/actions to authenticated users.

- `CSRF`
  Protection against forged authenticated form submissions.

- `csurf`
  Middleware used for CSRF tokens in server-rendered forms.

- `connect-flash`
  One-time success/error messages across redirects.

- `Nodemailer`
  Sends transactional emails from the app.

- `Brevo SMTP relay`
  SMTP delivery service used by Nodemailer for outgoing emails.

## File / Static Asset Handling

- `express.static(...)`
  Serves CSS, client JS, and images from the public folder.

## Email / Messaging

- `Nodemailer`
  Builds and sends emails from Node.js.

- `Brevo SMTP`
  External SMTP provider used to deliver emails.

- `SMTP`
  Standard protocol used by the app to hand email off to Brevo.

- `Welcome email on signup`
  After a user signs up, the app sends a welcome email without blocking the redirect.

## Useful Backend Concepts Practiced

- request / response lifecycle
- `req`, `res`, `next`
- route params
- query params
- form submission flow
- redirects
- locals passed to templates
- session-backed user hydration
- protected routes
- CRUD flows
- async promise chains
- basic security middleware

## Current Practical Stack In This Project

If I only list what the current app is actively using right now:

- `Node.js`
- `Express`
- `EJS`
- `MongoDB`
- `Mongoose`
- `express-session`
- `connect-mongodb-session`
- `bcryptjs`
- `csurf`
- `connect-flash`
- `Nodemailer`
- `Brevo SMTP`
- `body-parser`
- `nodemon`

## Quick Mental Map

- Express = server framework
- EJS = HTML rendering
- MongoDB = database
- Mongoose = MongoDB modeling layer
- Sessions + cookies = login persistence
- bcrypt = password hashing
- CSRF token = form request protection
- Flash = one-time redirect messages
- Nodemailer + Brevo SMTP = outgoing email delivery
- MVC = project structure

## MVC Flowchart Example

One concrete example from this app is the signup flow. Instead of a diagram, here is the same flow as a simple MVC walkthrough.

### Signup Flow In Plain English

1. The user opens the signup page.
   Express receives the request, `routes/auth.js` matches the signup route, `controllers/auth.js` runs `getSignup`, and the controller renders `views/auth/signup.ejs`.

2. The user fills in the form and clicks Signup.
   The browser sends a `POST /signup` request from the EJS form back to the Express app.

3. Express middleware runs before the main signup logic.
   `body-parser` reads the form fields, session middleware loads session data, `connect-flash` loads flash messages, and `csurf` checks the CSRF token.

4. The auth route passes control to the signup controller.
   `routes/auth.js` sends the request to `postSignup` in `controllers/auth.js`.

5. The controller handles the business logic.
   `postSignup` reads the submitted email and password, checks whether the user already exists, and decides what should happen next.

6. The controller uses `bcryptjs` before saving anything.
   The password is hashed so the raw password is never stored in the database.

7. The controller uses the model to save data.
   `controllers/auth.js` creates a new `User` with the Mongoose model from `models/user.js`.

8. The model talks to MongoDB.
   The `User` model saves the new user document into MongoDB.

9. After the user is saved, the controller triggers side effects.
   `postSignup` sends a welcome email with `nodemailer`, and Nodemailer hands that email off to Brevo through SMTP.

10. The controller finishes the request with a redirect.
    After signup is done, the controller redirects the user to `/login`.

11. The login page is rendered as the next view.
    Express matches the login route, `getLogin` runs in `controllers/auth.js`, and `views/auth/login.ejs` is rendered.

### MVC Mapping In This Example

- `View`: `views/auth/signup.ejs` and `views/auth/login.ejs`
- `Route`: `routes/auth.js`
- `Controller`: `getSignup`, `postSignup`, `getLogin` in `controllers/auth.js`
- `Model`: `User` in `models/user.js`
- `Database`: `MongoDB`
- `External service`: `Nodemailer` -> `Brevo SMTP`
