import { ListRow, colors, Spacing } from 'tosslib';
import type { SavingsProduct } from '../types/savings';
import { parseFormattedNumber } from '../utils/format';

interface CalculationResultProps {
  selectedProduct: SavingsProduct | null;
  targetAmount: string;
  monthlyAmount: string;
  savingsTerms: number;
}

export function CalculationResult({
  selectedProduct,
  targetAmount,
  monthlyAmount,
  savingsTerms,
}: CalculationResultProps) {
  const calculateExpectedReturn = (): number => {
    if (!selectedProduct || !monthlyAmount) {
      return 0;
    }

    const monthlyAmountNumber = parseFormattedNumber(monthlyAmount);
    const annualRate = selectedProduct.annualRate / 100;

    return monthlyAmountNumber * savingsTerms * (1 + annualRate * 0.5);
  };

  const calculateDifferenceFromTarget = (): number => {
    if (!targetAmount) {
      return 0;
    }

    const targetAmountNumber = parseFormattedNumber(targetAmount);
    const expectedReturn = calculateExpectedReturn();

    return targetAmountNumber - expectedReturn;
  };

  const calculateRecommendedMonthly = (): number => {
    if (!selectedProduct || !targetAmount) {
      return 0;
    }

    const targetAmountNumber = parseFormattedNumber(targetAmount);
    const annualRate = selectedProduct.annualRate / 100;

    const rawAmount = targetAmountNumber / (savingsTerms * (1 + annualRate * 0.5));

    return Math.round(rawAmount / 1000) * 1000;
  };

  return (
    <>
      <Spacing size={8} />
      {!selectedProduct ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      ) : (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${calculateExpectedReturn().toLocaleString()}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="목표 금액과의 차이"
                topProps={{ color: colors.grey600 }}
                bottom={`${calculateDifferenceFromTarget().toLocaleString()}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="추천 월 납입 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${calculateRecommendedMonthly().toLocaleString()}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
        </>
      )}
    </>
  );
}
