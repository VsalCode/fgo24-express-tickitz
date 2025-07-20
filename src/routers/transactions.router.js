const transactionsRouter = require("express").Router(); 
const transactionsController = require("../controllers/transactions.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

transactionsRouter.post("", verifyToken, transactionsController.bookingTickets );
transactionsRouter.get("/history", verifyToken, transactionsController.getTransactionsHistory );
transactionsRouter.get("/:id", verifyToken, transactionsController.getTicketResult );

module.exports = transactionsRouter;