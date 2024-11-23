const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET: List all transactions with search
router.get("/allTransactions", async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10, month } = req.query;

    const query = {};

    // Build search query if a search term is provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: { $regex: search, $options: "i" } },
      ];
    }

    // Check if a month is provided
    if (month) {
      const currentYear = new Date().getFullYear(); // Get current year
      const startDate = new Date(currentYear, month - 1, 1); // First day of the month
      const endDate = new Date(currentYear, month, 0); // Last day of the month

      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);

      query.dateOfSale = {
        $gte: startDate, // Greater than or equal to the start date
        $lte: endDate, // Less than or equal to the end date
      };
    }

    console.log("Query:", query); // Log the query

    const pageNumber = parseInt(page, 10);
    const limit = parseInt(perPage, 10);
    const skip = (pageNumber - 1) * limit;

    // Fetch transactions with pagination and search query
    const transactions = await Transaction.find(query).skip(skip).limit(limit);
    const totalTransactions = await Transaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    // Return the transactions along with pagination information
    res.status(200).json({
      transactions,
      totalTransactions,
      totalPages,
      currentPage: pageNumber,
      perPage: limit,
    });
  } catch (error) {
    console.error("Failed to get transactions:", error.message);
    res.status(500).json({ message: "Failed to get transactions", error });
  }
});

// GET: Statistics API
router.get("/statistics", async (req, res) => {
  try {
    const { month } = req.query; // Extract the month from the query parameters
    let totalSaleAmount = 0;
    let totalSoldItems = 0;
    let totalNotSoldItems = 0;

    // Check if the month is a valid number between 1 and 12
    if (!month || isNaN(month) || month > 12) {
      return res.status(400).json({
        message:
          "Invalid month provided. Month should be a number between 1 and 12.",
      });
    }

    // Convert month to a number
    const monthNumber = parseInt(month, 10);

    if (month === 0 || month < 1) {
      const statistics = await Transaction.find({}); // Fetch all transactions
      return res.status(200).json({
        data: statistics,
        totalSaleAmount: statistics.reduce(
          (sum, item) => sum + (item.price || 0),
          0
        ),
        totalSoldItems: statistics.filter((item) => item.sold).length,
        totalNotSoldItems: statistics.filter((item) => !item.sold).length,
      });
    }
    // Fetch documents where the month of dateOfSale matches the provided month
    const statistics = await Transaction.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      },
    });

    if (statistics.length === 0) {
      return res.status(200).json({
        message: "No sales found for the specified month.",
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
      });
    }

    for (let i = 0; i < statistics.length; i++) {
      if (statistics[i].sold === true) {
        totalSoldItems++;
        totalSaleAmount += statistics[i].price || 0;
      }
      if (statistics[i].sold === false) {
        totalNotSoldItems++;
      }
    }

    res.status(200).json({
      data: statistics,
      totalSaleAmount: totalSaleAmount,
      totalSoldItems: totalSoldItems,
      totalNotSoldItems: totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get statistics", error });
    console.error(error);
  }
});

// GET: Bar Chart Data API
router.get("/barChartData", async (req, res) => {
  const month = parseInt(req.query.month, 10); // Get the month from the query

  if (month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month" });
  }

  try {
    // Aggregate the transactions to group by price ranges
    const barChartData = await Transaction.aggregate([
      {
        $match: {
          // Match documents where the month of the dateOfSale field matches the provided month
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price", // Group by price
          boundaries: [0, 10, 20, 30, 40, 50, 100, 200, 500, 1000], // Define the price ranges
          default: "Other", // Group all other prices into 'Other'
          output: {
            count: { $sum: 1 }, // Count the number of items in each range
          },
        },
      },
    ]);

    // Transform the result into a suitable format for the chart
    const formattedData = {};
    barChartData.forEach((item) => {
      formattedData[item._id] = item.count; // Assign count to each price range
    });

    return res.json(formattedData); // Send the data as JSON
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET: Pie Chart Data API
router.get("/pieChartData", async (req, res) => {
  const month = parseInt(req.query.month); // Get month from query parameter
  console.log("Requested month:", month);

  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: "Invalid month provided" });
  }

  try {
    const data = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month], // Assuming 'date' field exists
          },
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          count: { $sum: 1 }, // Count items in each category
        },
      },
    ]);

    console.log("Aggregated data:", data); // Log the aggregated data

    // Transform data into required format
    const pieData = {};
    data.forEach((item) => {
      pieData[item._id] = item.count; // _id is the category name
    });

    return res.json(pieData); // Send back the data
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    return res.status(500).json({ error: "Failed to fetch pie chart data" });
  }
});

module.exports = router;
