const express = require("express")
const db = require("../db")
const utils = require("../utils")



const router = express.Router()

<<<<<<< HEAD
// Middleware function to log request details
function logRequest(req, res, next) {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log("Request Body:", req.body);
  next();
}
=======
>>>>>>> 98521b4 (server 2 android)

router.post("/register", (request, response) => {
  const { firstName, lastName, email, phoneNumber, password } = request.body;
  const role = "user"; // Assuming a default role of "user"

  console.log("First Name:", firstName,lastName, email, phoneNumber, password );
  db.query(
    "INSERT INTO User (firstName, lastName, Role, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?)",
    [firstName, lastName, role, email, phoneNumber, password],
    (error, result) => {
      response.send(utils.createResult(error, result));
    }
  );
});

router.post("/login", (request, response) => {
  const { email, password } = request.body
  const statement = "SELECT * FROM User WHERE email=? and password=?"
  console.log(email);
  console.log(password);

  db.query(statement, [email, password], (error, result) => {
    console.log(result);
    console.log(error);

    response.send(utils
      .createResult(error, result))
  })
})


//all users DON TESTING
router.get("/all", (request, response) => {
  const statement = "SELECT * FROM User";
  db.query(statement, (error, result) => {
    console.log(result);
    response.send(utils.createResult(error, result));
  });
});

<<<<<<< HEAD
// User Profile Retrieval
router.get("/:id", logRequest , (req, res) => {
=======
// User Profile Retrieval-done testing
router.get("/:id", (req, res) => {
>>>>>>> 98521b4 (server 2 android)
  console.log("inside get of profile Retrival");
  const userId = req.params.id;
  
  console.log(userId);

  const statement = `
<<<<<<< HEAD
  select * from User where user_id = ?
=======
    SELECT user_id, firstName, lastName, email, phoneNumber
    FROM User
    WHERE user_id = ?
>>>>>>> 98521b4 (server 2 android)
  `;

  db.query(statement, [userId], (error, result) => {

    if (error) {
      res.status(500).json({ status: "error", error: "Failed to retrieve user profile" });
    } else {
      if (result.length > 0) {
        const userProfile = result[0];
        res.json({ status: "success", data: userProfile });
      } else {
        res.status(404).json({ status: "error", error: "User not found" });
      }
    }
  });
});



// User Profile Update - testing done
<<<<<<< HEAD
router.put("/update/:id", logRequest, (req, res) => 
{
=======
router.put("/update/:id", (req, res) => {
>>>>>>> 98521b4 (server 2 android)
  console.log("inside User Profile Update");

  const userId = req.params.id;
  const { firstName, lastName, email, phoneNumber } = req.body;

  const statement = `
    UPDATE User
    SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?
    WHERE user_id = ?
  `;

  db.query(statement, [firstName, lastName, email, phoneNumber, userId], (error, result) => {
    if (error) {
      res.status(500).json({ status: "error", error: "Failed to update user profile" });
    } else {
      if (result.affectedRows > 0) {
        const userProfile = { userId, firstName, lastName, email };
        res.json({ status: "success", data: userProfile });
      } else {
        res.status(404).json({ status: "error", error: "User not found" });
      }
    }
  });
<<<<<<< HEAD


});


// Request to update password
router.put("/change_password/:id", logRequest, (req, resp) => {
  console.log("inside change password");
  console.log("inside change password");

  const user_id = req.params.id;
  const { password } = req.body;

  const statement = `
    UPDATE User
    SET password = ?
    WHERE user_id = ?
  `; 
 
  db.query(statement, [password, user_id], (error, result) => {
    if (error) {
      resp.status(500).json({ status: "error", error: "Failed to update user's password" });
    } else {
      if (result.affectedRows > 0) {
        resp.json({ status: "success", message: "Password updated successfully" });
      } else {
        resp.status(404).json({ status: "error", error: "User not found" }); 
      }
    }
  });
});
 
=======
});


>>>>>>> 98521b4 (server 2 android)


module.exports = router
