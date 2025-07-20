const { constants: http } = require("http2");
const {
  transactions,
  transaction_details: transactionDetails,
} = require("../models");

exports.bookingTickets = async function (req, res) {
  try {
    const userId = req.userId;
    const {
      amount,
      cinema,
      customerFullname,
      customerEmail,
      customerPhone,
      location,
      movieId,
      paymentMethodId,
      showDate,
      showTime,
      seats,
    } = req.body;

    if (
      !amount ||
      !cinema ||
      !customerFullname ||
      !customerEmail ||
      !customerPhone ||
      !location ||
      !movieId ||
      !paymentMethodId ||
      !showDate ||
      !showTime ||
      !seats
    ) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "All fields are required!",
      });
    }

    let transactionResult;
    try {
      transactionResult = await transactions.create({
        user_id: userId,
        amount: amount,
        cinema: cinema,
        customer_fullname: customerFullname,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        location: location,
        movie_id: movieId,
        payment_method_id: paymentMethodId,
        show_time: showTime,
        show_date: showDate,
      });

      if (!transactionResult) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Failed while booking tickets",
        });
      }

      const seatDetailPromises = seats.map((seat) => {
        return transactionDetails.create({
          seat: seat,
          transaction_id: transactionResult.id,
        });
      });

      await Promise.all(seatDetailPromises);

      return res.status(http.HTTP_STATUS_CREATED).json({
        success: true,
        message: "Tickets booked successfully!",
        data: {
          transactionId: transactionResult.id,
        },
      });
    } catch (err) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to book tickets. Please try again.",
        errors: err.message,
      });
    }
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "error while processing request.",
      errors: err.message,
    });
  }
};

exports.getTicketResult = async function (req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "you must login or register!",
      });
    }
    const trxParamsId = req.params.id;
    if (!trxParamsId) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "invalid transactions id!",
      });
    }

    const getTrx = await transactions.findOne({
      where: {
        user_id: userId,
        id: trxParamsId,
      },
    });

    const getTrxDetail = await transactionDetails.findAll({
      where: { transaction_id: getTrx.id },
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "get ticket result successfully!",
      results: {
        getTrx,
        seats: getTrxDetail,
      },
    });
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "error while processing request.",
      errors: err.message,
    });
  }
};

exports.getTransactionsHistory = async function (req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "you must login or register!",
      });
    }

    const getTrxHistory = await transactions.findAll({
      where: { user_id: parseInt(userId) },
      include: [
        {
          model: transactionDetails,
          as: "details", 
        },
      ],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "get transaction history successfully!",
      results: getTrxHistory
    });

  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "error while processing request.",
      errors: err.message,
    });
  }
};
