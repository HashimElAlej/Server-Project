# News API

About the project:

This API serves to programmatically access application data, emulating a backend service. It provides essential information to the frontend architecture.

How to clone: Fork the repository using the gitHub feature 'fork', then copy the github respository link and use the command 'git clone ' in your terminal to successfully clone the respository

You will need to run:

-Postgres at a minimum version of 8.11.3 -Node at a minumum version of 20.8.1

Add the following as devDependencies:

-supertest -pg format -jest

Add these as dependencies:

-dotenv -express -pg

How to seed local database:

-Write the command 'npm run setup-dbs' to create a local database -Write the command 'npm run seed' to seed the local database.

How to run tests:

-Write 'npm run test' to run the tests in the test file.

When using this respository, create two .env files:

.env.development .env.test

These files with store the database:

PGDATABASE=nc_news (for .env.development) PGDATABASE=nc_news_news (for .env.test)

this will allow you to succesfully connect to the database's locally.


