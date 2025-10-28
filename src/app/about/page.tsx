'use client'

import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { useEffect, useState } from 'react'

export default function AboutPage() {
  const [donateAmount, setDonateAmount] = useState<string>('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string>('')

  // Thông tin ngân hàng
  const bankInfo = {
    bankId: 'VCB', // Mã ngân hàng
    bankName: 'Vietcombank', // Tên ngân hàng đầy đủ
    accountNumber: '1023558782', // Số tài khoản
    accountName: 'Phạm Hoài Nghĩa', // Tên chủ tài khoản
  }

  // QR Code cho từng gói ủng hộ và phương thức thanh toán
  const qrCodeMap: { [key: string]: string } = {
    'Cà phê': '/50.jpg',           // QR cho gói 50k
    'Bữa trưa': '/100.jpg',         // QR cho gói 100k (tạo file này nếu có)
    'Sách tài liệu': '/200.jpg',   // QR cho gói 200k (tạo file này nếu có)
    'Tùy chỉnh': '/tuychinh.jpg', // QR mặc định cho gói tùy chỉnh
    'Momo': '/momo.jpg'            // QR Momo (đặt file momo.jpg vào public/)
  }

  const handleDonate = (amount: string, tierName: string) => {
    if (tierName === 'Tùy chỉnh') {
      setSelectedTier(tierName)
      setDonateAmount('')
      setShowQRModal(true)
    } else {
      const numericAmount = amount.replace(/[^0-9]/g, '')
      setDonateAmount(numericAmount)
      setSelectedTier(tierName)
      setShowQRModal(true)
    }
  }

  // Handler cho phương thức thanh toán (Momo, VNPay, etc.)
  const handlePaymentMethod = (methodName: string) => {
    setSelectedTier(methodName)
    setDonateAmount('') // Không cần hiển thị số tiền cho phương thức thanh toán
    setShowQRModal(true)
  }

  // Lấy QR code theo tier
  const getQRCode = () => {
    return qrCodeMap[selectedTier] || '/images/qr-code.png'
  }
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll('.scroll-animate')
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
  const founders = [
    {
      name: "Nguyễn Văn A",
      role: "Founder & CEO",
      avatar: "👨‍💼",
      bio: "10+ năm kinh nghiệm trong ngành chứng khoán, từng là chuyên viên phân tích tại các công ty hàng đầu.",
      speciality: "Chiến lược & Quản lý",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Trần Thị B",
      role: "Co-Founder & CTO",
      avatar: "👩‍💻",
      bio: "Chuyên gia công nghệ với 8 năm kinh nghiệm phát triển nền tảng giáo dục trực tuyến.",
      speciality: "Công nghệ & Đổi mới",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Lê Văn C",
      role: "Head of Education",
      avatar: "👨‍🎓",
      bio: "Chuyên gia đào tạo chứng khoán, đã giúp hơn 5,000 học viên đạt chứng chỉ.",
      speciality: "Giáo dục & Đào tạo",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Phạm Thị D",
      role: "Head of Content",
      avatar: "👩‍🏫",
      bio: "15+ năm kinh nghiệm biên soạn tài liệu và ngân hàng đề thi chứng khoán.",
      speciality: "Nội dung & Chất lượng",
      color: "from-orange-500 to-red-500"
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Khởi đầu",
      description: "Ý tưởng về một nền tảng ôn thi chứng khoán hiện đại được hình thành"
    },
    {
      year: "2021",
      title: "Ra mắt Beta",
      description: "Phiên bản thử nghiệm đầu tiên với 500 người dùng đầu tiên"
    },
    {
      year: "2022",
      title: "Mở rộng",
      description: "Vượt mốc 5,000 học viên và mở rộng ngân hàng câu hỏi"
    },
    {
      year: "2023",
      title: "Thành công",
      description: "Đạt tỷ lệ đậu 92% và trở thành nền tảng hàng đầu"
    },
    {
      year: "2024",
      title: "Tương lai",
      description: "Mở rộng ra các chứng chỉ tài chính khác và AI learning"
    }
  ]

  return (
    <MainLayout>
      <style jsx global>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .stagger-1 {
          transition-delay: 0.1s;
        }

        .stagger-2 {
          transition-delay: 0.2s;
        }

        .stagger-3 {
          transition-delay: 0.3s;
        }

        .stagger-4 {
          transition-delay: 0.4s;
        }

        .slide-in-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }

        .slide-in-left.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .slide-in-right {
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }

        .slide-in-right.animate-in {
          opacity: 1;
          transform: translateX(0);
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .scale-in.animate-in {
          opacity: 1;
          transform: scale(1);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDM0LCAxOTcsIDk0LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 text-green-700 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            ✨ Câu chuyện của chúng tôi
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-2">
            Về SecuriTest
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            Chúng tôi là đội ngũ đam mê giáo dục và công nghệ, với mục tiêu giúp mọi người 
            chinh phục các chứng chỉ chứng khoán một cách hiệu quả và tự tin nhất.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 max-w-2xl mx-auto">
            {[
              { number: "5,000+", label: "Học viên" },
              { number: "92%", label: "Tỷ lệ đậu" },
              { number: "4+", label: "Năm kinh nghiệm" },
              { number: "6", label: "Chứng chỉ" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-3 sm:p-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">{stat.number}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Card className="scroll-animate slide-in-left border-l-4 border-l-green-500 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl sm:text-5xl mb-4 float-animation">🎯</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Sứ mệnh</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Cung cấp nền tảng học tập chất lượng cao, giúp mọi người tiếp cận kiến thức 
                  chứng khoán một cách dễ dàng, hiệu quả và đạt được mục tiêu nghề nghiệp của họ 
                  trong ngành tài chính.
                </p>
              </CardContent>
            </Card>

            <Card className="scroll-animate slide-in-right border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8">
                <div className="text-4xl sm:text-5xl mb-4 float-animation" style={{ animationDelay: '0.5s' }}>🚀</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Tầm nhìn</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Trở thành nền tảng đào tạo chứng khoán số 1 tại Việt Nam, được tin tưởng bởi 
                  hàng chục nghìn chuyên gia và là cầu nối giúp họ phát triển sự nghiệp trong 
                  lĩnh vực tài chính.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 scroll-animate">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Đội ngũ sáng lập
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Những con người tận tâm đứng sau thành công của SecuriTest
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {founders.map((founder, index) => (
              <Card key={index} className={`scroll-animate scale-in stagger-${index + 1} group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                <CardContent className="p-5 sm:p-6 lg:p-8 text-center">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-full bg-gradient-to-br ${founder.color} flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {founder.avatar}
                  </div>
                  
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {founder.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm font-semibold text-green-600 mb-2 sm:mb-3 lg:mb-4">
                    {founder.role}
                  </p>
                  
                  <div className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-2 sm:mb-3 lg:mb-4">
                    <p className="text-xs font-medium text-gray-700">
                      {founder.speciality}
                    </p>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {founder.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 scroll-animate">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Hành trình của chúng tôi
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Từ những bước đi đầu tiên đến thành công hôm nay
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-200 via-blue-200 to-purple-200"></div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative mb-6 sm:mb-12 ${index % 2 === 0 ? 'sm:pr-1/2 sm:text-right' : 'sm:pl-1/2 sm:text-left'}`}>
                  <Card className={`scroll-animate ${index % 2 === 0 ? 'slide-in-left' : 'slide-in-right'} inline-block w-full sm:w-auto sm:max-w-md hover:shadow-xl transition-all duration-300`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base shadow-lg">
                          {milestone.year}
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-12 sm:pl-0">
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Timeline dot */}
                  <div className="hidden sm:block absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-blue-500 border-4 border-white shadow-lg z-10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 scroll-animate">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Giá trị cốt lõi
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Những nguyên tắc dẫn dắt mọi hành động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "💎",
                title: "Chất lượng",
                description: "Cam kết cung cấp nội dung và trải nghiệm học tập tốt nhất"
              },
              {
                icon: "🤝",
                title: "Tận tâm",
                description: "Đặt thành công của học viên lên hàng đầu trong mọi quyết định"
              },
              {
                icon: "🔄",
                title: "Đổi mới",
                description: "Không ngừng cải tiến và áp dụng công nghệ mới"
              },
              {
                icon: "🎓",
                title: "Chuyên nghiệp",
                description: "Duy trì tiêu chuẩn cao nhất trong giáo dục và dịch vụ"
              },
              {
                icon: "🌟",
                title: "Minh bạch",
                description: "Trung thực và rõ ràng trong mọi giao tiếp với học viên"
              },
              {
                icon: "❤️",
                title: "Trách nhiệm",
                description: "Góp phần phát triển cộng đồng tài chính Việt Nam"
              }
            ].map((value, index) => (
              <Card key={index} className={`scroll-animate scale-in stagger-${(index % 4) + 1} text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm`}>
                <CardContent className="p-5 sm:p-6 lg:p-8">
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 lg:mb-4">{value.icon}</div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 scroll-animate">
            <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 text-green-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              💝 Ủng hộ chúng tôi
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              Đồng hành cùng SecuriTest
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Sự ủng hộ của bạn giúp chúng tôi tiếp tục phát triển nền tảng, 
              cải thiện chất lượng nội dung và mang đến trải nghiệm học tập tốt nhất cho cộng đồng
            </p>
          </div>

          {/* Donation Tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8 sm:mb-12">
            {[
              {
                icon: "☕",
                name: "Cà phê",
                amount: "50,000₫",
                description: "Một ly cà phê cho đội ngũ",
                color: "from-amber-500 to-orange-500"
              },
              {
                icon: "🍕",
                name: "Bữa trưa",
                amount: "100,000₫",
                description: "Bữa trưa cho team",
                color: "from-green-500 to-emerald-500",
                popular: true
              },
              {
                icon: "📚",
                name: "Sách tài liệu",
                amount: "200,000₫",
                description: "Mua tài liệu cập nhật mới",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "💎",
                name: "Tùy chỉnh",
                amount: "Tùy ý",
                description: "Số tiền bạn muốn ủng hộ",
                color: "from-purple-500 to-pink-500"
              }
            ].map((tier, index) => (
              <Card key={index} className={`scroll-animate scale-in stagger-${index + 1} group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${tier.popular ? 'border-2 border-green-500 relative' : 'border-0'}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold shadow-lg">
                      ⭐ Phổ biến nhất
                    </span>
                  </div>
                )}
                <CardContent className="p-5 sm:p-6 lg:p-8 text-center">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {tier.icon}
                  </div>
                  
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                    {tier.amount}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    {tier.description}
                  </p>
                  
                  <button 
                    onClick={() => handleDonate(tier.amount, tier.name)}
                    className={`w-full px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg hover:scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                    Ủng hộ ngay
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Why Support */}
          <div className="max-w-4xl mx-auto scroll-animate">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8 lg:p-10">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                Sự ủng hộ của bạn sẽ giúp:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: "🚀", text: "Phát triển tính năng mới" },
                  { icon: "📖", text: "Cập nhật ngân hàng câu hỏi" },
                  { icon: "💻", text: "Cải thiện giao diện người dùng" },
                  { icon: "🎓", text: "Tạo thêm khóa học miễn phí" },
                  { icon: "🔧", text: "Bảo trì và tối ưu hệ thống" },
                  { icon: "🌟", text: "Hỗ trợ học viên tốt hơn" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-base sm:text-lg">
                      {item.icon}
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="max-w-3xl mx-auto mt-8 sm:mt-12 text-center scroll-animate">
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Các phương thức thanh toán được hỗ trợ:</p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
              {[
                { name: "Momo", icon: "💳", hasQR: true },
                { name: "VNPay", icon: "💰", hasQR: false },
                { name: "Banking", icon: "🏦", hasQR: false },
                { name: "Visa/Master", icon: "💳", hasQR: false }
              ].map((method, index) => (
                <button
                  key={index}
                  onClick={() => method.hasQR && handlePaymentMethod(method.name)}
                  disabled={!method.hasQR}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg transition-all ${
                    method.hasQR 
                      ? 'hover:bg-green-100 hover:text-green-700 hover:shadow-md cursor-pointer hover:scale-105' 
                      : 'hover:bg-gray-100 cursor-default'
                  }`}
                >
                  <span className="text-base sm:text-lg">{method.icon}</span>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">{method.name}</span>
                  {method.hasQR && (
                    <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">QR</span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6 italic px-4">
              💚 Mọi đóng góp đều vô cùng ý nghĩa với chúng tôi. Xin chân thành cảm ơn!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center scroll-animate scale-in">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 px-2">
            Sẵn sàng bắt đầu hành trình của bạn?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Hãy tham gia cùng hàng nghìn học viên đã thành công với SecuriTest
          </p>
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
            
             <a
               href="/contact"
               className="group relative inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 lg:py-5 overflow-hidden font-bold text-white bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:bg-white/20 border-2 border-white/50 hover:border-white text-sm sm:text-base"
             >
               <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
               <span className="relative flex items-center gap-1.5 sm:gap-2">
                 <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
                 <span className="group-hover:tracking-wider transition-all duration-300">
                   Liên hệ với chúng tôi
                 </span>
                 <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                 </svg>
               </span>
               <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full rounded-2xl"></span>
             </a>
           </div>
        </div>
      </section>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">Ủng hộ SecuriTest</h3>
                  <p className="text-green-100 text-sm sm:text-base">{selectedTier}</p>
                </div>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {/* QR Code Display */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 sm:p-6">
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-600 mb-1">
                      {selectedTier === 'Momo' ? 'Quét mã QR Momo để thanh toán' : 'Quét mã QR để chuyển khoản'}
                    </p>
                    {donateAmount && donateAmount !== '0' && (
                      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {new Intl.NumberFormat('vi-VN').format(parseInt(donateAmount))} VNĐ
                      </p>
                    )}
                  </div>
                  
                  {/* QR Code Image */}
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getQRCode()}
                      alt="QR Code Chuyển khoản"
                      className="w-full max-w-[280px] h-auto rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280"><rect width="280" height="280" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Chưa có QR code</text><text x="50%" y="60%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">cho gói này</text></svg>'
                      }}
                    />
                  </div>
                </div>

                {/* Bank Info - Chỉ hiển thị khi không phải Momo */}
                {selectedTier !== 'Momo' && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                      <span className="text-lg">🏦</span>
                      Thông tin chuyển khoản:
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between items-center bg-white p-2.5 sm:p-3 rounded-lg">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-semibold text-gray-900">{bankInfo.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 sm:p-3 rounded-lg">
                        <span className="text-gray-600">Số tài khoản:</span>
                        <span className="font-semibold text-gray-900 select-all">{bankInfo.accountNumber}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 sm:p-3 rounded-lg">
                        <span className="text-gray-600">Chủ tài khoản:</span>
                        <span className="font-semibold text-gray-900">{bankInfo.accountName}</span>
                      </div>
                      <div className="bg-green-50 border border-green-200 p-2.5 sm:p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Nội dung chuyển khoản:</p>
                        <p className="font-semibold text-green-700 select-all text-sm">
                          Ung ho SecuriTest
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Momo Instructions */}
                {selectedTier === 'Momo' && (
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2 mb-3">
                      <span className="text-lg">📱</span>
                      Hướng dẫn thanh toán Momo:
                    </h4>
                    <ol className="space-y-2 text-xs sm:text-sm text-gray-700">
                      <li className="flex gap-2">
                        <span className="font-semibold text-pink-600">1.</span>
                        <span>Mở ứng dụng Momo trên điện thoại</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-pink-600">2.</span>
                        <span>Chọn &ldquo;Quét mã QR&rdquo;</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-pink-600">3.</span>
                        <span>Quét mã QR ở trên</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-pink-600">4.</span>
                        <span>Xác nhận số tiền và hoàn tất thanh toán</span>
                      </li>
                    </ol>
                  </div>
                )}

                {/* Thank you message */}
                <div className="text-center p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                  <p className="text-sm text-gray-700">
                    💚 <span className="font-semibold">Xin chân thành cảm ơn!</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Sự ủng hộ của bạn giúp chúng tôi phát triển tốt hơn
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 sm:p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors text-sm sm:text-base"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

