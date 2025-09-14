import axios from "axios";

const API_URL = "https://dummyjson.com/products";

export const fetchProducts = async (skip = 0, limit = 10, search = "", category = "") => {
  let url = `${API_URL}?limit=${limit}&skip=${skip}`;

  if (search) {
    url = `${API_URL}/search?q=${search}&limit=${limit}&skip=${skip}`;
  }

  if (category) {
    url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
  }

  const response = await axios.get(url);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get("https://dummyjson.com/products/categories");
  return response.data;
};
