'use client'

import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { useEffect, useState } from 'react'

export default function ContactPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
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

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
    }
  }, [])

  const teamMembers = [
    {
      name: "Phạm Hoài Nghĩa",
      role: "Trưởng nhóm",
      position: "Người sáng lập & CEO",
      avatar: "👨‍💼",
      gradientFrom: "#0ea5e9",
      gradientTo: "#3b82f6",
      bio: "Với 7+ năm kinh nghiệm trong lĩnh vực công nghệ giáo dục và tài chính, tôi đam mê xây dựng các giải pháp công nghệ giáo dục tiên tiến. Tầm nhìn của tôi là giúp mọi người tiếp cận kiến thức tài chính một cách dễ dàng và hiệu quả nhất.",
      phone: "0123 456 789",
      facebook: "https://facebook.com/hoainghia",
      gmail: "phamhoainghia@gmail.com",
      expertise: ["Chiến lược sản phẩm", "Quản lý đội ngũ", "Đổi mới công nghệ"],
      achievement: "🏆 Sáng lập 3 startup thành công"
    },
    {
      name: "Trần Minh Hoàng",
      role: "Thành viên",
      position: "Trưởng phát triển",
      avatar: "👨‍💻",
      gradientFrom: "#3b82f6",
      gradientTo: "#2563eb",
      bio: "Lập trình viên full-stack với niềm đam mê về clean code và trải nghiệm người dùng. Chuyên về React, Next.js, và Node.js. Tôi tin rằng công nghệ tốt phải đi kèm với trải nghiệm người dùng xuất sắc.",
      phone: "0987 654 321",
      facebook: "https://facebook.com/minhhoang",
      gmail: "tranminhhoang@gmail.com",
      expertise: ["React/Next.js", "Phát triển giao diện", "Kiến trúc hệ thống"],
      achievement: "💻 Hoàn thành 10+ dự án"
    },
    {
      name: "Nguyễn Thu Hà",
      role: "Thành viên",
      position: "Chuyên viên nội dung",
      avatar: "👩‍🎓",
      gradientFrom: "#06b6d4",
      gradientTo: "#0ea5e9",
      bio: "Chuyên gia nội dung với 5 năm kinh nghiệm trong lĩnh vực tài chính và chứng khoán. Tôi đảm bảo mọi câu hỏi và tài liệu đều chất lượng cao, cập nhật và phù hợp với chuẩn mực ngành.",
      phone: "0369 258 147",
      facebook: "https://facebook.com/thuha",
      gmail: "nguyenthuha@gmail.com",
      expertise: ["Chiến lược nội dung", "Giáo dục tài chính", "Kiểm soát chất lượng"],
      achievement: "📚 Biên soạn 500+ câu hỏi"
    }
  ]

  return (
    <MainLayout>
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(-10px) rotate(-2deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.3); }
          50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.6); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .scroll-animate {
          opacity: 0;
          transform: translateY(40px);
        }

        .scroll-animate.animate-in {
          animation: slide-up 0.8s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.3s; }
        .stagger-3 { animation-delay: 0.5s; }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .gradient-mesh {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .card-3d:hover {
          transform: rotateY(5deg) rotateX(5deg) scale(1.05);
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          100% { left: 100%; }
        }

        .text-gradient {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #2563eb 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 5s ease infinite;
        }

        .glow-on-hover {
          transition: all 0.3s ease;
        }

        .glow-on-hover:hover {
          box-shadow: 0 0 30px rgba(14, 165, 233, 0.6),
                      0 0 60px rgba(59, 130, 246, 0.4);
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50"></div>
        <div 
          className="absolute w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{ 
            top: '20%', 
            left: `${mousePosition.x * 0.02}%`,
            animation: 'float 20s infinite'
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{ 
            top: '40%', 
            right: `${mousePosition.x * 0.01}%`,
            animation: 'float 25s infinite 2s'
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
          style={{ 
            bottom: '20%', 
            left: '50%',
            animation: 'float 30s infinite 4s'
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full glassmorphism backdrop-blur-xl border border-white/30 mb-6 sm:mb-8 scroll-animate">
              <span className="text-2xl animate-pulse">✨</span>
              <span className="text-sm sm:text-base font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Hãy kết nối với chúng tôi
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 scroll-animate">
              <span className="text-gradient">Liên hệ với</span>
              <br />
              <span className="text-gray-900">Đội ngũ SecuriTest</span>
            </h1>

            <p className="text-base sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed scroll-animate">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.<br className="hidden sm:block" />
              Hãy kết nối với chúng tôi qua bất kỳ kênh nào!
            </p>

            {/* Contact Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 scroll-animate">
              <a href="mailto:contact@securitest.com" className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-sm sm:text-base">Gửi Email</span>
              </a>
              <a href="tel:1900123456" className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-cyan-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 border-2 border-cyan-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm sm:text-base">Gọi ngay</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-12 sm:py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-20 scroll-animate">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Gặp gỡ <span className="text-gradient">Đội ngũ tuyệt vời</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Những con người tài năng đứng sau thành công của SecuriTest
            </p>
          </div>

          {/* Team Leader Card - Full Width */}
          <div className="max-w-5xl mx-auto mb-8 sm:mb-16 scroll-animate">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 bg-white">
                <CardContent className="p-6 sm:p-10 lg:p-12">
                  <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl lg:text-7xl font-bold shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${teamMembers[0].gradientFrom}, ${teamMembers[0].gradientTo})`
                        }}
                      >
                        {teamMembers[0].avatar}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        👑 TRƯỞNG NHÓM
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="mb-3 sm:mb-4">
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2">
                          {teamMembers[0].name}
                        </h3>
                        <p className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          {teamMembers[0].position}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        {teamMembers[0].bio}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4 sm:mb-6">
                        {teamMembers[0].expertise.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-xs sm:text-sm font-semibold rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-center lg:justify-start gap-1 text-sm sm:text-base text-amber-600 font-semibold mb-6">
                        {teamMembers[0].achievement}
                      </div>

                      {/* Contact Buttons */}
                      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        <a href={`tel:${teamMembers[0].phone.replace(/\s/g, '')}`} className="group/btn flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-sm sm:text-base">{teamMembers[0].phone}</span>
                        </a>
                        <a href={`mailto:${teamMembers[0].gmail}`} className="group/btn flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          <span className="text-sm sm:text-base hidden sm:inline">Email</span>
                        </a>
                        <a href={teamMembers[0].facebook} target="_blank" rel="noopener noreferrer" className="group/btn flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm sm:text-base hidden sm:inline">Facebook</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Core Members - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {teamMembers.slice(1).map((member, index) => (
              <div 
                key={index}
                className={`scroll-animate stagger-${index + 2}`}
              >
                <div className="relative group h-full">
                  <div 
                    className="absolute inset-0 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`
                    }}
                  ></div>
                  <Card className="relative h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                    <CardContent className="p-6 sm:p-8">
                      {/* Avatar */}
                      <div className="flex justify-center mb-6">
                        <div 
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                          style={{
                            background: `linear-gradient(135deg, ${member.gradientFrom}, ${member.gradientTo})`
                          }}
                        >
                          {member.avatar}
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div className="text-center mb-4">
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          {member.position}
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center">
                        {member.bio}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {member.expertise.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 text-xs font-semibold rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Achievement */}
                      <div className="text-center text-xs sm:text-sm text-amber-600 font-semibold mb-6">
                        {member.achievement}
                      </div>

                      {/* Contact Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="flex items-center justify-center p-3 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </a>
                        <a href={`mailto:${member.gmail}`} className="flex items-center justify-center p-3 bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </a>
                        <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support & Social Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-600 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJWMjBoMnYxNHptMCAyaDJ2Mmgtng4MTZ6bS0yIDJ2Mmgteng0MTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Support Hours */}
            <div className="text-center mb-12 sm:mb-16 scroll-animate">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 mb-4 sm:mb-6">
                <span className="text-xl">⏰</span>
                <span className="text-sm sm:text-base font-semibold text-white">
                  Thời gian hỗ trợ
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto">
                Đội ngũ của chúng tôi làm việc không ngừng nghỉ để mang đến trải nghiệm tốt nhất
              </p>
            </div>

            {/* Support Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {[
                {
                  icon: "📞",
                  title: "Hotline",
                  time: "8:00 - 22:00",
                  desc: "Mọi ngày trong tuần"
                },
                {
                  icon: "💬",
                  title: "Chat trực tuyến",
                  time: "24/7",
                  desc: "Phản hồi trong vòng 5 phút"
                },
                {
                  icon: "📧",
                  title: "Email",
                  time: "24/7",
                  desc: "Phản hồi trong 2 giờ"
                }
              ].map((item, index) => (
                <div key={index} className="scroll-animate bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl sm:text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-2xl sm:text-3xl font-black text-white/90 mb-2">{item.time}</p>
                  <p className="text-sm sm:text-base text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="text-center scroll-animate">
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">
                Kết nối với chúng tôi trên mạng xã hội
              </h3>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
                {[
                  { name: "Facebook", icon: "👥", url: "https://facebook.com/securitest", color: "from-blue-500 to-blue-600" },
                  { name: "YouTube", icon: "📺", url: "https://youtube.com/securitest", color: "from-red-500 to-red-600" },
                  { name: "LinkedIn", icon: "💼", url: "https://linkedin.com/company/securitest", color: "from-cyan-500 to-blue-500" },
                  { name: "Zalo", icon: "💬", url: "https://zalo.me/securitest", color: "from-sky-500 to-cyan-500" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center gap-2 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-br ${social.color} text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}
                  >
                    <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300">{social.icon}</span>
                    <span className="text-sm sm:text-base">{social.name}</span>
                  </a>
                ))}
              </div>
              <p className="text-white/80 text-sm sm:text-base">
                💙 Theo dõi chúng tôi để cập nhật tin tức và tips ôn thi mới nhất!
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
