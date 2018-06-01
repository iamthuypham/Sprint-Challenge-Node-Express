# Review Questions

## What is Node.js?
Node.js is a Javascript runtime build on Chrome Javascript engine. Basically, with Node.js, we can create a backend and provide data to frontend application

## What is Express?
Express is a Node.js web application server framework.

## Mention two parts of Express that you learned about this week.
There are two main parts: routing & middleware

## What is Middleware?
Middleware functions allow to take action on any incoming request and modify it before sending back a response.

## What is a Resource?


## What can the API return to help clients know if a request was successful?
An Api can return a status code. For successful api call, it is 200

## How can we partition our application into sub-applications?
After initialize sub-application, we can use
```
app.use("/firstSubApp", sub1)
app.use("/secondSubApp", sub2)
```

## What is CORS and why do we need it?
CORS is cross origin resource sharing which allows a host to make request to another host and retrieve data. CORS helps preventing XSS
