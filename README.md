# Project Name

<br>



## Description

A platform where the users can track the most valuable cryptocurrencies in the market, adding they favorite to their watch list so they can keep an eye on it or adding to their portfolio the ones they currently have.




<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage and filter by type of restaurant, log in and sign up. 
- **sign up** - As a user I want to sign up on the web page so that I can add favorite restaurants to my list.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account
- **favorite list** - As a user I want to see the list of my favorite and delete them.
- **portfolio list** - As a user I want to see the list of their current coins and delete them.
- **edit user** - As a user I want to be able to edit my profile.
- **coin listing** - As a user I want to see more details of the restaurant, be able to call them and visit their website and save it as favorites.



<br>



## Server Routes (Back-end):



| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `index` view.                 |                                                          |
| `GET`      | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                          | Sends Sign Up info to the server and creates user in the DB. | {  email, password  }                                    |
| `GET`      | `/private/profile/`               | Private route. Render the `user-profile` view.                  |   
| `GET`      | `/private/profile/edit`            | Private route. Renders `edit-profile` form view.             |                                                          |
| `POST`      | `/private/profile/edit`            | Private route. Sends edit-profile info to server and updates user in DB. | {[firstName], [lastName], [imageUrl], [description] } |
| `GET`      | `/private/profile/watch-list`               | Private route. Render the `watchList`  view. User can add coins.| 
| `POST`      | `/private/profile/watch-list/`            | Private route. Sends `coinId` info to server and updates user in DB. | {[watchCoins] } |
| `GET`      | `/private/profile/watch-list/details`               | Private route. Render the `coinDetails`  view. User can add and delete coins.| 
| `GET`      | `/private/profile/portfolio/`               | Private route. Render the `portfolioList` view. Where users can choose to add new coins. Users can choose edit/see more details.|
| `GET`      | `/private/profile/portfolio/details/:id`               | Private route. Render the `coinDetails` view. User can edit the amount owned or delete the coin from the portfolio.|
| `POST`      | `/private/profile/portfolio/details/:id`            | Private route. Sends `amountOwned` info to server and updates user in DB. | {[amountOwned]} | 
| `GET`      | `/coins`               | Private route. Render the `coinsList` view.|
| `GET`     | `/coins/details/:id` |Private route. Display details from the `coinId` and if user is logged he can add coins to user portfolio or watchlist.|                                 |
| `POST`   | `/coins/details/:id` | Private route. Sends `coinId` info to server and updates user portfolio or watchlist in DB. |                                                   






## Models

User model

```javascript
{
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  picture: String,
  watchList: [coinId],
  portfolio: [coinId],
}

```



Coin model

```javascript
{
  image: String,
  name: String,
  description: String,
  marketCapRank: Number,
  value: Number,

}

```



<br>

## API's
https://www.coingecko.com/en/api/documentation
https://api.coingecko.com/api/v3/search/
https://api.coingecko.com/api/v3/simple/price?ids=BITCOIN&vs_currencies=EUR

<br>


## Packages
Ironlauncher
axios


<br>



## Backlog

[See the Trello board.](https://trello.com/b/2Soj9NIR/projeto-crypto)



<br>



## Links



### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/andrelisboapt/project-crypto)

[Deploy Link]()



<br>



### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)

### Contributors
André Lisboa - [`GitHub`](https://github.com/andrelisboapt) - [`LinkedIn`](https://www.linkedin.com/in/andrelisboapt/)

Maria Carvalho - [`GitHub`](https://github.com/miacsilva) - [`LinkedIn`](https://www.linkedin.com/in/maria-s-carvalho/)
