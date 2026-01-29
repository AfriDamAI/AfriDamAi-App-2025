import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        // Get the authorization token from the incoming request
        const authHeader = request.headers.get('authorization')
        
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Unauthorized - Please log in to view pricing plans' },
                { status: 401 }
            )
        }

        // Forward the request to the backend with the user's auth token
        const response = await fetch('https://afridamai-backend.onrender.com/api/pricing-plans', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader, // Forward the auth token
            },
            cache: 'no-store', // Disable caching to always get fresh data
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`Backend API error (${response.status}):`, errorText)
            
            if (response.status === 401) {
                return NextResponse.json(
                    { error: 'Unauthorized - Please log in again' },
                    { status: 401 }
                )
            }
            
            throw new Error(`Backend API responded with status: ${response.status}`)
        }

        const data = await response.json()
        
        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        })
    } catch (error) {
        console.error('Error fetching pricing plans from backend:', error)
        
        return NextResponse.json(
            { error: 'Failed to fetch pricing plans' },
            { status: 500 }
        )
    }
}
