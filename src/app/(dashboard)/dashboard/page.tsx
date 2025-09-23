'use client'

import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layouts/MainLayout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const { user, isAuthenticated, signOut } = useAuth()

  if (!isAuthenticated) {
    return (
      <MainLayout showSidebar={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout showSidebar={true}>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng trở lại, {user?.user_metadata?.full_name || 'Bạn'}! 👋
          </h1>
          <p className="text-gray-600">
            Sẵn sàng để bắt đầu một bài thi mới hoặc tiếp tục luyện tập?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-sm text-gray-600">Bài thi đã hoàn thành</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
              <p className="text-sm text-gray-600">Điểm trung bình</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">24h</div>
              <p className="text-sm text-gray-600">Thời gian học tuần này</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">7</div>
              <p className="text-sm text-gray-600">Ngày liên tiếp</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Exam */}
          <Card>
            <CardHeader>
              <CardTitle>Thi Nhanh</CardTitle>
              <CardDescription>
                Bắt đầu một bài thi ngay lập tức với các câu hỏi ngẫu nhiên
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  Bắt đầu thi ngay
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">10 câu</Button>
                  <Button variant="outline" size="sm">20 câu</Button>
                  <Button variant="outline" size="sm">30 câu</Button>
                  <Button variant="outline" size="sm">50 câu</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Practice Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Luyện Tập</CardTitle>
              <CardDescription>
                Luyện tập theo chủ đề hoặc độ khó cụ thể
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full" size="lg">
                  Chọn chủ đề luyện tập
                </Button>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Toán học</span>
                    <span className="text-gray-500">120 câu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Văn học</span>
                    <span className="text-gray-500">95 câu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiếng Anh</span>
                    <span className="text-gray-500">200 câu</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Xem lại các bài thi và luyện tập gần đây của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Bài thi Toán học #{item}</h4>
                    <p className="text-sm text-gray-600">Hoàn thành vào 2 giờ trước</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">8.5/10</div>
                    <p className="text-sm text-gray-600">85%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-gray-600">
            Đăng nhập lần cuối: {new Date().toLocaleString('vi-VN')}
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Đăng xuất
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
