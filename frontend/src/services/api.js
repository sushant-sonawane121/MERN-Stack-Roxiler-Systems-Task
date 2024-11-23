// services/api.js

// Function to fetch transactions with pagination and search parameters
export const fetchTransactions = async (month, page, perPage = 10, search = "") => {
  const queryString = new URLSearchParams({
    month: month || "", // Default to empty if month is not provided
    page: page.toString(),
    perPage: perPage.toString(),
    search: search,
  }).toString();

  try {
    // Make a GET request using fetch
    
    
    // Log raw response details for debugging
    console.log("Response:", response);
    console.log("Response URL:", response.url);
    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers.get("content-type"));

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Error fetching transactions: ${response.status} - ${response.statusText}`);
    }

    // Check the content-type to ensure it's JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON response but received ${contentType}`);
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error.message);
    throw error;
  }
};
