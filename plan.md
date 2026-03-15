## Support Ticket System

### What I Am Building

A backend-heavy support ticket system built with the same general stack and concepts as the Node course.

Main idea:
- users can sign up, log in, create tickets, and reply to their own tickets
- admins or agents can view all tickets, reply, change status, and manage the workflow
- the project stays focused on backend concepts, not frontend polish

This project is meant to practice:
- routing
- MVC structure
- sessions and cookies
- authentication and authorization
- MongoDB and Mongoose
- email flows
- flash messages
- validation
- rate limiting
- file upload
- error handling

### Main Features

- signup
- login
- logout
- session cookie authentication
- flash success and error messages after redirects
- email verification
- forgot password
- reset password by email token
- create ticket
- update ticket
- close ticket
- ticket replies/comments
- file attachment upload
- user can view only own tickets
- admin/agent can view all tickets
- rate limiting for auth and ticket creation
- validation and useful error messages
- 404 and 500 handling
- CSRF protection if using server-rendered forms

### Models

#### User

- name
- email
- password
- role
- isVerified
- verificationToken
- resetToken
- resetTokenExpiration

#### Ticket

- subject
- description
- status
- priority
- createdBy
- assignedTo
- attachments
- timestamps

#### Comment / Reply

- ticketId
- author
- message
- attachments
- timestamps

### Roles

#### User

- can create tickets
- can view own tickets
- can reply to own tickets
- can close own tickets if allowed by the workflow

#### Admin / Agent

- can view all tickets
- can reply to any ticket
- can change status
- can assign tickets
- can manage users if needed later

### Stack And Tools

- Node.js
- Express
- MongoDB
- Mongoose
- express-session
- connect-mongodb-session
- bcryptjs
- express-validator
- nodemailer
- multer
- express-rate-limit
- csurf if using server-rendered forms
- connect-flash if needed for flash messages

### CSRF In This Project

Use `csurf` if the app uses server-rendered forms with session-based auth.

Why:
- the browser automatically sends session cookies
- a malicious external site could try to trigger authenticated POST requests
- CSRF tokens help verify that state-changing requests came from the real app

Where it applies:
- login
- signup
- logout
- create ticket
- update ticket
- close ticket
- reply forms
- admin actions

Implementation goal:
- generate a CSRF token per request/session flow
- include the token in rendered forms
- reject POST requests with missing or invalid tokens
- add error handling for CSRF failures

### Backend Concepts I Will Practice

- route setup and route grouping
- controller-based MVC structure
- middleware flow
- session-based auth
- flash message handling across redirects
- protecting routes
- role-based access control
- request validation
- hashing passwords
- email token workflows
- working with MongoDB documents and relations
- handling async flows cleanly
- centralized error handling
- safe handling of unauthenticated requests
- pagination, filtering, and search
- rate limiting and abuse protection

### Suggested Folder Structure

```text
src/
  controllers/
  middleware/
  models/
  routes/
  utils/
  views/
  public/
```

Possible route split:
- `routes/auth.js`
- `routes/tickets.js`
- `routes/admin.js`

### Implementation Order

#### Phase 1: Project Setup

1. Initialize the project structure.
2. Set up Express, views if needed, static files, and base middleware.
3. Connect MongoDB with Mongoose.
4. Add a basic error page and 404 handling.
5. Add environment variables for secrets and database connection.

#### Phase 2: Authentication Base

1. Create the `User` model.
2. Build signup and login routes/controllers.
3. Hash passwords with `bcryptjs`.
4. Add session support with cookies and MongoDB session storage.
5. Add logout flow.
6. Add middleware to expose auth state to requests/views.
7. Add route protection middleware.

#### Phase 3: Ticket Core

1. Create the `Ticket` model.
2. Add create ticket flow.
3. Add list tickets flow for the current user.
4. Add single ticket detail page/endpoint.
5. Add update ticket flow.
6. Add close ticket flow.
7. Enforce ownership checks so users only access their own tickets.

#### Phase 4: Replies And Workflow

1. Create the `Comment` or `Reply` model.
2. Add replies to tickets.
3. Show ticket conversation history.
4. Add admin or agent reply capability.
5. Add status changes like open, pending, closed.
6. Add assignment support if needed.

#### Phase 5: Admin Area

1. Add role field to users.
2. Create admin middleware.
3. Add admin routes to view all tickets.
4. Add admin filtering by status, priority, or user.
5. Add admin actions for assigning and updating tickets.

#### Phase 6: Email Flows

1. Add email verification after signup.
2. Add forgot password flow.
3. Add reset password token flow.
4. Send email notifications for ticket creation or replies.

#### Phase 7: Validation And Security

1. Add request validation with `express-validator`.
2. Show clear validation errors.
3. Add rate limiting to signup, login, reset password, and ticket creation.
4. Add CSRF protection with `csurf` if forms are rendered on the server.
5. Expose the CSRF token to views and include it in all state-changing forms.
6. Handle invalid tokens and expired sessions safely.

#### Phase 8: File Uploads

1. Add attachment upload support with `multer`.
2. Restrict file type and size.
3. Attach uploaded files to tickets or replies.
4. Make sure authorization rules also apply to attachments.

#### Phase 9: Polish

1. Add pagination for ticket lists.
2. Add filtering and search.
3. Improve error handling flow.
4. Clean up controller logic if it gets too large.
5. Add basic logging or audit-style tracking for auth events.

### Build Priorities

Do these first:
- auth
- sessions
- protected routes
- ticket CRUD
- ownership checks

Do these after the core is stable:
- roles
- email flows
- uploads
- rate limiting
- pagination and filtering

### Rules For The Project

- keep the structure simple
- prefer small controllers over clever abstractions
- do not add unnecessary patterns early
- use the project to practice backend fundamentals, not frontend polish
- keep auth and ownership logic explicit

### Final Goal

By the end, this project should give me hands-on practice with the backend topics I actually want to improve:
- Express routing
- MVC
- sessions and cookies
- auth flows
- email flows
- validation
- rate limiting
- MongoDB modeling
- middleware and request lifecycle
