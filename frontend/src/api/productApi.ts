import api from "./axios";
import type { Product, CategoryFilter, SortOption } from "../types/product";

export interface ProductsApiResponse {
  success: boolean;
  count: number;
  products: Product[];
}

export interface SingleProductApiResponse {
  success: boolean;
  product: Product;
}

export interface ProductFilterParams {
  category?: CategoryFilter;
  search?: string;
  sort?: SortOption;
}

/**
 * Fetch products from backend with optional category, search, or sort filters
 */
export const fetchProducts = async (
  params?: ProductFilterParams
): Promise<Product[]> => {
  const queryParams = new URLSearchParams();

  if (params?.category && params.category !== "all") {
    queryParams.append("category", params.category);
  }

  if (params?.search) {
    queryParams.append("search", params.search);
  }

  if (params?.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/products?${queryString}` : "/products";

  const response = await api.get<ProductsApiResponse>(url);
  return response.data.products;
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id: string): Promise<Product> => {
  const response = await api.get<SingleProductApiResponse>(`/products/${id}`);
  return response.data.product;
};

/**
 * Admin: Create a new product in MongoDB
 */
export const createProduct = async (
  productData: Partial<Product>
): Promise<Product> => {
  const response = await api.post<SingleProductApiResponse>(
    "/products",
    productData
  );
  return response.data.product;
};

/**
 * Admin: Update an existing product in MongoDB
 */
export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<Product> => {
  const response = await api.put<SingleProductApiResponse>(
    `/products/${id}`,
    productData
  );
  return response.data.product;
};

/**
 * Admin: Delete a product from MongoDB
 */
export const deleteProduct = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/products/${id}`
  );
  return response.data;
};

/**
 * Admin: Upload product image to Cloudinary via backend API
 */
export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ success: boolean; url: string }>(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.url;
};

