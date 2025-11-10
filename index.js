const bcrypt = require("bcryptjs");
const User = require("./module/userModule");
const express = require("express");
const dbConnect = require('./db/dbConnection');
const app = express()
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const Book = require("./module/booksModule");
const bookRouter = require ('./routes/bookRouter')

app.use(express.json())

dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use('/books', bookRouter);
app.post("/register", (request, response) => {


  console.log(request.body)

  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((e) => {
      console.log(e)
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

app.post("/login", (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      bcrypt.compare(request.body.password, user.password)
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }
          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
          });
          // res.cookie('token', jwtToken, {
          //   httpOnly: true,  // prevents JS access
          //   secure: true,
          //   sameSite: 'Strict',
          //   maxAge: 1000 * 60 * 60 // 1 hour
          // });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
})


// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
// app.get("/auth-endpoint", auth, (request, response) => {
//   const user = request.user;

//   const books = new Book({
//     name:"asdf",
//     author:"sadf",
//     updatedBy: user.userId,
//   })

//   response.json({ message: "You are authorized to access me" });
// });




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


