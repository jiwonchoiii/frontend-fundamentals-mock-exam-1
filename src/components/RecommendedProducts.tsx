import { Assets, ListHeader, ListRow, colors, Spacing } from 'tosslib';
import type { SavingsProduct } from '../types/savings';
import { parseFormattedNumber } from '../utils/format';

interface RecommendedProductsProps {
  allProducts: SavingsProduct[];
  monthlyAmount: string;
  savingsTerms: number;
  selectedProduct: SavingsProduct | null;
  onProductSelect: (product: SavingsProduct) => void;
}

export function RecommendedProducts({
  allProducts,
  monthlyAmount,
  savingsTerms,
  selectedProduct,
  onProductSelect,
}: RecommendedProductsProps) {
  const getRecommendedProducts = (): SavingsProduct[] => {
    const filteredProducts = allProducts.filter(product => {
      if (product.availableTerms !== savingsTerms) {
        return false;
      }

      if (monthlyAmount) {
        const monthlyAmountNumber = parseFormattedNumber(monthlyAmount);
        if (monthlyAmountNumber < product.minMonthlyAmount || monthlyAmountNumber > product.maxMonthlyAmount) {
          return false;
        }
      }

      return true;
    });

    return filteredProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  };

  const recommendedProducts = getRecommendedProducts();

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <>
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={
            selectedProduct?.id === product.id ? (
              <Assets.Icon name="icon-check-circle-green" />
            ) : (
              <Assets.Icon name="icon-check-circle-grey" />
            )
          }
          onClick={() => onProductSelect(product)}
        />
      ))}
    </>
  );
}
