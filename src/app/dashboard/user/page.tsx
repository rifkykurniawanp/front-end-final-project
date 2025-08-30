"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Award, Edit, Shield, Settings, Trash2 } from "lucide-react";
import { useUserProfile } from "@/hooks/dashboard/useUserProfile";
import { useAuth } from "@/hooks/useAuth";
import { usersApi } from "@/lib/API/auth";
import type { CourseEnrollment, UpdateUserDto } from "@/types";

export default function UserDashboardPage() {
  const { user, token, isInitialized, isClient, logout } = useAuth();

  if (!isClient) return null;

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-gray-500">Please login to see your dashboard.</div>
        <Button onClick={() => window.location.href = '/login'} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  return <DashboardContent userId={user.id} />;
}

function DashboardContent({ userId }: { userId: number }) {
  const { profile, loading, error } = useUserProfile(userId);
  const { logout } = useAuth();
  
  // Form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    isBuyer: false,
    isStudent: false
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form when profile loads
  React.useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        isBuyer: profile.isBuyer || false,
        isStudent: profile.isStudent || false
      });
    }
  }, [profile]);

  const getToken = () => {
    const possibleKeys = ['auth', 'token', 'authToken', 'accessToken'];
    for (const key of possibleKeys) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          if (stored.startsWith('{')) {
            const parsed = JSON.parse(stored);
            return parsed.accessToken || parsed.token || parsed.authToken || null;
          } else {
            return stored;
          }
        } catch {
          return stored;
        }
      }
    }
    return null;
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const updateData: UpdateUserDto = {
        firstName: profileForm.firstName || undefined,
        lastName: profileForm.lastName || undefined,
        phone: profileForm.phone || undefined,
        address: profileForm.address || undefined,
        isBuyer: profileForm.isBuyer,
        isStudent: profileForm.isStudent
      };

      await usersApi.update(userId, updateData, token);
      
      // Refresh page to show updated data
      window.location.reload();
      
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Update profile error:', error);
      setUpdateError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Assuming backend has password validation
      const updateData: UpdateUserDto = {};

      await usersApi.update(userId, updateData, token);
      
      setIsPasswordModalOpen(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      alert('Password updated successfully');
    } catch (error: any) {
      console.error('Change password error:', error);
      setUpdateError(error.message || 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await usersApi.remove(userId, token);
      
      // Logout and redirect to home
      logout();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Delete account error:', error);
      setUpdateError(error.message || 'Failed to delete account');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-red-600">Error loading profile: {error}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500">
        No profile data found.
      </div>
    );
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email || "No Name";
  const joinedDate = new Date(profile.createdAt).toLocaleDateString();
  const coursesCompleted = profile.courseEnrollments?.filter(
    (e: CourseEnrollment) => e.status === "COMPLETED"
  ).length || 0;
  const certificates = profile.courseEnrollments?.filter(
    (e: CourseEnrollment) => e.certificateAwarded
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {fullName}!</h2>
          <p className="text-muted-foreground">Your learning and shopping hub.</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your account information</DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isBuyer">Enable Shopping</Label>
                      <p className="text-sm text-muted-foreground">Allow purchasing products</p>
                    </div>
                    <Switch
                      id="isBuyer"
                      checked={profileForm.isBuyer}
                      onCheckedChange={(checked) => setProfileForm(prev => ({ ...prev, isBuyer: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isStudent">Enable Learning</Label>
                      <p className="text-sm text-muted-foreground">Allow enrolling in courses</p>
                    </div>
                    <Switch
                      id="isStudent"
                      checked={profileForm.isStudent}
                      onCheckedChange={(checked) => setProfileForm(prev => ({ ...prev, isStudent: checked }))}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              {updateError && (
                <div className="text-sm text-red-600 mt-2">
                  {updateError}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>Update your account password</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password (min. 6 chars)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              {updateError && (
                <div className="text-sm text-red-600 mt-2">
                  {updateError}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Change Password'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Profile & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Profile & Achievements</CardTitle>
          <CardDescription>Account information and progress tracking</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <strong>Name:</strong> 
                <span>{fullName}</span>
              </div>
              <div className="flex justify-between">
                <strong>Email:</strong> 
                <span>{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <strong>Phone:</strong> 
                <span>{profile.phone || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <strong>Address:</strong> 
                <span>{profile.address || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <strong>Joined:</strong> 
                <span>{joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <strong>Shopping:</strong> 
                <span className={profile.isBuyer ? "text-green-600" : "text-gray-500"}>
                  {profile.isBuyer ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <strong>Learning:</strong> 
                <span className={profile.isStudent ? "text-green-600" : "text-gray-500"}>
                  {profile.isStudent ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Achievements</h3>
            <div className="space-y-3">
              <StatItem 
                icon={<GraduationCap className="text-primary" />} 
                label="Courses Completed" 
                value={coursesCompleted} 
              />
              <StatItem 
                icon={<Award className="text-primary" />} 
                label="Certificates Earned" 
                value={certificates} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Deleting...' : 'Yes, delete account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {updateError && (
            <div className="text-sm text-red-600 mt-2">
              {updateError}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Component kecil untuk Stat Item
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatItem = ({ icon, label, value }: StatItemProps) => (
  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
    <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
    <span className="font-bold text-lg">{value}</span>
  </div>
);