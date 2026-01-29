import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // In a real application, you would validate the token
    // and fetch the user from your database.
    const token = request.headers.get('Authorization')

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Mock user data
    const user = {
        id: 'cmkv8171p0000vc78oe4cunwh',
        name: 'John Doe',
        email: 'john.doe@example.com',
    }

    return NextResponse.json(user)
}
