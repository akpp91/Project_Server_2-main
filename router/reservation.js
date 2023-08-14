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

//see all Booking -TSETED

router.get("/bookings", (req, res) => {
    const query = "SELECT * FROM Reservation";
    db.query(query, (error, result) => {
      if (error) 
      {
        console.log(error);

        res.status(500).json({ status: "error", error: "Failed to retrieve reservations" });
      } else {
        res.json({ status: "success", data: result });
      }
    });
  });


//Book a hotel room -TSETED
router.post("/book_Reservation", (request, response) => {
  const { userId, roomId, checkInDate, checkOutDate } = request.body;

  const statement = `
    INSERT INTO Reservation (user_id, room_number, check_in_date, check_out_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(statement, [userId, roomId, checkInDate, checkOutDate], (error, result) => {
    if (error) {
      console.log(error);

      response.status(500).json({ status: "error", error: "Failed to book the room" });
    } 
    else 
    {

      const bookingId = result.insertId;
      const bookingData = { bookingId, userId, roomId, checkInDate, checkOutDate };
      response.json({ status: "success", data: bookingData });
      console.log(bookingData);

    }
  });
});

router.get("/user_reservations/:userId", logRequest, (req, res) => {
  const userId = req.params.userId;

  const query = `
      SELECT R.reservation_id, R.check_in_date, R.check_out_date,
             R.room_number, RT.room_type, C.confirmation_id,
             C.amount, C.payment_date
      FROM Reservation AS R
      JOIN Room AS RT ON R.room_number = RT.room_number
      LEFT JOIN Confirmation AS C ON R.reservation_id = C.reservation_id
      WHERE R.user_id = ? AND
            R.check_in_date IS NOT NULL AND
            R.check_out_date IS NOT NULL AND
            RT.room_type IS NOT NULL AND
            C.confirmation_id IS NOT NULL AND
            C.amount IS NOT NULL AND
            C.payment_date IS NOT NULL;
  `;

  db.query(query, [userId], (error, result) => {
      if (error) {
          console.log(error);
          res.status(500).json({ status: "error", error: "Failed to retrieve user's reservations" });
      } else {
          console.log("Response Data:", result);
          res.json({ status: "success", data: result });
      }
  });
});

//fragemnt booking detail click - tested

router.get("/user_reservation/:userId/:reservationId", logRequest, (req, res) => {
  const userId = req.params.userId;
  const reservationId = req.params.reservationId;

  const query = `
    SELECT R.reservation_id, R.check_in_date, R.check_out_date,
           R.room_number, RT.room_type, C.confirmation_id,
           C.amount, C.payment_date
    FROM Reservation AS R
    JOIN Room AS RT ON R.room_number = RT.room_number
    LEFT JOIN Confirmation AS C ON R.reservation_id = C.reservation_id
    WHERE R.user_id = ? AND R.reservation_id = ? AND
          R.check_in_date IS NOT NULL AND
          R.check_out_date IS NOT NULL AND
          RT.room_type IS NOT NULL AND
          C.confirmation_id IS NOT NULL AND
          C.amount IS NOT NULL AND
          C.payment_date IS NOT NULL;
  `;

  db.query(query, [userId, reservationId], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: "Failed to retrieve reservation details" });
    } else {
      console.log("Response Data:", result);
      if (result.length === 0) {
        res.status(404).json({ status: "not_found", error: "Reservation not found" });
      } else {
        res.json({ status: "success", data: result });
      }
    }
  });
});


module.exports = router