# Stack So Far Used

Base Node.js backend reference project that can be reused as a template or starting point for future apps.

It already covers the main backend pieces you usually need in a real project: routing, MVC structure, authentication, sessions, security middleware, MongoDB with Mongoose, server-rendered views, transactional email, and password reset flow.

This README is meant as a practical reference point for future backend work, not just a loose list of tools.

## Required Setup

To run this project, you need a `MongoDB` database, a `Brevo` account for SMTP email sending, and a local `.env` file with these variables:

Example `.env`: 

```env
MONGODB_URI='your-mongodb-connection-string' - your MongoDB connection string
SESSION_SECRET='your-long-random-session-secret' - your own long random session secret
PORT=3000 - local app port
BREVO_SMTP_HOST='smtp-relay.brevo.com' - Brevo SMTP host
BREVO_SMTP_PORT='587' - Brevo SMTP port
BREVO_SMTP_USER='your-brevo-smtp-login' - your Brevo SMTP login
BREVO_SMTP_PASS='your-brevo-smtp-password' - your Brevo SMTP password/key
```

## Core Runtime

- `Node.js`
  JavaScript runtime on the server.

- `npm`
  Package manager for installing dependencies and running scripts.

- `nodemon`
  Restarts the server automatically during development.

- `crypto`
  Node core module used to generate secure reset tokens.

## Server / App Framework

- `Express`
  Main backend framework for routes, middleware, requests, and responses.

- `body-parser`
  Parses incoming form data so `req.body` works for POST requests.

- `express-validator`
  Request validation middleware used in routes for form and input checks.

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

- `500 page handling`
  The app includes a dedicated `GET /500` route, `controllers/error.js` `get500`, `views/500.ejs`, and terminal Express error middleware that renders the `500` page for forwarded server errors.

- `Express error passing`
  In normal synchronous Express code, you can throw directly with something like `throw new Error('Dummy error')`. In asynchronous code such as promise chains and callbacks, you should pass the error with `next(new Error(err))` or `next(err)` instead. Once Express reaches the error-handling middleware in `app.js`, the request skips the normal flow and renders the `500` page.

## Templating / Rendering

- `EJS`
  Current server-side templating engine used in this app.

- `Pug`
  Another templating engine covered in the course.

- `Express Handlebars`
  Another templating option covered in the course.

- `Server-rendered views`
  Backend renders HTML and passes data into templates with `res.render(...)`.

- `Error views`
  Dedicated templates exist for both `404` and `500` responses.

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

- `Password reset`
  Generate reset tokens, email reset links, validate token expiry, and update stored passwords.

- `Validation`
  Validate incoming auth data before business logic runs.

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

- `multer`
  Middleware for handling `multipart/form-data` uploads, used for image file uploads from forms.

- `enctype="multipart/form-data"`
  Form setting required when sending files like images, so the browser submits the request as multipart data instead of normal urlencoded form data.

- `Image file storage`
  Product image uploads are saved by Multer into the local `images/` folder on the server.

- `Image path saved in MongoDB`
  After upload, the controller stores the Multer file path such as `images/my-file.jpg` in the product document as `imageUrl`, instead of storing the raw file itself in MongoDB.

- `Static image serving`
  Express exposes the `images/` folder with `express.static(...)`, so saved image paths can be requested by the browser and rendered in EJS templates.

- `Upload directory requirement`
  The local `images/` folder must exist before Multer tries to write uploaded files into it. If the directory is missing, file upload fails with an `ENOENT` error before the product can be created.

- `Uploaded file cleanup`
  The app should remove old image files from disk when a product image is replaced or when the product is deleted. In this project that cleanup is handled through `util/file.js` and called from `controllers/admin.js`.

- `Delete file with fs.unlink`
  `util/file.js` wraps `fs.unlink(...)` so controllers can delete stored files without duplicating filesystem logic in multiple places.

- `Keep database and filesystem in sync`
  When a product is deleted from MongoDB, its uploaded image should also be deleted from the server. Otherwise the app leaves orphaned files behind in `images/`.

- `Image replacement flow`
  When editing a product and uploading a new image, the app first deletes the old image file and then stores the new path on the product document.

- `Stream direction matters`
  A writable file stream cannot be piped into `res`. For generated files such as PDFs, the readable source stream must pipe into both the file stream and the HTTP response.

- `Readable vs writable streams`
  In the invoice flow, `PDFDocument` is the readable stream source, while `fs.createWriteStream(...)` and `res` are writable destinations.

- `Inline PDF response`
  Setting `Content-Type: application/pdf` and `Content-Disposition: inline; filename="..."` tells the browser to open the PDF in the browser instead of forcing a download.

- `Generate and send PDF in one pass`
  The invoice flow creates a `PDFDocument`, pipes it to a file on disk, pipes it to `res`, writes order/product data into the document, and ends the stream with `pdfDoc.end()`.

- `Invoice data source`
  The invoice PDF should use data from the stored `Order` document, not from current product lookups. That matters because orders are historical snapshots and should not change if the product changes later.

- `Ownership check before file access`
  Before generating or serving an invoice, the app should verify that the requested order exists and that `order.user.userId` matches the current logged-in user. Otherwise any authenticated user could request another user's invoice by URL.

## Email / Messaging

- `Nodemailer`
  Builds and sends emails from Node.js.

- `Brevo SMTP`
  External SMTP provider used to deliver emails.

- `SMTP`
  Standard protocol used by the app to hand email off to Brevo.

- `Welcome email on signup`
  After a user signs up, the app sends a welcome email without blocking the redirect.

- `Password reset email`
  The app emails a reset link with a token and lets the user set a new password.

## Validation

- `Route-level validation`
  Validation rules live in `routes/auth.js`, so request checks run before the controller.

- `express-validator`
  Used to validate fields like email, password length, password format, and password confirmation.

- `Custom error messages`
  Validation rules use `.withMessage(...)` so the UI can show specific feedback instead of generic errors.

- `Async validation`
  Validation can query the database asynchronously, for example to reject signup when an email already exists.

- `Sanitizing`
  Input can be cleaned before the controller runs so validation and database checks work with more consistent values.

- `trim()`
  Removes whitespace from the start and end of input values, which helps avoid accidental spaces in auth forms.

- `normalizeEmail()`
  Standardizes email input before validation or lookup, for example by lowercasing it so auth checks stay consistent.

- `validationResult(req)`
  Controllers read validation results and decide whether to re-render the form with an error.

## HTTP Status Code Groups

- `200 OK`
  Operation succeeded.

- `201 Created`
  Success response used when a new resource was created.

- `301 Moved Permanently`
  The resource has been permanently moved to a new URL.

- `401 Unauthorized`
  The request is not authenticated, so the user must log in first.

- `403 Forbidden`
  The user is authenticated, but is not allowed to perform that action.

- `404 Not Found`
  The requested route, page, or resource was not found.

- `422 Unprocessable Entity`
  The request was valid in structure, but the input data failed validation or could not be processed.

- `429 Too Many Requests`
  The client sent too many requests in a short time, so the server is rate limiting access.

- `500 Internal Server Error`
  Something failed on the server, so the backend could not complete the request safely.

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
- token-based password reset
- email-based account recovery
- route-level request validation
- custom validation error messages
- async validation against the database
- sanitized input before validation and lookup
- normalized email input before auth checks
- query-driven pagination
- passing pagination state into EJS
- validating allowed page-size values
- client-side API calls from browser JavaScript
- async delete requests with `fetch()`
- returning JSON from Express controllers
- dedicated `404` and `500` error pages
- passing server errors with `next(error)`
- terminal Express error middleware

## Product Pagination Flow

The shop homepage now uses query-based pagination in `controllers/shop.js` and renders the pagination state into `views/shop/index.ejs`.

### Pagination In Plain English

1. The browser requests the shop page with query params.
   Example: `/` uses defaults, while `/?page=2&itemsPerPage=4` requests page 2 with 4 products per page.

2. The controller reads the pagination input from `req.query`.
   `getIndex` parses `page` and `itemsPerPage` from the URL.

3. The controller validates the requested page size.
   `itemsPerPage` is only accepted if it exists in `allowedItemsPerPage`. If not, the controller falls back to `defaultItemsPerPage`. That prevents unsupported values from being used directly in the database query.

4. The controller counts total products first.
   `countDocuments()` is used so the app knows how many products exist overall before calculating page metadata.

5. The controller fetches only the current page slice.
   `skip((page - 1) * itemsPerPage)` skips earlier results and `.limit(itemsPerPage)` restricts the number of products returned for the current page.

6. The controller passes both product data and pagination metadata into EJS.
   `res.render('shop/index', ...)` sends:
   - `prods`
   - `totalProducts`
   - `itemsPerPage`
   - `allowedItemsPerPage`
   - `currentPage`
   - `totalPages`
   - `hasNextPage`
   - `hasPreviousPage`
   - `nextPage`
   - `previousPage`

7. The EJS view renders the current pagination state.
   `views/shop/index.ejs` shows the total product count, current page number, next/previous links, and the selected `itemsPerPage` option.

8. The items-per-page control triggers pagination through a normal GET request.
   The `<select>` lives inside a GET form with a hidden `page=1` field. When the user changes the select, `onchange="this.form.submit()"` submits the form and reloads the page with the new `itemsPerPage` value.

9. Changing page size resets pagination back to page 1.
   That is important because a previous page number may no longer be valid after the page size changes.

### Pagination Mapping In This Example

- `Controller`: `getIndex` in `controllers/shop.js`
- `View`: `views/shop/index.ejs`
- `Query params`: `page`, `itemsPerPage`
- `Database behavior`: `countDocuments()`, `skip()`, `limit()`
- `UI trigger`: GET form submission from the items-per-page `<select>`

## Async Product Delete Flow

The admin product list now also includes a client-side API call flow for deleting products without a full page reload.

### Async Delete In Plain English

1. The admin products page renders a delete button for each product.
   `views/admin/products.ejs` stores the product id and CSRF token directly on the button with `data-product-id` and `data-csrf`.

2. The user clicks Delete in the browser.
   The inline handler calls `deleteProduct(this)` from `public/js/admin.js`, so the frontend code gets the exact button that was clicked.

3. The frontend reads the values from the button.
   `admin.js` pulls `productId` and `csrfToken` from `button.dataset` instead of reading sibling hidden inputs.

4. The browser sends an async HTTP request.
   `fetch(`/admin/product/${productId}`, { method: 'DELETE' })` sends a client-side request to the Express backend instead of submitting a normal form and reloading the page.

5. The CSRF token is sent in the request headers.
   The frontend includes `"csrf-token": csrfToken` so the protected delete route still passes CSRF validation.

6. Express routes the request to the delete controller.
   `routes/admin.js` uses `router.delete('/product/:productId', isAuth, adminController.deleteProduct)`.

7. The controller deletes the product and returns JSON.
   `controllers/admin.js` reads `req.params.productId`, deletes the matching product for the logged-in user, and responds with `res.status(200).json({ message: 'Product deleted successfully' })`.

8. The frontend updates the UI after the response comes back.
   If the response is successful, `admin.js` removes the matching `.product-card` from the DOM without refreshing the page.

### Async Delete Mapping In This Example

- `Frontend trigger`: button click in `views/admin/products.ejs`
- `Browser API`: `fetch()`
- `HTTP method`: `DELETE`
- `Endpoint`: `/admin/product/:productId`
- `Route`: `routes/admin.js`
- `Controller`: `deleteProduct` in `controllers/admin.js`
- `Response type`: JSON via `res.json(...)`
- `UI behavior`: remove product card without full page reload

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
- `express-validator`
- `Nodemailer`
- `Brevo SMTP`
- `crypto`
- `body-parser`
- `multer`
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
- express-validator = request validation before controller logic
- Nodemailer + Brevo SMTP = outgoing email delivery
- crypto + reset token = password recovery flow
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

### Signup Validation In Plain English

1. Validation starts in `routes/auth.js`.
   The signup route runs `express-validator` rules before `postSignup` in the controller.

2. Email format is checked first.
   `check('email').isEmail()` rejects invalid email input.

3. The email rule can also run async validation.
   A custom validator can query `User.findOne(...)` and reject when the email already exists in the database.

4. Password rules run in the route.
   Password length, allowed characters, and trimming are handled before the controller runs.

5. Confirm password is compared against the original password.
   A custom validator checks whether `confirmPassword` matches `req.body.password`.

6. Custom messages improve UX.
   `.withMessage(...)` gives readable messages like "Please enter a valid email address." instead of the default "Invalid value".

7. The controller reads validation results.
   `validationResult(req)` returns all validation errors, and the controller uses the first one with `errors.array()[0].msg`.

8. If validation fails, the controller re-renders the signup page.
   The user stays on the form and sees the validation message instead of continuing into signup logic.

## Password Reset Flow

This is the other important auth flow in the app. It starts with an email form, creates a reset token, sends the token by email, and then lets the user save a new password.

### Password Reset In Plain English

1. The user opens the reset page.
   Express receives `GET /reset`, `routes/auth.js` matches the route, `controllers/auth.js` runs `getReset`, and the controller renders `views/auth/reset.ejs`.

2. The user submits their email.
   The reset form sends a `POST /reset` request back to the app.

3. The controller generates a reset token.
   `postReset` uses Node's `crypto` module to create a secure random token.

4. The controller looks up the user by email.
   If no user is found, the controller flashes an error and redirects back to `/reset`.

5. The controller stores the reset token on the user.
   The `User` model saves both `resetToken` and `resetTokenExpiration` in MongoDB.

6. The app sends the reset email.
   `nodemailer` sends an email through Brevo SMTP with a link like `http://localhost:3000/reset/<token>`.

7. The user clicks the reset link from the email.
   Express receives `GET /reset/:token`, and `getNewPassword` checks whether the token exists and whether `resetTokenExpiration` is still in the future.

8. If the token is valid, the app renders the new password page.
   `controllers/auth.js` renders `views/auth/new-password.ejs` and passes the token and user id into the form as hidden fields.

9. The user submits the new password form.
   `views/auth/new-password.ejs` sends a `POST /new-password` request with the new password, token, and user id.

10. The controller validates the reset request again.
    `postNewPassword` looks up the user by `_id`, `resetToken`, and `resetTokenExpiration` so expired or invalid tokens are rejected.

11. The controller hashes and saves the new password.
    `bcryptjs` hashes the new password, the `User` model saves it, and the reset token fields are cleared.

12. The flow ends by redirecting back to login.
    After the password is updated, the controller redirects the user to `/login`.

### MVC Mapping In This Reset Example

- `View`: `views/auth/reset.ejs` and `views/auth/new-password.ejs`
- `Route`: `routes/auth.js`
- `Controller`: `getReset`, `postReset`, `getNewPassword`, `postNewPassword` in `controllers/auth.js`
- `Model`: `User` in `models/user.js`
- `Database`: `MongoDB`
- `External services`: `crypto`, `Nodemailer`, `Brevo SMTP`
