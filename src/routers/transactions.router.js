const transactionsRouter = require("express").Router(); 
const transactionsController = require("../controllers/transactions.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

transactionsRouter.post("", verifyToken, transactionsController.bookingTickets );

module.exports = transactionsRouter;