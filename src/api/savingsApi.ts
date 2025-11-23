import { http, isHttpError } from 'tosslib';
import type { SavingsProduct } from '../types/savings';

export async function getSavingsProducts(): Promise<SavingsProduct[]> {
  try {
    const response = await http.get<SavingsProduct[]>('/api/savings-products');
    return response;
  } catch (error) {
    if (isHttpError(error)) {
      console.error('API error:', error.message);
      throw new Error(error.message);
    }
    console.error('Unknown error:', error);
    throw new Error('적금 상품 목록을 불러오는 중 오류가 발생했어요.');
  }
}
