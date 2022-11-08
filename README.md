# Campfire [a blogging app]

![home_page](/READMEscreenshots/loggedInHomePage.png)
![story_when_author_and_logged_in_user_are_same](/READMEscreenshots/singleStoryIsUser.png)
![story_when_not_logged_in_1](/READMEscreenshots/singleStoryNotUser.png)
![story_when_not_logged_in_2](/READMEscreenshots/singleStoryNotUserCont.png)

# What does the app do?

Visitors can search for and read user-generated content. People that sign up can create, update and delete their own content! [Click here for a more in-depth walkthrough](#walkthrough)

# Features

- MySQL database to hold user information and user-generated content
- Custom models to perform CRUD operations and queries on the database
- Backend routes for creating users, authorizing users, and performing CRUD operations
- Encrypted passwords are saved to database
- Protecting backend routes via middleware that verifies JSONWebTokens
- Issues access tokens and refresh tokens to users upon successful log in
- Uploading images (stored in the client directory)
- Using React for responsiveness
- Conditionally renders CSS (ex custom buttons are 'greyed out' when disabled=true)
- User login and registration
- Authentication and authorization
- Forms created using pure JSX, Formik components, and Formik Hooks
- Persistent login between refresh of the browser or navigating away from the website
- Infinite scrolling for pagination
- Automatic refresh of expired access tokens
- Protecting frontend components/fontend resources by checking user's current auth state
- Utilizing a rich text editor and displaying the HTML
- Creating global state via Context API
- Custom Hooks
- CSS modules
- Handling communication between frontend and backend via axios
- Proper code splitting and file-folder structure
- And much more!

# Technologies

- MySQL, MySQL workbench
- NodeJS, Express
- React
- Libraries of note: mysql2, multer, jsonwebtoken, bcrypt, cookie-parser, cors, axios, formik, react-quill, react-router-dom, dompurify, Context API

# Goals

- Work with a SQL database
- Create a backend REST api that will perform CRUD operations on a SQL database
- Create custom models that will query a SQL database
- Familiarize myself with JWTs
- Learn how to persistently login users
- Learn how to paginate/create an infinite scroll
- Learn about authentication and authorization
- Use the MySERN stack to develop a complete application
- Proper code splitting and file-folder structure
- Handling user registration and login
- Frontend and backend error handling
- Frontend-backend-database communication
- Use pure CSS to style the website and create responsive web design
- Conditionally rendering CSS
- OOP
- And much more!

# Walkthrough
