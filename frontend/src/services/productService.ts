import axios from 'axios';
import { Product, CreateProductDto, UpdateProductDto } from '../types';

const API_BASE_URL = 'http://localhost:3000/products';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Product> {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  async create(product: CreateProductDto): Promise<Product> {
    try {
      const response = await api.post('', product);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  async update(id: number, product: UpdateProductDto): Promise<Product> {
    try {
      const response = await api.patch(`/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  async search(query: string): Promise<Product[]> {
    try {
      const response = await api.get(`?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
      throw error;
    }
  },
};