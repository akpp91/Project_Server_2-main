const express = require("express")
const db = require("../db")
const utils = require("../utils")



const router = express.Router()

// Middleware function to log request details
function logRequest(req, res, next) {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log("Request Body:", req.body);
  next();
}

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

// User Profile Retrieval
router.get("/:id", logRequest , (req, res) => {
  console.log("inside get of profile Retrival");
  const userId = req.params.id;
  
  console.log(userId);

  const statement = `
    SELECT user_id, firstName, lastName, email, phoneNumber
    FROM User
    WHERE user_id = ?
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




module.exports = router
