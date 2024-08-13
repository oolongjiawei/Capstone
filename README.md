# Project Title
FORTUNE HOUSE
* Unlock Your Destiny Through the Four Pillars of Destiny *

## Overview
a website designed to help users gain insights into themselves through detailed descriptions based on their date of birth (and location). By generating a personalized chart using the Four Pillars of Destiny, users can reflect on their character, influences, and potential life trajectory.


### Problem
In today's fast+paced world, people seek quick, accessible ways to gain personal insights and guidance. Traditional fortune-telling methods are often time-consuming or geographically limited. Fortune House addresses this by offering immediate, personalized insights into various life aspects, including relationships, career, and personal growth, through a digital platform accessible anytime, anywhere.


### User Profile
+ Individuals interested in self-reflection and personal growth
+ Users seeking guidance on life decisions
+ People curious about Eastern philosophy and fortune-telling methods


### Features
+ Personalized fortune-telling based on birth date, time, and location.
+ Daily fortune cookies.
+ Users can create and manage their accounts to keep track of their daily fortune.
+ Mobile-responsive design.

All you need is your intuition and focus, and a couple of taps or mouse clicks. Whether you are doing this just for fun or choose to believe in the high magic – ENJOY!

## Implementation
### Tech Stack
+ React
+ SASS
+ MySQL 
+ Express
+ Client libraries: 
    + react
    + react+router
    + axios
+ Server libraries:
    + knex (firebase)
    + express


### APIs
+ OpenWeatherMap API for location-based weather data https://openweathermap.org/api
- Google Calendar API convert to lunar calanders


### Sitemap
+ register
+ login
+ home page /personal page (forturn cookies )
+ Bazi calculator page
+ Result Page

### Mockups
#### Register Page
![Image](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/register.jpeg)

#### Login Page
![Image](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/login.jpeg)
#### * Sorry, this img suppost to be the Login page

#### Home Page/ Personal Page 
![Image](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/home.jpeg)

#### Bazi Calculator Page
![Image](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/form.jpeg)

#### View Result Page
![Image](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/result.jpeg)
![Image](https://github.com/oolongjiawei/Capstone/blob/main/src/assets/img-proposal/result-popup.jpeg)

### Data
+ User data: Encrypted storage of personal information
+ Fortune data: Database of 60 Jia-Zi characteristics and corresponding suggestions
+ Data of fortune cookie sentences for random selection.


### Endpoints

**POST /user/register**
+ Logged in to start

Parameters:
+ email: User's email
+ user-name: User's email name
+ password: User's provided password

Response:
```
{
    "token": "xxx.xxx.xxx"
}
```

**POST /users/login**

+ Login a user

Parameters:
+ email: User's email
+ password: User's provided password

Response:
```
{
     "token": "xxx.xxx.xxx"
}
```

**GET /user/:id/fortune-tell**

+ Get fortune-tell data by submitting user's date of birth

Parameters:
+ name: user_name
+ day: user.birth_day,
+ month: user.birth_month,
+ year: user.birth_year,

Response:
```
{
    "id": int,
    "jia-zi": "Example Jia-Zi",
    "luckyColor": "Example Color",
    "suggestion": "Example Suggestion"
}
```
**POST /users/:id/furtune-cookie**

+ Draws a fortune cookie message and returns a random fortune cookie message.

Parameters:
+ No additional parameters required

Response:
```
{
    "fortune-cookie": "Here's your fortune cookie for today: Stay positive, and your efforts will be rewarded."
}
```

Detailed Description:
+ fortune-cookie: The content of the fortune cookie message returned. This message is randomly selected from a predefined list of fortune cookie sentences.

Notes:
+ Ensure that there is a predefined list or database of fortune cookie sentences for random selection.
+ Consider implementing a mechanism to update the fortune messages daily, ensuring that users receive a different message each day.
+ You may need to record the time when a user draws a fortune cookie to enforce a limit of one draw per day.

### Auth
Implement JWT authentication for secure access to user data.
Store JWT in localStorage and remove it upon logout.

## Roadmap

+ Create Client
Set up React project with routes and boilerplate pages.

+ Create Server
Set up Express project with routing and placeholder 
responses.

+ Create Migrations
Define database schema and seed initial data.

+ Implement Features
    + Fortune House: Implement calculation and display of fortune-telling data.
    + User Management: Implement user registration, login, and profile management.

+ Integrate APIs
Connect with Weather, and Calendar APIs.



+ Bug Fixes
Address any issues that arise during development and testing.

+ Implement responsive ui design
Add animations and transitions
Conduct usability testing and gather feedback
update readme.md

+ DEMO DAY


## Nice+to+haves

- Deploy Projects
Deploy client and server projects to reflect commits in production.

- Real time chat:
Offer an online chat window service (scoket.io) to talk to the fortune teller, help you solve specific problem.

- Enhanced Suggestions: 
Provide more detailed suggestions split by season.

- True Solar Time: 
Incorporate true solar time for more accurate calculations.

- Element Percentage: 
Calculate and display the percentage of each element in the user's chart.

- UI toggle button:
Display different UI states for day and night, and give it a toggle button.

- Google Calendar API update to integrate fortune reminders 

- Integration with social media for sharing fortunes

- show which celebrity share same birthday with u?




