import React, { useEffect, useState } from "react";
// import BarChart from "./BarChart"
import StatisticsBox from "./StatisticsBox";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

const TransactionsDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [month, setMonth] = useState(0);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const queryString = `month=${
          month || ""
        }&page=${page}&perPage=${perPage}&search=${search}`;
        const response = await fetch(
          `http://localhost:5000/api/allTransactions?${queryString}`
        );
        if (!response.ok) {
          throw new Error(
            `Error fetching transactions: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        // console.log(data);
        setTransactions(data.transactions || []);
        setTotal(data.totalTransactions || 0);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    getTransactions();
  }, [month, page, search, perPage]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (direction) => {
    setPage((prevPage) => prevPage + direction);
  };

  const truncateDescription = (description, maxLength = 50) => {
    return description.length > maxLength
      ? description.slice(0, maxLength) + "..."
      : description;
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-center">Transactions</h3>

      <div className="flex flex-row border-2 justify-evenly py-2">
        <div className="flex justify-center">
          <input
            type="text"
            className="border border-gray-300 rounded-lg p-2 w-60"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="flex justify-center items-center">
          <label className="text-lg font-medium mr-4">Select Month:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index + 1}>
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Date of Sale
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Sold
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{item._id}</td>
                  <td className="px-6 py-4">
                    <img
                      src={item.image} // Make sure to replace `imageUrl` with your actual image field name
                      alt={item.title}
                      className="h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">
                    {truncateDescription(item.description)}
                  </td>
                  <td className="px-6 py-4">${item.price}</td>
                  <td className="px-6 py-4">
                    {new Date(item.dateOfSale).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.sold
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {item.sold ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4" colSpan="8">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={page <= 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={page >= Math.ceil(total / perPage)}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      <div className="mt-10">
        <StatisticsBox month={month} />
      </div>
      <div className="mt-10 flex justify-between">
        <BarChart month={month} />
        <PieChart month={month} />

      </div>

      <div className="mt-20">{/* <BarChart month={month}/> */}</div>
    </div>
  );
};

export default TransactionsDashboard;
