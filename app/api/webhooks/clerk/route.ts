import { createUser } from '@/service/user'
import { WebhookEvent } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await request.json()
    
    if(payload.type === "user.created"){
      const user = await createUser({
        clerkId:payload.data.id,
        firstName:payload.data.first_name,
        lastName:payload.data.last_name,
        username:payload.data.username || ""
      })
    }

  console.log(payload)
  return Response.json({ message: 'Received' })
  } catch (error) {
    
  }
}