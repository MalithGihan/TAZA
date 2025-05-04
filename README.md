# 🌍 TAZA

A React web app to explore countries by their spoken languages. Users can search, view country details, browse popular languages, and paginate through results.

This is a web application that allows users to explore countries. The application provides functionality to search for countries based on Name, language, Religion, Population, Capital view a list of countries, paginate through results, and view detailed country information. Also have future as Live world and login facilities for unlock more fetuses.

![Home Screen](./frontend/src/assets/Screenshot%202025-05-03%20195721.png)

---

## 🔗 Live App

[Visit from here - https://tazalive.vercel.app/](https://tazalive.vercel.app/)

---

## 🚀 Features

- 🔍 Search countries by language.
- 🌐 View country details (capital, population, flag, etc.)
- 📜 Popular languages quick list.
- ⏱ Search history with suggestions.
- 📄 Paginated result view.
- 🎨 Responsive Tailwind-styled UI.

---

## Tech Stack

- **React**: Frontend framework used to build the application.
- **Node**: Backend framework used to build the application.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Jest**: For running unit tests and clearing Jest cache.
- **Lucide Icons**: For beautiful and customizable icons like Search, Globe, etc.- **Axios/Fetch**: For making API calls to retrieve country data.

---

## ⚙️ Local Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-IT22352330.git
   ```
3. Go to your file directory for backend and frontend separately ->  (eg. cd .\project-IT22352330\backend and cd .\project-IT22352330\frontend )

2. Install dependencies
   
   ```bash
    npm install
   ```
   
3. Add your Mongo Database url for .env file in backend

4. Run the frontend app
   
   ```bash
    npm dev build 
    npm run start
   ```

5. Run the backend
   
    ```bash
    npm run dev
   ```
---

## 🧪 Running Tests

To run unit tests 

 ```bash
  npm run test
 ```
---

## 🎯 Chosen APIs for build the frontend data management

1.  https://restcountries.com/v3.1/all - Fetch all countries and its information

2.  https://restcountries.com/v3.1/name/{name} -Fetch specific country using the name like using the search function

3.  https://restcountries.com/v3.1/lang/{language} - Fetch filter countries by Language

4.  https://restcountries.com/v3.1/region/{region} - Fetch filter countries by Region

Note: RTK Query was utilized for data fetching and caching, please refer the file "src/app/quaries/useAllCountries.js" found in the frontend api folder for further reference

---

### Challenges Faced and Resolution

- Hard to find time for build the website and achive other requirements.
- Due to heavy usage of the REST Countries API, the server has kept crashing serveral times thoughout the project.
- Used a another hosting server to deploy the backend services 

---

## 🔑 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication and authorization.

---

## 🪪 License

This project is licensed under the MIT License.

---

### Contact me
 
For any inquiries, feel free to reach out via:

Email: malithgihan099@gmail.com\


