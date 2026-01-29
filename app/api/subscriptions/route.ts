import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export async function POST(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1]
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const decodedToken: any = jwtDecode(token)
        const userId = decodedToken.userId

        const body = await request.json()
        const { planId, startDate, endDate } = body

        if (!planId || !startDate || !endDate) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }

        // In a real app, you'd save this to a database
        const newSubscription = {
            id: `cmkznwe5o0001vcj43ibt1nhx_${Date.now()}`, // Mocked ID
            userId,
            planId,
            startDate,
            endDate,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        console.log("Created new subscription:", newSubscription)

        return NextResponse.json({
            status: true,
            message: 'Subscription created successfully',
            data: newSubscription
        })

    } catch (error: any) {
        console.error("Subscription creation failed:", error)
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
