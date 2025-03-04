# book-review

[https://book-review-api.vercel.app](https://book-review-api.vercel.app)

[postman Documentation](https://www.postman.com/cloudy-zodiac-773656/workspace/book-review/collection/32710039-3b81d5d1-61b7-49c1-a4c9-d151b12b28e0?action=share&creator=32710039)

## Installation

1. Run below command to install all dependencies.
```bash
npm i 
```

2. add `MONGODB_URI` and `JWT_SECRET` to `.env` file

3. run below command to run application.
```bash
npm start
```

## API routes

1. `api/fetch-books` *GET*
   - add or update books in database
   - will be used by schedular

2. `api/reviews` *POST*
   - Create Review
   - body : {book_id,rating,comment}

3. `api/reviews/:id` *DELETE*
    - Delete Single Review
    - id : review id

4. `api/reviews/:id` *PUT*
   - Update Single Review
   - id : review id
   - body : {rating,comment}


5. `api/reviews` *GET*
   - Get All Reviews
   - pagination can be used by mentioning `page` and `size` in query strings

6. `api/reviews/:id` *GET*
    - Get Single Review
    - id : review id

7. `api/reviews/GetByBookId/:bookId` *GET*
   - Get All Reviews By Book Id
   - pagination can be used by mentioning `page` and `size` in query strings

8. `api/reviews/GetByLoggedInUser` *GET*
   - Get All Reviews By LoggedIn User
   - pagination can be used by mentioning `page` and `size` in query strings

9. `api/auth/login` *POST*
   - Login
   - body : {email,password}
   - response : {user,token}
  
10. `api/auth/register` *POST*
    - Register
    - body : {username,email,password}
    - response : {user,token}

11. `api/books` *GET*
    - Get All Books
    - pagination can be used by mentioning `page` and `size` in query strings
    - sort books by `id` or `title` in query strings (default `id`)

12. `api/books/search` *GET*
    - Search Books
    - pagination can be used by mentioning `page` and `size` in query strings
  