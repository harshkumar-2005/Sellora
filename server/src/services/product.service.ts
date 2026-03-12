import prisma from "../lib/prisma.js";
import getPagination from "../utils/pagination.util.js";

type ProductInput = {
  name: string
  price: number
  stock: number
  description?: string
}

export const createProductService = async (data: ProductInput) => {
  return prisma.product.create({
    data,
  });
};

export const getProductService = async (page: number, limit: number) => {

  const { pages, limits, skip } = getPagination(page, limit);

  const products = await prisma.product.findMany({
    skip,
    take: limits,
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalProducts = await prisma.product.count();

  return {
    data: products,
    pagination: {
      page: pages,
      limit: limits,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limits)
    }
  };
};

export const getProductByIdService = async (id: number) => {
    //validation of the product id 
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

    return product;
};

export const updateProductService = async (id: number, data: ProductInput) => {
    //validation of the product id 
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }
  const updateProduct = prisma.product.update({
    where: { id },
    data,
  });

  // if id product is not present 
  
};

export const deleteProductService = async (id: number) => {
    //validation of the product id 
    if (isNaN(id)) {
      throw new Error("Invalid product ID");
    }
  return prisma.product.delete({
    where: { id },
  });
};

export const getAdminProductsService = async (page: number, limit: number) => {

  const { pages, limits, skip } = getPagination(page, limit);
  const products = await prisma.product.findMany({
    skip,
    take: limits,
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalProducts = await prisma.product.count();

  return {
    data: products,
    pagination: {
      page: pages,
      limit: limits,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limits)
    }
  };
};
