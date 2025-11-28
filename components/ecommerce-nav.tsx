import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import Link from 'next/link'
import React, { JSX, useState } from 'react'
import { UserProfile } from './user-profile'
import { ChevronDown, Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react'
interface NavigationProps {
    onSignInClick: () => void
    onSignUpClick: () => void
}
export default function EcommerceNavigationMenu({ onSignInClick, onSignUpClick }: NavigationProps): JSX.Element {
    const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "signin" | "signup" }>({
        isOpen: false,
        type: "signin",
    })

    const handleSignIn = () => {
        setAuthModal({ isOpen: true, type: "signin" })
    }

    const handleSignUp = () => {
        setAuthModal({ isOpen: true, type: "signup" })
    }

    const handleCloseModal = () => {
        setAuthModal({ isOpen: false, type: "signin" })
    }
    const { theme, toggleTheme } = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user } = useAuth()


    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "/categories", label: "Categories" },
    ]

    const handleNavClick = (e: React.MouseEvent, href: string) => {
        const protectedRoutes = ["/dashboard", "/history"]
        if (protectedRoutes.includes(href) && !user) {
            e.preventDefault()
            onSignUpClick()
        }
    }
    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-lg text-foreground">AfriDamAI</span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-foreground hover:text-primary transition-colors"
                                    onClick={(e) => handleNavClick(e, link.href)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side actions */}
                        <button
                            // onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">{user?.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.name}</span>
                        </button>
                        <div className='max-w-20  bg-gray-400/30 rounded-full relative'>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Toggle theme"
                            >
                                <ShoppingBag size={20} />
                                <span className='absolute text-orange-400  font-extrabold -top-1.5 -right-1'>16</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-foreground" />
                            ) : (
                                <Menu className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-border bg-background">
                        <div className="px-4 py-4 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                                    onClick={(e) => {
                                        handleNavClick(e, link.href)
                                        setMobileMenuOpen(false)
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
