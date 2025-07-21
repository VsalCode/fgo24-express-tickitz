const transactionsRouter = require("express").Router(); 
const transactionsController = require("../controllers/transactions.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const bookingSchema = require("../schemas/bookingValidation");

transactionsRouter.post("", verifyToken, bookingSchema, transactionsController.bookingTickets );
transactionsRouter.get("/history", verifyToken, transactionsController.getTransactionsHistory );
transactionsRouter.get("/payments", transactionsController.getPaymentMethods );
transactionsRouter.get("/:id", verifyToken, transactionsController.getTicketResult );

module.exports = transactionsRouter;