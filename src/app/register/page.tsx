'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { authApi } from '@/lib/API/auth/auth.api'
import { RegisterDto, RoleName } from '@/types'

type RegisterFormData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
  role: RoleName
  isBuyer: boolean
  isStudent: boolean
}

type FormErrors = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  address?: string
  role?: string
  general?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: RoleName.USER,
    isBuyer: false,
    isStudent: false
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRoleChange = (value: RoleName) => {
    setFormData(prev => ({ ...prev, role: value }))
    if (errors.role) setErrors(prev => ({ ...prev, role: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    else if (formData.firstName.trim().length < 2) newErrors.firstName = 'Must be at least 2 characters'

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    else if (formData.lastName.trim().length < 2) newErrors.lastName = 'Must be at least 2 characters'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (!formData.role) newErrors.role = 'Role is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setErrors({})

    try {
      const registerData: RegisterDto = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        ...(formData.firstName && { firstName: formData.firstName.trim() }),
        ...(formData.lastName && { lastName: formData.lastName.trim() }),
        ...(formData.phone && { phone: formData.phone.trim() }),
        ...(formData.address && { address: formData.address.trim() }),
        ...(formData.isBuyer && { isBuyer: formData.isBuyer }),
        ...(formData.isStudent && { isStudent: formData.isStudent }),
      }

      await authApi.register(registerData)
      router.push('/login?message=Registration successful! Please log in.')
    } catch (error: any) {
      if (error.message.includes('409')) setErrors({ email: 'Email already registered.' })
      else setErrors({ general: error.message || 'Registration failed.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F4EA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg rounded-2xl overflow-hidden border border-[#E5D7C5]">
          <CardHeader className="space-y-1 bg-[#F5E6C4] px-6 py-4 text-center">
            <CardTitle className="text-2xl font-extrabold text-[#3E2F2F]">Create an account</CardTitle>
            <CardDescription className="text-[#3E2F2F] text-sm">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-4">
            {errors.general && (
              <Alert variant="destructive" className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? 'border-red-500' : ''} />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? 'border-red-500' : ''} />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1234567890" value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'border-red-500' : ''} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input id="address" name="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} className={errors.address ? 'border-red-500' : ''} />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="SUPPLIER">Supplier</SelectItem>
                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="isBuyer" checked={formData.isBuyer} onCheckedChange={checked => setFormData(prev => ({ ...prev, isBuyer: !!checked }))} />
                  <Label htmlFor="isBuyer">I want to purchase products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="isStudent" checked={formData.isStudent} onCheckedChange={checked => setFormData(prev => ({ ...prev, isStudent: !!checked }))} />
                  <Label htmlFor="isStudent">I want to enroll in courses</Label>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={formData.password} onChange={handleInputChange} className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'} />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-[#3E2F2F] to-[#F5E6C4] text-white font-bold hover:from-[#5A443F] hover:to-[#EED9B0]" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-6 py-4 bg-[#F5E6C4] text-center">
            <p className="text-sm text-[#3E2F2F]">
              Already have an account?{' '}
              <Link href="/login" className="font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
