<img src="doc/landing.png" alt="Landing page of Digits app">

# Digits
Digits is a cleaned-up version of the `nextjs-application-template`. It provides a modern and minimal full-stack web application built with:

- A standard directory layout using 'src/' as recommended in the [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure) guide.
- [Bootstrap 5 React](https://react-bootstrap.github.io/) for user interface.
- [React Hook Form](https://www.react-hook-form.com/) for form development.
- Authorization, authentication, and registration using [NextAuth.js](https://next-auth.js.org/).
- Initialization of users and data from a settings file.
- Alerts regarding success or failure of DB updates using [Sweet Alert](https://sweetalert.js.org/).
- Quality assurance using [ESLint](http://eslint.org) with packages to partially enforce the [Next.js ESLint rules](https://nextjs.org/docs/app/building-your-application/configuring/eslint) and the [AirBnB Javascript Style Guide](https://github.com/airbnb/javascript).

The goal of this template is to help you get quickly started doing Next.js development by providing a reasonable directory structure for development and deployment, a set of common extensions to the core framework, and boilerplate code to implement basic page display, navigation, forms, roles, and database manipulation.

To keep this codebase simple and small, some important capabilities are intentionally excluded from this application:

- Unit Testing
- Security
- Deployment

Examples of the these capabilities will be provided elsewhere.


Digits is an application that allows users to:
* Create an account
* Create and manage a set of contacts
  * Display their name, address, description, and image
* Add and save a set of timestamped notes to keep a record of interactions that occurred with each contact

## Installation

First, [install PostgreSQL](https://www.postgresql.org/download/). Then create a database for your application.

```

$ createdb digits
Password:
$

```

Second, go to [https://github.com/jang-taeyang/digits](https://github.com/jang-taeyang/digits), and click the "Use this template" button. Complete the dialog box to create a new repository that you own that is initialized with this template's files.

Third, go to your newly created repository, and click the "Clone or download" button to download your new GitHub repo to your local file system. Using [GitHub Desktop](https://desktop.github.com/) is a great choice if you use MacOS or Windows.

Fourth, cd into the directory of your local copy of the repo, and install third party libraries with:

```

$ npm install

```

Fifth, create a `.env` file from the `sample.env`. Set the `DATABASE_URL` variable to match your PostgreSQL database that you created in the first step. See the Prisma docs [Connect your database](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql). Then run the Prisma migration `npx prisma migrate dev` to set up the PostgreSQL tables.

```

$ npx prisma migrate dev
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "<your database name>", schema "public" at "localhost:5432"

Applying migration `20240708195109_init`

The following migration(s) have been applied:

migrations/
└─ 20240708195109_init/
└─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.16.1) to ./node_modules/@prisma/client in 51ms

$

```

Then seed the database with the `/config/settings.development.json` data using `npx prisma db seed`.

```

$ npx prisma db seed
Environment variables loaded from .env
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
Seeding the database
Creating user: admin@foo.com with role: ADMIN
Creating user: john@foo.com with role: USER
Adding stuff: Basket (john@foo.com)
Adding stuff: Bicycle (john@foo.com)
Adding stuff: Banana (admin@foo.com)
Adding stuff: Boogie Board (admin@foo.com)

🌱 The seed command has been executed.
$

```

## Running the system

Once the libraries are installed and the database seeded, you can run the application by invoking the "dev" script in the [package.json file](https://github.com/jang-taeyang/digits/blob/main/package.json):

```

$ npm run dev

> digits-1@0.1.0 dev
> next dev

▲ digits 14.2.4

- Local: http://localhost:3000
- Environments: .env

✓ Starting...
✓ Ready in 1619ms

```

### Viewing the running app

If all goes well, the application will appear at [http://localhost:3000](http://localhost:3000). You can login using the credentials in [settings.development.json](https://github.com/jang-taeyang/digits/blob/main/config/settings.development.json), or else register a new account.

### ESLint

You can verify that the code obeys our coding standards by running ESLint over the code in the src/ directory with:

```
$ npm run lint

> digits-1@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
$
```

## Walkthrough

The following sections describe the major features of this application.

### Directory structure

The top-level directory structure is:

```

.github # holds the GitHub Continuous Integration action and Issue template.

config/ # holds configuration files, such as settings.development.json

doc/ # holds developer documentation, user guides, etc.

prisma/ # holds the Prisma ORM schema and seed.ts files.

public/ # holds the public images.

src/ # holds the application files.

tests/ # holds the Playwright acceptance tests.

.eslintrc.json # The ESLint configuration.

.gitignore # don't commit VSCode settings files, node_modules, and settings.production.json

```

This structure separates documentation files (such as screenshots) and configuration files (such as the settings files) from the actual Next.js application.

The src/ directory has this structure:

```

app/

  add/ # The add route
    page.tsx # The Add Stuff Page (Add Contact)

  admin/
    page.tsx # The Admin Page

  api/auth/[...nextauth]/
    route.ts # The NextAuth configuration

  auth/
    change-password/
      page.tsx # The Change Password Page

    signin/
      page.tsx # The Sign In Page

    signout/
      page.tsx # The Sign Out Page

    signup/
      page.tsx # The Sign Up / Register Page

  edit/
    page.tsx # The Edit Contact Page

  list/
    page.tsx # The List Contact Page

  not-authorized/
    page.tsx # The Not Authorized Page

  layout.tsx # The layout of the application

  page.tsx # The Landing Page

  providers.tsx # Session providers.

  components/
    AddContactForm.tsx # The React Hook Form for adding Contact.

    EditContactForm.tsx # The Edit Contact Form.

    Footer.tsx # The application footer.

    LoadingSpinner.tsx # Indicates working.

    Navbar.tsx # The application navbar.

    ContactItem.tsx # Row in the list Contact page.

    ContactItemAdmin.tsx # Row in the admin list Contact page.

  lib/

    dbActions.ts # Functions to manipulate the Postgres database.

    page-protections.ts # Functions to check for logged in users and their roles.

    prisma.ts # Singleton Prisma client.

    validationSchemas.ts # Yup schemas for validating forms.

  tests/ # playwright acceptance tests.

```

### Application functionality

The application implements a simple CRUD application for managing "Contact", which is a PostgreSQL table consisting of a name (String), a quantity (Number), a condition (one of 'excellent', 'good', 'fair', or 'poor') and an owner.

By default, each user only sees the Contact that they have created. However, the settings file enables you to define default accounts. If you define a user with the role "admin", then that user gets access to a special page which lists all the Contact defined by all users.

#### Landing page

When you retrieve the app at http://localhost:3000, this is what should be displayed:

<img src="doc/landing.png" alt="Landing page of Digits app">

The next step is to use the Login menu to either Login to an existing account or register a new account.

#### Login page

Clicking on the Login link, then on the Sign In menu item displays this page:

<img src="doc/signin.png" alt="Signin page of Digits app">

#### Register page

Alternatively, clicking on the Login link, then on the Sign Up menu item displays this page:

<img src="doc/register.png" alt="Signup page of Digits app">

#### Landing (after Login) page, non-Admin user

Once you log in (either to an existing account or by creating a new one), the navbar changes as follows:

<img src="doc/landing-after-login.png" alt="Landing After Login page of Digits app">

You can now add new Contact documents, and list the Contact you have created. Note you cannot see any Contact created by other users.

#### Add Contact page

After logging in, here is the page that allows you to add new Contact:

<img src="doc/add-contact.png" alt="Add Contact page of Digits app">

#### List Contact page

After logging in, here is the page that allows you to list all the Contact you have created:

<img src="doc/list-contact.png" alt="List Contact page of Digits app">

You click the "Edit" link to go to the Edit Contact page, shown next.

#### Edit Contact page

After clicking on the "Edit" link associated with an item, this page displays that allows you to change and save it:

<img src="doc/edit-contact.png" alt="Edit Contact page of Digits app">

#### Landing (after Login), Admin user

You can define an "admin" user in the settings.json file. This user, after logging in, gets a special entry in the navbar:

<img src="doc/landing-after-login.png" alt="Landing After Login page of Digits app">


#### Admin page (list all users contact)

To provide a simple example of a "super power" for Admin users, the Admin page lists all of the Contact by all of the users:

<img src="doc/admin-list-contact.png" alt="Admin List Contact page of Digits app">


Note that non-admin users cannot get to this page, even if they type in the URL by hand.

### Tables

The application implements two tables "Contact" and "User". Each Contact row has the following columns: first name, last name, address, image, description, and owner. The User table has the following columns: id, email, password (hashed using bcrypt), role.

The Contact and User models are defined in [prisma/schema.prisma]https://github.com/jang-taeyang/digits/blob/main/prisma/schema.prisma.

The tables are initialized in [prisma/seed.ts]https://github.com/jang-taeyang/digits/blob/main/prisma/seed.ts using the command `npx prisma db seed`.

### CSS

The application uses the [React implementation of Bootstrap 5](https://react-bootstrap.github.io/). You can adjust the theme by editing the `src/app/globals.css` file. To change the theme override the Bootstrap 5 CSS variables.

```css
/* Change bootstrap variable values.
 See https://getbootstrap.com/docs/5.2/customize/css-variables/
 */
body {
  --bs-light-rgb: 236, 236, 236;
}

/* Define custom styles */
.gray-background {
  background-color: var(--bs-gray-200);
  color: var(--bs-dark);
  padding-top: 10px;
  padding-bottom: 20px;
}
```

### Routing

For display and navigation among its four pages, the application uses [Next.js App Router](https://nextjs.org/docs/app/building-your-application/routing).

Routing is defined by the directory structure.

### Authentication

For authentication, the application uses the NextAuth package.

When the database is seeded, a settings file (such as [config/settings.development.json](https://github.com/jang-taeyang/digits/blob/main/config/settings.development.json)) is used to create users and contact in the PostgreSQL database. That will lead to a default accounts being created.

The application allows users to register and create new accounts at any time.

### Authorization

Only logged in users can manipulate Contact items (but any registered user can manipulate any Contact item, even if they weren't the user that created it.)

### Configuration

The [config](https://github.com/jang-taeyang/digits/tree/main/config) directory is intended to hold settings files. The repository contains one file: [config/settings.development.json](https://github.com/jang-taeyang/digits/tree/main/config/settings.development.json).

The [.gitignore](https://github.com/jang-taeyang/digits/blob/main/.gitignore) file prevents a file named settings.production.json from being committed to the repository. So, if you are deploying the application, you can put settings in a file named settings.production.json and it will not be committed.

### Quality Assurance

#### ESLint

The application includes a [.eslintrc.json](https://github.com/jang-taeyang/digits/blob/main/.eslintrc.json) file to define the coding style adhered to in this application. You can invoke ESLint from the command line as follows:

```
[~/digits]-> npm run lint

> digits-1@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
[~/digits]->
```

ESLint should run without generating any errors.

It's significantly easier to do development with ESLint integrated directly into your IDE (such as VSCode).

<!--
## Screencasts

For more information about this system, please watch one or more of the following screencasts. Note that the current source code might differ slightly from the code in these screencasts, but the changes should be very minor.

- [Walkthrough of system user interface (6 min)](https://youtu.be/48xu1hrqUi8)
- [Data and accounts structure and initialization (18 min)](https://youtu.be/HZRjwrVBWp4)
- [Navigation, routing, pages, components (34 min)](https://youtu.be/XztTdHpv6Jw)
- [Forms (32 min)](https://youtu.be/8FyWR3gUGCM)
- [Authorization, authentication, and roles (12 min)](https://youtu.be/9HX5vuXTlvA)
-->


## References

For more information regarding the procedure of building this application, please watch:

### Website Guides

1. [ Next.js Digits 1](http://courses.ics.hawaii.edu/ics314s25/morea/nextjs-3/experience-nextjs-digits-1.html)

2. [ Next.js Digits 2](http://courses.ics.hawaii.edu/ics314s25/morea/nextjs-3/experience-nextjs-digits-2.html)

3. [Next.js Digits 3](http://courses.ics.hawaii.edu/ics314s25/morea/nextjs-3/experience-nextjs-digits-3.html)

4. [ Next.js Digits 4](http://courses.ics.hawaii.edu/ics314s25/morea/nextjs-3/experience-nextjs-digits-4.html)

5. [ Next.js Digits 5](http://courses.ics.hawaii.edu/ics314s25/morea/nextjs-3/experience-nextjs-digits-5.html)

6. [ Next.js Digits 6](http://courses.ics.hawaii.edu/ics314s25/morea/nextjs-3/experience-nextjs-digits-6.html)


### Youtube Guides

1. [ Next.js Digits 1](https://www.youtube.com/watch?v=8Bj17ZWtjPw)

2. [ Next.js Digits 2](https://www.youtube.com/watch?v=iK6jwjhIqXQ)

3. [ Next.js Digits 3](https://www.youtube.com/watch?v=lRisO7mfIBs)

4. [ Next.js Digits 4](https://www.youtube.com/watch?v=YPR96dVA2UY)

5. [ Next.js Digits 5](https://www.youtube.com/watch?v=U7DeppyZh-g)
