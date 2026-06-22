import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardAction } from '@repo/ui'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button variant="outline">Buttonaaaa</Button>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
      </Card>

      <div className="font-bold text-2xl">Vite + React</div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
