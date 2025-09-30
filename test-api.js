const testRegisterAPI = async () => {
  try {
    console.log('Testing Register API...')
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        password: '123456'
      })
    })
    
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testRegisterAPI()
