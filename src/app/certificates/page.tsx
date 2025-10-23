'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Certificate {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  level: string;
  description: string;
  benefits: string[];
  requirements: string[];
  duration: string;
  cost: string;
  color: string;
  gradient: string;
}

const certificates: Certificate[] = [
  {
    id: 'cfa',
    name: 'CFA',
    fullName: 'Chartered Financial Analyst',
    icon: '📊',
    level: 'Quốc tế',
    description: 'Chứng chỉ phân tích tài chính được công nhận toàn cầu, là tiêu chuẩn vàng trong ngành đầu tư và quản lý tài sản.',
    benefits: [
      'Được công nhận trên toàn thế giới',
      'Nâng cao kiến thức đầu tư chuyên sâu',
      'Tăng cơ hội nghề nghiệp và thu nhập',
      'Mở rộng mạng lưới chuyên gia tài chính toàn cầu'
    ],
    requirements: [
      'Bằng đại học hoặc tương đương',
      'Vượt qua 3 cấp độ kỳ thi',
      '4 năm kinh nghiệm làm việc liên quan',
      'Cam kết tuân thủ chuẩn mực đạo đức'
    ],
    duration: '2-4 năm',
    cost: '≈ 60 triệu VNĐ',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500 via-cyan-500 to-blue-600'
  },
  {
    id: 'frm',
    name: 'FRM',
    fullName: 'Financial Risk Manager',
    icon: '🛡️',
    level: 'Quốc tế',
    description: 'Chứng chỉ quản lý rủi ro tài chính hàng đầu thế giới, tập trung vào phân tích và quản lý rủi ro trong lĩnh vực tài chính.',
    benefits: [
      'Chuyên môn về quản lý rủi ro được công nhận',
      'Phù hợp với xu hướng quản trị rủi ro hiện đại',
      'Cơ hội làm việc tại các tổ chức tài chính lớn',
      'Thu nhập hấp dẫn trong lĩnh vực risk management'
    ],
    requirements: [
      'Vượt qua 2 cấp độ kỳ thi',
      '2 năm kinh nghiệm quản lý rủi ro',
      'Kiến thức về toán học và thống kê',
      'Tuân thủ Code of Conduct'
    ],
    duration: '1-2 năm',
    cost: '≈ 30 triệu VNĐ',
    color: 'from-emerald-500 to-teal-500',
    gradient: 'from-emerald-500 via-teal-500 to-green-600'
  },
  {
    id: 'cmt',
    name: 'CMT',
    fullName: 'Chartered Market Technician',
    icon: '📈',
    level: 'Quốc tế',
    description: 'Chứng chỉ chuyên sâu về phân tích kỹ thuật, giúp nắm vững các công cụ và phương pháp phân tích thị trường.',
    benefits: [
      'Thành thạo phân tích kỹ thuật chuyên nghiệp',
      'Hiểu sâu về tâm lý thị trường',
      'Ứng dụng thực tế trong giao dịch',
      'Nâng cao kỹ năng ra quyết định đầu tư'
    ],
    requirements: [
      'Vượt qua 3 cấp độ kỳ thi',
      'Kinh nghiệm thực tế trong phân tích thị trường',
      'Hiểu biết về thị trường tài chính',
      'Cam kết đạo đức nghề nghiệp'
    ],
    duration: '1.5-3 năm',
    cost: '≈ 25 triệu VNĐ',
    color: 'from-violet-500 to-purple-500',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-600'
  },
  {
    id: 'vsi',
    name: 'VSI',
    fullName: 'Chứng chỉ hành nghề chứng khoán Việt Nam',
    icon: '🇻🇳',
    level: 'Việt Nam',
    description: 'Chứng chỉ bắt buộc để hành nghề trong lĩnh vực chứng khoán tại Việt Nam, do Ủy ban Chứng khoán Nhà nước cấp.',
    benefits: [
      'Điều kiện tiên quyết để làm việc tại công ty chứng khoán',
      'Hiểu rõ quy định pháp luật Việt Nam',
      'Nền tảng để phát triển nghề nghiệp',
      'Chi phí học tập hợp lý'
    ],
    requirements: [
      'Tốt nghiệp đại học',
      'Vượt qua kỳ thi do UBCKNN tổ chức',
      'Không có tiền án tiền sự',
      'Đăng ký hành nghề với UBCKNN'
    ],
    duration: '3-6 tháng',
    cost: '≈ 5-10 triệu VNĐ',
    color: 'from-red-500 to-orange-500',
    gradient: 'from-red-500 via-orange-500 to-amber-600'
  },
  {
    id: 'cpa',
    name: 'CPA',
    fullName: 'Certified Public Accountant',
    icon: '💼',
    level: 'Quốc tế',
    description: 'Chứng chỉ kế toán công chứng quốc tế, rất có giá trị trong lĩnh vực kiểm toán tài chính và tư vấn.',
    benefits: [
      'Uy tín cao trong ngành tài chính kế toán',
      'Cơ hội làm việc tại Big 4',
      'Kiến thức toàn diện về tài chính doanh nghiệp',
      'Lương cao và cơ hội thăng tiến'
    ],
    requirements: [
      'Bằng đại học chuyên ngành liên quan',
      'Vượt qua 4 phần thi',
      'Đáp ứng yêu cầu về học vị và kinh nghiệm',
      'Tuân thủ chuẩn mực đạo đức nghề nghiệp'
    ],
    duration: '1.5-2 năm',
    cost: '≈ 40 triệu VNĐ',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'from-amber-500 via-yellow-500 to-orange-600'
  },
  {
    id: 'acca',
    name: 'ACCA',
    fullName: 'Association of Chartered Certified Accountants',
    icon: '🎓',
    level: 'Quốc tế',
    description: 'Chứng chỉ kế toán quốc tế được công nhận rộng rãi, phù hợp cho những người muốn phát triển nghề nghiệp toàn cầu.',
    benefits: [
      'Được công nhận tại hơn 180 quốc gia',
      'Chương trình linh hoạt và toàn diện',
      'Cơ hội nghề nghiệp đa dạng',
      'Mạng lưới chuyên gia kế toán toàn cầu'
    ],
    requirements: [
      'Tốt nghiệp THPT trở lên',
      'Vượt qua 13 môn thi',
      '3 năm kinh nghiệm thực tế',
      'Hoàn thành module đạo đức nghề nghiệp'
    ],
    duration: '3-4 năm',
    cost: '≈ 50 triệu VNĐ',
    color: 'from-pink-500 to-rose-500',
    gradient: 'from-pink-500 via-rose-500 to-red-600'
  }
];

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [statsCounters, setStatsCounters] = useState({ certs: 0, countries: 0, success: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Calculate scroll progress
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-scroll-reveal]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Animate stats counters when visible
  useEffect(() => {
    if (visibleSections.has('stats-section')) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStatsCounters({
          certs: Math.floor(6 * progress),
          countries: Math.floor(180 * progress),
          success: Math.floor(100 * progress)
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setStatsCounters({ certs: 6, countries: 180, success: 100 });
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [visibleSections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-50 shadow-lg">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 transition-all duration-300 shadow-lg relative overflow-hidden"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Animated shine effect on progress bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shine"></div>
        </div>
      </div>

      {/* Floating background elements with parallax */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
        <div 
          className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 animate-pulse"></div>
          
          {/* Floating shapes with parallax */}
          <div 
            className="absolute top-20 left-1/4 w-4 h-4 bg-white rounded-full animate-float opacity-60"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute top-40 right-1/3 w-3 h-3 bg-yellow-300 rounded-full animate-float animation-delay-1000 opacity-60"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          ></div>
          <div 
            className="absolute bottom-32 left-1/3 w-5 h-5 bg-cyan-300 rounded-full animate-float animation-delay-2000 opacity-60"
            style={{ transform: `translateY(${scrollY * 0.25}px)` }}
          ></div>
          <div 
            className="absolute top-60 right-1/4 w-2 h-2 bg-white rounded-full animate-float animation-delay-3000 opacity-60"
            style={{ transform: `translateY(${scrollY * 0.35}px)` }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-40">
          <div className="text-center">
            {/* Animated badge */}
            <div className="inline-block mb-6 sm:mb-8 animate-bounce-slow">
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/40 shadow-2xl">
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span className="text-xl sm:text-2xl animate-pulse">🎯</span>
                  <span className="hidden sm:inline">Nâng cao năng lực chuyên môn</span>
                  <span className="sm:hidden">Nâng cao năng lực</span>
                </span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 sm:mb-8 leading-tight px-2">
              <span className="block text-white drop-shadow-2xl animate-fade-in-down">
                Chứng chỉ Chứng khoán
              </span>
              <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in-up">
                Chuyên nghiệp HSC
              </span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-3xl text-blue-50 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium drop-shadow-lg animate-fade-in px-4">
              🚀 Khám phá các chứng chỉ hàng đầu trong lĩnh vực chứng khoán và tài chính, 
              mở ra cơ hội nghề nghiệp vững chắc cho tương lai của bạn ✨
            </p>

            <div 
              id="stats-section"
              data-scroll-reveal
              className="flex flex-wrap gap-3 sm:gap-6 justify-center items-center animate-fade-in-up px-2"
            >
              {[
                { number: statsCounters.certs, suffix: '+', label: 'Chứng chỉ', icon: '📜', color: 'from-blue-400 to-cyan-400' },
                { number: statsCounters.countries, suffix: '+', label: 'Quốc gia', icon: '🌍', color: 'from-purple-400 to-pink-400' },
                { number: statsCounters.success, suffix: '%', label: 'Thành công', icon: '⭐', color: 'from-yellow-400 to-orange-400' }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group bg-white/15 backdrop-blur-lg px-4 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-2xl border-2 border-white/30 shadow-2xl hover:scale-110 hover:bg-white/25 transition-all duration-300 hover:rotate-2 flex-1 min-w-[100px] sm:min-w-0 sm:flex-none"
                  style={{ 
                    animation: visibleSections.has('stats-section') ? `slideInUp 0.6s ease-out ${idx * 0.2}s both` : 'none'
                  }}
                >
                  <div className="text-3xl sm:text-5xl font-black text-white mb-1 group-hover:scale-125 transition-transform">
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-xs sm:text-base text-blue-100 font-semibold flex items-center gap-1 sm:gap-2 justify-center">
                    <span className="text-base sm:text-xl">{stat.icon}</span>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(248, 250, 252)"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Introduction with enhanced design */}
        <div 
          id="intro-section"
          data-scroll-reveal
          className={`text-center mb-12 sm:mb-20 transition-all duration-1000 ${
            visibleSections.has('intro-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block mb-4 sm:mb-6">
            <div 
              className="text-4xl sm:text-6xl mb-3 sm:mb-4"
              style={{
                animation: visibleSections.has('intro-section') ? 'zoomRotate 0.8s ease-out, bounce-slow 2s ease-in-out 0.8s infinite' : 'none'
              }}
            >💎</div>
          </div>
          <h2 
            className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent px-4"
            style={{
              animation: visibleSections.has('intro-section') ? 'slideInLeft 0.8s ease-out' : 'none'
            }}
          >
            Tại sao nên có chứng chỉ?
          </h2>
          <p 
            className="text-base sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium px-4"
            style={{
              animation: visibleSections.has('intro-section') ? 'slideInRight 0.8s ease-out 0.2s both' : 'none'
            }}
          >
            Trong ngành chứng khoán cạnh tranh cao, chứng chỉ chuyên môn không chỉ là minh chứng cho kiến thức 
            mà còn là <span className="font-bold text-blue-600">chìa khóa vàng</span> mở ra những cơ hội nghề nghiệp tuyệt vời 🔑
          </p>
        </div>

        {/* Enhanced Certificates Grid */}
        <div 
          id="certificates-grid"
          data-scroll-reveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mb-16 sm:mb-24"
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer overflow-hidden border-2 border-gray-100 hover:border-transparent hover:-translate-y-4 hover:scale-105 ${
                visibleSections.has('certificates-grid') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{ 
                transitionDelay: visibleSections.has('certificates-grid') ? `${index * 150}ms` : '0ms',
                transform: visibleSections.has('certificates-grid') 
                  ? `translateY(${Math.sin(scrollY * 0.01 + index) * 5}px)` 
                  : 'translateY(80px)'
              }}
            >
              {/* Animated gradient border */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`}></div>
              
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
              
              <div className="relative p-5 sm:p-8">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div className={`relative text-4xl sm:text-6xl bg-gradient-to-br ${cert.gradient} w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    <span className="filter drop-shadow-2xl animate-pulse">{cert.icon}</span>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                  <div className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-gradient-to-r ${cert.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    ⭐ {cert.level}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 sm:mb-3 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent">
                  {cert.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 font-bold tracking-wide">{cert.fullName}</p>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-6 line-clamp-3 font-medium">
                  {cert.description}
                </p>

                {/* Enhanced Quick Info */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center text-xs sm:text-sm bg-gradient-to-r from-blue-50 to-cyan-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-blue-100">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">⏱️</span>
                    <span className="font-bold text-gray-700">Thời gian:</span>
                    <span className="ml-auto font-black text-blue-600">{cert.duration}</span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-green-100">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3">💰</span>
                    <span className="font-bold text-gray-700">Chi phí:</span>
                    <span className="ml-auto font-black text-green-600">{cert.cost}</span>
                  </div>
                </div>

                {/* Enhanced CTA Button */}
                <button className={`relative w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r ${cert.gradient} text-white font-black text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 overflow-hidden active:scale-95`}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Xem chi tiết
                    <span className="inline-block group-hover:translate-x-2 transition-transform duration-300 text-lg sm:text-xl">→</span>
                  </span>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                </button>
              </div>

              {/* Decorative corners */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${cert.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr ${cert.gradient} opacity-5 rounded-tr-full group-hover:opacity-10 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Enhanced Benefits Section */}
        <div 
          id="benefits-section"
          data-scroll-reveal
          className={`relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden mb-16 sm:mb-24 transition-all duration-1000 ${
            visibleSections.has('benefits-section') 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40 animate-pulse"></div>
          
          <div className="relative px-5 sm:px-8 py-10 sm:py-16 md:p-20">
            <div className="text-center mb-8 sm:mb-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">✨</div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-3 sm:mb-4 drop-shadow-2xl px-4">
                Lợi ích vượt trội
              </h2>
              <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-medium px-4">
                Đầu tư vào chứng chỉ chính là đầu tư cho tương lai của chính bạn 🚀
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: '🚀',
                  title: 'Thăng tiến nhanh',
                  desc: 'Tăng cơ hội thăng tiến và phát triển sự nghiệp vượt bậc',
                  gradient: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: '💎',
                  title: 'Thu nhập cao',
                  desc: 'Mức lương cạnh tranh và thưởng hấp dẫn từ các tập đoàn lớn',
                  gradient: 'from-green-400 to-emerald-500'
                },
                {
                  icon: '🌏',
                  title: 'Cơ hội toàn cầu',
                  desc: 'Làm việc tại các tổ chức tài chính quốc tế hàng đầu',
                  gradient: 'from-blue-400 to-cyan-500'
                },
                {
                  icon: '🎯',
                  title: 'Chuyên môn sâu',
                  desc: 'Nắm vững kiến thức chuyên sâu và luôn được cập nhật',
                  gradient: 'from-purple-400 to-pink-500'
                }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`group relative bg-white/15 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-700 hover:scale-110 hover:-rotate-2 shadow-2xl ${
                    visibleSections.has('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ 
                    transitionDelay: visibleSections.has('benefits-section') ? `${idx * 150 + 300}ms` : '0ms'
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}></div>
                  <div className="relative">
                    <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 group-hover:scale-125 transition-transform duration-500 animate-bounce-slow">{item.icon}</div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 drop-shadow-lg">{item.title}</h3>
                    <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Learning Path */}
        <div 
          id="learning-path"
          data-scroll-reveal
          className={`bg-white rounded-2xl sm:rounded-[3rem] shadow-2xl p-5 sm:p-8 md:p-16 border-2 sm:border-4 border-gray-100 transition-all duration-1000 ${
            visibleSections.has('learning-path') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="text-center mb-10 sm:mb-16">
            <div 
              className="text-4xl sm:text-6xl mb-3 sm:mb-4"
              style={{
                animation: visibleSections.has('learning-path') ? 'zoomRotate 0.8s ease-out, bounce-slow 2s ease-in-out 0.8s infinite' : 'none'
              }}
            >🎓</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent px-4">
              Lộ trình phát triển
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium px-4">
              Từng bước chinh phục đỉnh cao sự nghiệp trong lĩnh vực chứng khoán 🏆
            </p>
          </div>
          
          <div className="relative">
            {/* Enhanced Timeline line */}
            <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-purple-500 shadow-lg"></div>
            
            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  stage: 'Bước 1',
                  title: 'Chứng chỉ VSI - Nền tảng cơ bản',
                  desc: 'Bắt đầu với chứng chỉ hành nghề chứng khoán Việt Nam để có thể làm việc tại các công ty chứng khoán. Đây là bước đệm quan trọng cho sự nghiệp của bạn! 🎯',
                  time: '3-6 tháng',
                  color: 'from-red-500 to-orange-500',
                  icon: '🇻🇳'
                },
                {
                  stage: 'Bước 2',
                  title: 'CFA/FRM - Chuyên môn quốc tế',
                  desc: 'Nâng cao kiến thức với các chứng chỉ quốc tế được công nhận toàn cầu. Mở rộng tầm nhìn và cơ hội nghề nghiệp của bạn! 🌍',
                  time: '2-4 năm',
                  color: 'from-blue-500 to-cyan-500',
                  icon: '📊'
                },
                {
                  stage: 'Bước 3',
                  title: 'Chuyên sâu theo định hướng',
                  desc: 'Lựa chọn chứng chỉ phù hợp với định hướng nghề nghiệp: Phân tích (CMT), Kế toán (CPA/ACCA). Trở thành chuyên gia trong lĩnh vực của bạn! 💼',
                  time: '1-3 năm',
                  color: 'from-violet-500 to-purple-500',
                  icon: '📈'
                },
                {
                  stage: 'Bước 4',
                  title: 'Chuyên gia hàng đầu',
                  desc: 'Trở thành chuyên gia được săn đón với nhiều chứng chỉ và kinh nghiệm thực tế. Đạt được đỉnh cao sự nghiệp! 👑',
                  time: 'Liên tục',
                  color: 'from-emerald-500 to-teal-500',
                  icon: '⭐'
                }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex items-center group transition-all duration-700 ${
                    visibleSections.has('learning-path') ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transitionDelay: visibleSections.has('learning-path') ? `${idx * 300 + 500}ms` : '0ms'
                  }}
                >
                  <div 
                    className={`hidden md:block md:w-1/2 transition-all duration-700 ${
                      visibleSections.has('learning-path') 
                        ? idx % 2 === 0 ? 'translate-x-0' : 'translate-x-0'
                        : idx % 2 === 0 ? '-translate-x-full' : 'translate-x-full'
                    }`}
                    style={{ 
                      order: idx % 2 === 0 ? 1 : 2,
                      transitionDelay: visibleSections.has('learning-path') ? `${idx * 300 + 500}ms` : '0ms'
                    }}
                  >
                    <div className={`relative bg-gradient-to-br ${step.color} rounded-3xl p-8 shadow-2xl mx-8 hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-rotate-1 border-2 border-white/50`}>
                      <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">{step.icon}</span>
                          <div>
                            <span className="text-white/90 font-black text-lg block">{step.stage}</span>
                            <span className="text-white/70 text-sm font-semibold">⏱️ {step.time}</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 drop-shadow-lg">{step.title}</h3>
                        <p className="text-white/95 font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute left-6 sm:left-8 md:left-1/2 transform md:-translate-x-1/2 z-10">
                    <div className={`relative w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-black text-lg sm:text-2xl shadow-2xl border-2 sm:border-4 border-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                      {idx + 1}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    </div>
                  </div>
                  
                  <div className="md:hidden w-full pl-20 sm:pl-32 pr-2 sm:pr-4">
                    <div className={`relative bg-gradient-to-br ${step.color} rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl active:scale-95 transition-transform`}>
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="text-2xl sm:text-3xl">{step.icon}</span>
                        <div>
                          <span className="text-white/90 font-black text-sm sm:text-base block">{step.stage}</span>
                          <span className="text-white/70 text-xs sm:text-sm font-semibold">⏱️ {step.time}</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white mb-2">{step.title}</h3>
                      <p className="text-white/95 font-medium text-sm sm:text-base leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block md:w-1/2" style={{ order: idx % 2 === 0 ? 2 : 1 }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Detail Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 animate-fade-in overflow-y-auto"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white rounded-none sm:rounded-[3rem] max-w-5xl w-full min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in sm:border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Modal Header */}
            <div className={`relative bg-gradient-to-br ${selectedCert.gradient} p-5 sm:p-10 overflow-hidden`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 animate-pulse"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3 sm:gap-8 flex-1">
                  <div className={`relative text-4xl sm:text-7xl bg-white/25 backdrop-blur-lg w-16 h-16 sm:w-32 sm:h-32 rounded-xl sm:rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce-slow border-2 sm:border-4 border-white/40`}>
                    <span className="filter drop-shadow-2xl">{selectedCert.icon}</span>
                    <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-[2rem] blur-2xl"></div>
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-2 sm:px-4 py-1 sm:py-2 bg-white/25 backdrop-blur-md rounded-full text-white text-xs sm:text-base font-black mb-2 sm:mb-3 shadow-xl border border-white/40">
                      ⭐ {selectedCert.level}
                    </div>
                    <h2 className="text-2xl sm:text-5xl font-black text-white mb-1 sm:mb-3 drop-shadow-2xl">{selectedCert.name}</h2>
                    <p className="text-white/95 text-sm sm:text-xl font-bold line-clamp-2">{selectedCert.fullName}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedCert(null)}
                  className="flex-shrink-0 text-white/90 hover:text-white transition-all bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center backdrop-blur-md font-black text-xl sm:text-2xl hover:scale-110 hover:rotate-90 duration-300 border-2 border-white/40 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Enhanced Modal Content */}
            <div className="p-5 sm:p-10 space-y-6 sm:space-y-10">
              {/* Description */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 border-blue-100">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl">📖</span>
                  Giới thiệu
                </h3>
                <p className="text-gray-700 leading-relaxed text-base sm:text-xl font-medium">{selectedCert.description}</p>
              </div>

              {/* Enhanced Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <span className="text-3xl sm:text-5xl">⏱️</span>
                    <span className="text-white/90 font-bold text-sm sm:text-xl">Thời gian hoàn thành</span>
                  </div>
                  <p className="text-2xl sm:text-4xl font-black sm:ml-16 drop-shadow-lg">{selectedCert.duration}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <span className="text-3xl sm:text-5xl">💰</span>
                    <span className="text-white/90 font-bold text-sm sm:text-xl">Chi phí ước tính</span>
                  </div>
                  <p className="text-2xl sm:text-4xl font-black sm:ml-16 drop-shadow-lg">{selectedCert.cost}</p>
                </div>
              </div>

              {/* Enhanced Benefits */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-5xl">✨</span>
                  Lợi ích vượt trội
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {selectedCert.benefits.map((benefit, idx) => (
                    <div key={idx} className="group flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                      <span className="text-2xl sm:text-3xl font-black text-blue-600 mt-0.5 sm:mt-1 group-hover:scale-125 transition-transform">✓</span>
                      <span className="text-gray-800 leading-relaxed text-sm sm:text-lg font-semibold">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Requirements */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-5xl">📋</span>
                  Yêu cầu cần có
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {selectedCert.requirements.map((req, idx) => (
                    <div key={idx} className="group flex items-start gap-3 sm:gap-4 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                      <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-base sm:text-xl rounded-full flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">{idx + 1}</span>
                      <span className="text-gray-800 leading-relaxed text-sm sm:text-lg font-semibold mt-0.5 sm:mt-1">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced CTA */}
              <div className={`relative bg-gradient-to-br ${selectedCert.gradient} rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center overflow-hidden shadow-2xl`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                <div className="relative">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">🚀</div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4 drop-shadow-lg">Sẵn sàng bắt đầu?</h3>
                  <p className="text-white/95 mb-6 sm:mb-8 text-base sm:text-xl font-semibold max-w-2xl mx-auto">Liên hệ với chúng tôi để được tư vấn chi tiết về chứng chỉ {selectedCert.name}</p>
                  <button 
                    onClick={() => setShowQRModal(true)}
                    className="group relative bg-white text-gray-900 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden w-full sm:w-auto"
                  >
                    <span className="relative z-10">🎯 Đăng ký tư vấn ngay</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {scrollY > 300 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-slow border-2 sm:border-4 border-white"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Enhanced Footer CTA */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div 
          id="footer-cta"
          data-scroll-reveal
          className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden border-2 sm:border-4 border-gray-700 transition-all duration-1000 ${
            visibleSections.has('footer-cta') 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 animate-pulse"></div>
          
          <div className="relative p-6 sm:p-10 md:p-20 text-center">
            <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 animate-bounce-slow">🎯</div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 drop-shadow-2xl px-2">
              Bắt đầu hành trình ngay hôm nay! 🚀
            </h2>
            <p className="text-base sm:text-2xl text-gray-300 mb-6 sm:mb-10 max-w-3xl mx-auto font-semibold leading-relaxed px-4">
              Đầu tư vào bản thân là khoản đầu tư <span className="text-yellow-400 font-black">sinh lời nhất</span>. 
              Hãy để chúng tôi đồng hành cùng bạn trên con đường chinh phục các chứng chỉ chuyên môn 💎
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center px-4">
              <button 
                onClick={() => setShowQRModal(true)}
                className="group relative bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  💬 Tư vấn miễn phí
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="group relative bg-white text-gray-900 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden w-full sm:w-auto">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  📚 Tải tài liệu
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Modal */}
      {showQRModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowQRModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
              {/* QR Code Image */}
                  <Image 
                    src="/zalo.jpg" 
                    alt="Zalo QR Code - Phạm Hoài Nghĩa" 
                    width={400}
                    height={400}
                    className="w-full h-auto max-w-sm mx-auto"
                    priority
                  />
                </div>
              </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-100px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(100px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        @keyframes zoomRotate {
          from { 
            opacity: 0; 
            transform: scale(0.3) rotate(-180deg); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) rotate(0); 
          }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-shine { animation: shine 2s infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
