# This is my Fleet project

## Tech stack - 
         1. React for Frontend (Additionally, used BootStrap 4 and FontAwesomeIcon for styling)
         2. Node and Express for Backend
         3. MongoDB as Database
         
## Summary of App:
         - There is some JSON data about companies stored in the database in the 'companies' schema
         - On loading, the frontend makes a GET request to backend API to fetch the data stored
         - The frontend then groups the data by company name and displays it to user in the form of cards
         - User can search for a service by company name and the mode type
         - User can also update/edit a specific company's website and description
        
## Directory Structure:
         - The Backend code is under the backend folder (server.js is the main file there)
         - The Frontend code is under the src folder (App.js is the main file there)
         
## To Run the app:
         1. First in the project directory, run command "npm install"
         1. Then go into the backend folder using command 'cd backend' 
         2. Next start the server using command 'nodemon server' (server opens at http://localhost:5000)
         3. Then start the frontend by running the command 'npm start' in the project's root directory (web opens at http://localhost:3000)
         
         There you go, my app will get running in no time!!
