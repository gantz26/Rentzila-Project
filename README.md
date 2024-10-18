# Summary

This repository contains automated tests for the Rentzila web site. The tests ensure the functionality of key website components across various sections. These include validation checks, UI interaction testing, and functional testing for form inputs, pagination, search features, map interaction, and filtering mechanisms.

## Requirements

The next requirements must be completed to run tests:
1. Install [Visual Studio code](https://code.visualstudio.com/)
2. Install [Node.js](https://nodejs.org/en) (version 20.x or higher)

## Steps to install, launch and creating a report

1. Make a copy of this repository:
```
git clone https://github.com/gantz26/Rentzila-Project.git
```

2. Open this folder in Visual Studio Code and install all dependencies:
```
npm ci
```

3. Create .env file and add necessary information to it:
```
ADMIN_EMAIL=<admin_email>
ADMIN_PASSWORD=<admin_password>

USER_EMAIL=<your_email>
USER_PASSWORD=<your_password>
USER_PHONE=<your_phone_number>

TEST_USER_EMAIL=<test_user_email>
TEST_USER_PASSWORD=<test_user_password>

BASE_URL=<base_url>
```

4. To run all the tests:
```
npm run test
```

5. To run individual test files, use the following commands:
```
npm run test:main
npm run test:login
npm run test:generalInfoTab
npm run test:photoTab
```

6. To generate and open a report:
```
npm run allure:generate
npm run allure:open
```