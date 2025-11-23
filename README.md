## 구현 내용

1. 적금 상품 목록 연동하기
2. 저축 목표 입력 기능 만들기
3. 적금 상품 목록에서 선택 기능 만들기
4. 계산 결과 탭 만들기

## 파일 구조

```
src/
├── App.tsx
├── main.tsx
├── api/
│   └── savingsApi.ts           # 적금 상품 API 호출
├── components/
│   ├── CalculationResult.tsx    # 계산 결과 컴포넌트
│   └── RecommendedProducts.tsx  # 추천 상품 컴포넌트
├── pages/
│   ├── Routes.tsx
│   └── SavingsCalculatorPage.tsx # 메인 계산기 페이지
├── types/
│   └── savings.ts              # 적금 상품 타입 정의
└── utils/
    └── format.ts               # 숫자 포맷팅 유틸리티
```

## 시작하기

```sh
yarn dev
```

## 개선하고 싶은 부분

### 1. 저축 기간 입력 방식 개선

현재 저축 기간 선택은 SelectBottomSheet를 통해 6개월, 12개월, 18개월, 24개월 중에서만 선택할 수 있습니다. 이를 범위 선택이 가능한 컴포넌트(Slider 등)로 변경하면 세밀한 기간 설정을 가능하게 하여 사용자 경험을 개선할 수 있을 것 같습니다.

### 2. 입력 값 검증 및 사용자 피드백 강화

현재는 목표 금액이나 예상 납입액을 입력하지 않고 "계산 결과" 탭을 클릭해도 별다른 안내가 없습니다. 입력 값이 누락된 경우 해당 TextField에 하이라이트 효과를 적용하고, 사용자에게 명확한 안내 메시지를 제공하면 더 나은 사용자 경험을 제공할 수 있을 것입니다.
