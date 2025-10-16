// Script để test API fetch question sets
// Chạy: node test-fetch-question-sets.js

async function testFetchQuestionSets() {
  console.log('🔍 Testing Question Sets API...\n');

  try {
    const url = 'http://localhost:3000/api/practice/question-sets';
    console.log(`📡 Fetching from: ${url}\n`);

    const response = await fetch(url);
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Status Text: ${response.statusText}\n`);

    const data = await response.json();
    
    console.log('📊 Response Data:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n📈 Summary:');
    console.log(`  - Total question sets: ${data.questionSets?.length || 0}`);
    console.log(`  - Success: ${data.success}`);
    
    if (data.questionSets && data.questionSets.length > 0) {
      console.log('\n📋 Question Sets:');
      data.questionSets.forEach((set, index) => {
        console.log(`  ${index + 1}. ${set.title} (${set.questionCount} câu)`);
      });
    } else {
      console.log('\n⚠️  Không có bộ đề nào trong database!');
      console.log('\n💡 Hướng dẫn:');
      console.log('  1. Đăng nhập với tài khoản admin');
      console.log('  2. Vào /admin/question-sets');
      console.log('  3. Tạo bộ đề mới');
      console.log('  4. Thêm câu hỏi vào bộ đề');
    }

    if (data.error) {
      console.log('\n❌ Error:', data.error);
      if (data.details) {
        console.log('   Details:', data.details);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Đảm bảo rằng:');
    console.log('  1. Dev server đang chạy (npm run dev)');
    console.log('  2. Server đang chạy trên port 3000');
    console.log('  3. Database được cấu hình đúng');
  }
}

testFetchQuestionSets();

