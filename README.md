# Campfire [a blogging app]

![home_page](/READMEscreenshots/loggedInHomePage.png)
![story_when_author_and_logged_in_user_are_same](/READMEscreenshots/singleStoryIsUser.png)
![story_when_not_logged_in_1](/READMEscreenshots/singleStoryNotUser.png)
![story_when_not_logged_in_2](/READMEscreenshots/singleStoryNotUserCont.png)

# What does the app do?

Campfire is my rendition of a blogging app. <br/>

Visitors can search for and read user-generated short stories. People that sign up can create, update and delete their own stories! [Click here for a walkthrough.](#walkthrough)

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

# Improvements

- Store images in cloud storage rather than locally in client/src/upload
- Better method to determine if a file is/is not an image (currently we are just checking if the file ends in .jpg or .png)
- Lazy load images and story cards for better UX
- More error handling for better UX
- Have users perform an email confirmation during registration
- Improve db schema by dropping redundant columns and using joins instead (user's username and user's id were saved for each story when a user's id would have sufficed)

# Walkthrough

Visitors can come and read all user-generated content. Infinite scrolling is used for pagination. <br/>
![home_page_logged_out](/READMEscreenshots/loggedOutHomePage.png)
<br/>
<br/>

View from a mobile device (iPhone Pro 12) <br/>
![mobile_version](/READMEscreenshots/iPhone12ProMobile.png)
<br/>
<br/>

If a visitor would like to submit content, they will need to register first. <br/>
![registration_page](/READMEscreenshots/registrationPage.png)
<br/>
<br/>

Formik components were used for validation and error handling. <br/>
![registration_page_validation_error](/READMEscreenshots/registrationPageFormValidation.png)
<br/>
<br/>

Once registered, they will be able to log in (Formik hooks were used for validation and error handling). <br/>
![login_page](/READMEscreenshots/logInPageFormValidation.png)
<br/>
<br/>

Upon successful log in, they will be able to submit their own content by clicking the emoji/icon next to the logout button. <br/>
![home_page_logged_in](/READMEscreenshots/loggedInHomePage.png)
<br/>
<br/>

Here, they can submit a title(required) and a story(required). React-quill provides a rich-text editor and the toolbar was customized a little to suit the project's need. Users can also submit a picture to go along with their story(optional). <br/>
![create_story](/READMEscreenshots/createStoryPage.png)
<br/>
<br/>

Errors for unsuccessful submits will be displayed at the top. If user's upload an incorrect file type (ie not a jpg or png) an error will be displayed along with how they want to resolute the error. <br/>
![create_story_failure](/READMEscreenshots/createStoryPageFailure.png)
<br/>
<br/>

On success a message will be displayed at the top and they will be redirected to home. <br/>
![create_story_success](/READMEscreenshots/createStoryPageSuccess.png)
<br/>
<br/>

If a user selects one of their own stories, there will be two buttons next to their name: one to edit the story and one to delete the story. <br/>
![single_story_user](/READMEscreenshots/singleStoryIsUser.png)
<br/>
<br/>

These buttons do NOT appear if the story does NOT belong to the currently signed in user (here, I am signed in as 'foo123' but the author of the story is 'bar123'). <br/>
![single_story_no_user](/READMEscreenshots/singleStoryNotUserNoPicture.png)
<br/>
<br/>

To delete: click on the red trashcan button > delete. <br/>
![delete_story_1](/READMEscreenshots/deleteStory.png)
<br/>
<br/>

To edit: click on the green edit button. You can change the title, content, delete the current picture(if there is one) and/or upload a new picture(only if you delete the current picture or the story had no picture to begin with). <br/>
![edit_story_form_w_image](/READMEscreenshots/editStoryFormWithImage.png)
![edit_story_form_w_image_confirm](/READMEscreenshots/editStoryFormWithImageConfirm.png)
![edit_story_form_w_image_confirm_result](/READMEscreenshots/editStoryFormWithImageConfirmResult.png)
![edit_story_form](/READMEscreenshots/editStoryForm.png)
<br/>
<br/>

On failure of edit story, an error message will be displayed on top and users can re-edit to fix any issues/upload an image of proper file type. <br/>
![edit_story_failure](/READMEscreenshots/editStoryFailure.png)
<br/>
<br/>

On success of edit story, a success message will be displayed on top and users will be taken back to the home screen. <br/>
![edit_story_success](/READMEscreenshots/editStorySuccess.png)
![edit_story_result](/READMEscreenshots/editStoryResult.png)
<br/>
<br/>

There is also a search bar to search for titles or specific words found in content. <br/>
![search_bar](/READMEscreenshots/searchFeature.png)
<br/>
<br/>

You can also view all stories published by a specific user. <br/>
![user_page](/READMEscreenshots/userPage.png)
<br/>
<br/>

If the user does not exist or a specific user does not have stories, this message will appear. <br/>
![user_page_no_stories](/READMEscreenshots/userPageNoUserOrNoStories.png)
