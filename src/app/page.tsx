import { MainLayout } from '@/components/layouts/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { StockTicker } from '@/components/common/StockTicker'
import { MarketData } from '@/components/common/MarketData'
import { TopStocks } from '@/components/common/TopStocks'
import { ROUTES } from '@/constants'

export default function Home() {
  return (
    <MainLayout>
      {/* Real Stock Ticker */}
      <StockTicker />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDM0LCAxOTcsIDk0LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 text-green-700 text-sm font-medium mb-8">
              📈 Nền tảng ôn thi chứng khoán chuyên nghiệp
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              SecuriTest
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Chuẩn bị cho kỳ thi chứng khoán với hệ thống<br />
              trắc nghiệm chuyên sâu và cập nhật liên tục
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="xl" className="bg-gradient-to-r from-green-600 to-blue-600 shadow-xl shadow-green-500/25">
                <a href={ROUTES.REGISTER}>Bắt đầu ôn thi ngay</a>
              </Button>
              <Button variant="outline" size="xl" className="border-green-600 text-green-600 hover:bg-green-50">
                <a href={ROUTES.LOGIN}>Đăng nhập</a>
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              💼 Chuẩn theo quy định • 📊 Cập nhật thường xuyên • 🏆 Tỷ lệ đậu cao
            </div>
          </div>
        </div>
      </section>

      {/* Real Market Data */}
      <MarketData />

      {/* Certifications Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Các chứng chỉ chứng khoán
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ôn tập cho tất cả các bằng cấp chứng khoán hiện hành tại Việt Nam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "📋",
                title: "Chứng chỉ hành nghề",
                description: "Chứng chỉ hành nghề chứng khoán cơ bản và nâng cao theo quy định của Bộ Tài chính"
              },
              {
                icon: "🎓",
                title: "Chứng chỉ quản lý quỹ",
                description: "Chứng chỉ quản lý quỹ đầu tư, quản lý danh mục đầu tư chuyên nghiệp"
              },
              {
                icon: "📈",
                title: "Chứng chỉ phân tích",
                description: "Chứng chỉ phân tích tài chính, định giá chứng khoán và tư vấn đầu tư"
              },
              {
                icon: "🏢",
                title: "Chứng chỉ môi giới",
                description: "Chứng chỉ môi giới chứng khoán, giao dịch ký quỹ và các sản phẩm phái sinh"
              },
              {
                icon: "💼",
                title: "Chứng chỉ bảo lãnh",
                description: "Chứng chỉ bảo lãnh phát hành, tư vấn tài chính doanh nghiệp"
              },
              {
                icon: "🔐",
                title: "Chứng chỉ lưu ký",
                description: "Chứng chỉ nghiệp vụ lưu ký chứng khoán và thanh toán bù trừ"
              }
            ].map((cert, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:border-green-200">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{cert.icon}</div>
                  <CardTitle className="text-xl text-green-700">{cert.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {cert.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Tại sao chọn SecuriTest?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "✅",
                title: "Chuẩn quy định",
                description: "Nội dung tuân thủ 100% theo quy định của Bộ Tài chính và UBCKNN"
              },
              {
                icon: "📚",
                title: "Ngân hàng câu hỏi lớn",
                description: "Hơn 5,000 câu hỏi được cập nhật liên tục theo luật pháp mới nhất"
              },
              {
                icon: "🎯",
                title: "Mô phỏng thi thật",
                description: "Giao diện và cách thức thi giống 100% với kỳ thi chính thức"
              },
              {
                icon: "📊",
                title: "Phân tích kết quả",
                description: "Báo cáo chi tiết điểm mạnh, điểm yếu và lộ trình ôn tập cá nhân"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border border-green-100">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-lg text-green-700">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Thành tích đáng tự hào
            </h2>
            <p className="text-green-100 text-lg">
              Được tin tưởng bởi hàng nghìn chuyên gia chứng khoán
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: "5,000+", label: "Câu hỏi chứng khoán", icon: "📝" },
              { number: "3,200+", label: "Học viên đã đậu", icon: "🎓" },
              { number: "92%", label: "Tỷ lệ đậu trung bình", icon: "🏆" },
              { number: "6", label: "Loại chứng chỉ", icon: "📋" }
            ].map((stat, index) => (
              <div key={index} className="space-y-3">
                <div className="text-3xl">{stat.icon}</div>
                <div className="text-4xl lg:text-5xl font-bold">{stat.number}</div>
                <div className="text-green-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Top Stocks Data */}
      <TopStocks />

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Câu chuyện thành công
            </h2>
            <p className="text-xl text-gray-600">
              Những chia sẻ từ các học viên đã đậu chứng chỉ
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                role: "Chuyên viên môi giới - Công ty CP Chứng khoán ABC",
                quote: "Nhờ SecuriTest, tôi đã đậu chứng chỉ hành nghề chứng khoán từ lần thi đầu tiên với 85 điểm. Ngân hàng câu hỏi rất phong phú và sát với đề thi thật.",
                avatar: "👨‍💼"
              },
              {
                name: "Trần Thị B",
                role: "Chuyên viên phân tích - Quỹ đầu tư XYZ",
                quote: "Tôi đã lần lượt đậu 3 chứng chỉ chứng khoán khác nhau nhờ hệ thống ôn tập có hệ thống của SecuriTest. Highly recommended!",
                avatar: "👩‍💼"
              },
              {
                name: "Lê Văn C",
                role: "Giám đốc KV - Công ty CP Chứng khoán DEF",
                quote: "Từ khi sử dụng SecuriTest, tỷ lệ đậu của nhân viên trong công ty tôi đã tăng từ 65% lên 90%. Đầu tư rất xứng đáng.",
                avatar: "👨‍💻"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="pt-8">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Sẵn sàng chinh phục chứng chỉ chứng khoán?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Tham gia cùng hàng nghìn chuyên gia đã thành công với SecuriTest
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="xl" className="bg-gradient-to-r from-green-600 to-blue-600 shadow-xl shadow-green-500/25">
                <a href={ROUTES.REGISTER}>Bắt đầu ôn thi miễn phí</a>
              </Button>
              <Button variant="outline" size="xl" className="border-green-600 text-green-600 hover:bg-green-50">
                Thi thử ngay
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Miễn phí 7 ngày đầu</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Không cam kết dài hạn</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
    </div>
      </section>
    </MainLayout>
  )
}
