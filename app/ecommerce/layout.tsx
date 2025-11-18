import { AppWrapper } from '@/components/app-wrapper'
import EcommerceNavigationMenu from '@/components/ecommerce-nav'
import React from 'react'

export default function EcommerceLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <AppWrapper>
            {children}
        </AppWrapper>
    )
}
