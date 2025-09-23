# 📊 Tích hợp API Chứng khoán Real-time

## 🌟 Tổng quan

SecuriTest đã được tích hợp với các nguồn dữ liệu chứng khoán uy tín để cung cấp thông tin thị trường thực tế cho việc ôn tập.

## 📡 Các nguồn API được sử dụng

### 1. **SSI API** (Chính - Miễn phí)

- **URL:** `https://fc-data.ssi.com.vn/api/v2`
- **Ưu điểm:** Dữ liệu đầy đủ, reliable, từ công ty chứng khoán SSI
- **Dữ liệu:** VN-INDEX, HNX-INDEX, top stocks, market breadth
- **Rate limit:** 1000 requests/hour (miễn phí)

### 2. **TCBS API** (Backup - Miễn phí)

- **URL:** `https://apipubaws.tcbs.com.vn`
- **Ưu điểm:** API ổn định của Techcombank Securities
- **Dữ liệu:** Market overview, stock fundamentals
- **Rate limit:** 500 requests/hour

### 3. **VPS API** (Premium - Có phí)

- **URL:** `https://market.vps.com.vn/api`
- **Ưu điểm:** Dữ liệu real-time, độ trễ thấp
- **Chi phí:** 500,000 VNĐ/tháng
- **Dữ liệu:** Tick data, order book, intraday charts

### 4. **Yahoo Finance** (International Backup)

- **URL:** `https://query1.finance.yahoo.com/v8/finance/chart`
- **Ưu điểm:** Stable, global coverage
- **Dữ liệu:** Major Vietnamese indices với suffix .VN

## 🔧 Cấu trúc Technical

### API Service Layer

```typescript
// /src/services/stockApi.ts
class StockApiService {
  - getMarketDataFromSSI()     // Primary source
  - getMarketDataFromTCBS()    // Backup source
  - getFallbackData()          // Realistic mock data
  - getStockData(symbol)       // Individual stock
}
```

### React Hooks

```typescript
// /src/hooks/useStockData.ts
-useStockData() - // Market overview với auto-refresh
  useStockPrice() - // Individual stock price
  useTickerData() - // Fast ticker refresh
  useMarketStats(); // Market statistics
```

### Components

```typescript
// /src/components/common/
-(<StockTicker />) - // Scrolling price banner
  <MarketData /> - // Market overview với charts
  <TopStocks />; // Top gainers/losers/active
```

## 📈 Dữ liệu được hiển thị

### 1. **Market Indices**

- VN-INDEX: Giá trị, thay đổi, % thay đổi
- HNX-INDEX: Chỉ số sàn Hà Nội
- UPCOM: Chỉ số thị trường ngoại sàn

### 2. **Top Stocks**

- **Most Active:** Cổ phiếu có thanh khoản cao nhất
- **Top Gainers:** Tăng giá mạnh nhất
- **Top Losers:** Giảm giá nhiều nhất
- **Blue Chips:** VIC, VCB, TCB, HPG, GAS, MSN, VHM, VNM

### 3. **Market Statistics**

- Tổng khối lượng giao dịch (KLGD)
- Tổng giá trị giao dịch (GTGD)
- Số mã tăng/giảm/đứng giá
- Dòng tiền ngoại

### 4. **Technical Indicators**

- P/E ratio thị trường
- P/B ratio thị trường
- ROE trung bình
- Dividend yield

## ⚙️ Cấu hình Refresh

```typescript
const REFRESH_INTERVALS = {
  TICKER: 10000, // 10 giây - ticker banner
  MARKET_DATA: 30000, // 30 giây - market overview
  TOP_STOCKS: 60000, // 1 phút - top stocks
  STATS: 60000, // 1 phút - market stats
};
```

## 🛡️ Error Handling & Fallback

### Chiến lược Fallback

1. **Primary:** SSI API (most comprehensive)
2. **Secondary:** TCBS API (reliable backup)
3. **Tertiary:** Realistic mock data (with time simulation)

### Error States

- Loading skeletons trong khi fetch data
- Error banners với retry buttons
- Graceful degradation to mock data
- Offline indicators

## 🔒 Rate Limiting & Optimization

### Caching Strategy

```typescript
- Local caching với TTL
- Debounced API calls
- Background refresh
- Stale-while-revalidate pattern
```

### Performance

- Parallel API calls khi có thể
- Request deduplication
- Efficient re-renders với React.memo
- Virtualization cho large datasets

## 📊 Data Accuracy

### Validation

- Cross-validation giữa multiple sources
- Sanity checks cho price movements (>10% change alerts)
- Timestamp validation
- Missing data interpolation

### Realistic Simulation

Khi không có API data, system generate realistic simulation:

- Random walk với constraints
- Realistic trading hours
- Market correlation patterns
- Volume-price relationships

## 🚀 Production Deployment

### Environment Variables

```bash
# Primary APIs
NEXT_PUBLIC_SSI_API_KEY=your_ssi_key
TCBS_API_TOKEN=your_tcbs_token

# Premium APIs (optional)
VPS_API_KEY=your_vps_key
VPS_SECRET=your_vps_secret

# Fallback config
ENABLE_MOCK_DATA=false
MOCK_MARKET_TREND=positive
```

### Monitoring

- API uptime monitoring
- Response time tracking
- Error rate alerting
- Data quality metrics

## 📱 Mobile Optimization

- Responsive charts với SVG
- Touch-friendly interactions
- Reduced data usage
- Offline caching

## 🔮 Future Enhancements

### Planned Features

1. **Real-time WebSocket** connections
2. **Historical data** charts
3. **News integration** từ các nguồn tin tức CK
4. **Portfolio tracking** với real prices
5. **Price alerts** và notifications
6. **Technical analysis** indicators
7. **Options & derivatives** data

### API Wishlist

- **HSX API** (official exchange API)
- **Bloomberg Terminal** integration
- **Refinitiv** data feeds
- **FiinTrade** professional data

---

✨ **Kết quả:** Website hiện có dữ liệu thị trường thực tế, cập nhật liên tục, giúp học viên ôn tập với thông tin sát với thực tế!
