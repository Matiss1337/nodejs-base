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
