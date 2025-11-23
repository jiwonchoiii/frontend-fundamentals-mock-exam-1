import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { useEffect, useState } from 'react';
import type { SavingsProduct } from '../types/savings';
import { getSavingsProducts } from '../api/savingsApi';
import { formatNumber, parseFormattedNumber } from '../utils/format';
import { CalculationResult } from '../components/CalculationResult';
import { RecommendedProducts } from '../components/RecommendedProducts';

export function SavingsCalculatorPage() {
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [savingsTerms, setSavingsTerms] = useState<number>(12);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'results'>('products');

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setTargetAmount(formattedValue);
  };

  const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumber(e.target.value);
    setMonthlyAmount(formattedValue);
  };

  const handleProductSelect = (product: SavingsProduct) => {
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'products' | 'results');
  };

  const filteredProducts = products.filter(product => {
    if (monthlyAmount) {
      const monthlyAmountNumber = parseFormattedNumber(monthlyAmount);
      if (monthlyAmountNumber < product.minMonthlyAmount || monthlyAmountNumber > product.maxMonthlyAmount) {
        return false;
      }
    }

    if (product.availableTerms !== savingsTerms) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getSavingsProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={handleTargetAmountChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={handleMonthlyAmountChange}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsTerms}
        onChange={setSavingsTerms}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === 'products' ? (
        <>
          {loading ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오고 있어요" />} />
          ) : error ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top={error} />} />
          ) : filteredProducts.length === 0 ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없어요" />} />
          ) : (
            filteredProducts.map(product => (
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
                onClick={() => handleProductSelect(product)}
              />
            ))
          )}
        </>
      ) : (
        <>
          <CalculationResult
            selectedProduct={selectedProduct}
            targetAmount={targetAmount}
            monthlyAmount={monthlyAmount}
            savingsTerms={savingsTerms}
          />
          <Border height={16} />
          <RecommendedProducts
            allProducts={products}
            monthlyAmount={monthlyAmount}
            savingsTerms={savingsTerms}
            selectedProduct={selectedProduct}
            onProductSelect={handleProductSelect}
          />
        </>
      )}
    </>
  );
}
