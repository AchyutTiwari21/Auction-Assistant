import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User,
  Save, 
  Mail, 
  Calendar,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  dob: z.string().min(1, 'Date of birth is required'),
  username: z.string().min(5, 'Username must be 5 characters.')
});

type ProfileForm = z.infer<typeof profileSchema>;

interface UserData {
  id: string;
  name: string;
  email: string;
  dob: string;
  picture: string | null;
  username: string;
  isAuthenticated: boolean;
}

export function UserProfile() {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const userData = useSelector((state: any) => state.auth.userData);
  const isAuthenticated = useSelector((state: any) => state.auth.status);

  const [user, setUser] = useState<UserData>({...userData, isAuthenticated});
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      dob: user.dob,
      username: user.username
    },
  });

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const imageUrl = e.target?.result as string;
  //       const updatedUser = { ...user, picture: imageUrl };
  //       setUser(updatedUser);
  //       localStorage.setItem('user', JSON.stringify(updatedUser));
  //       setSaveMessage('Profile picture updated successfully!');
  //       setTimeout(() => setSaveMessage(''), 3000);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleRemoveImage = () => {
  //   const updatedUser = { ...user, picture: null };
  //   setUser(updatedUser);
  //   localStorage.setItem('user', JSON.stringify(updatedUser));
  //   setSaveMessage('Profile picture removed successfully!');
  //   setTimeout(() => setSaveMessage(''), 3000);
  // };

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    reset({
      name: user.name,
      email: user.email,
      dob: user.dob,
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and personal information
        </p>
      </div>

      {/* Success/Error Messages */}
      {saveMessage && (
        <Alert className={saveMessage.includes('successfully') ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}>
          {saveMessage.includes('successfully') ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Picture Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload or change your profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.picture || undefined} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            {/* <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                {user.picture ? 'Change' : 'Upload'}
              </Button>
              
              {user.picture && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div> */}
            
            {/* <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            /> */}
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register('username')}
                    className={errors.username ? 'border-destructive' : ''}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dob')}
                    className={errors.dob ? 'border-destructive' : ''}
                  />
                  {errors.dob && (
                    <p className="text-sm text-destructive">{errors.dob.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={!isDirty || isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Display Mode */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.name}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(user.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="inline-flex flex-col space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">User Name</Label>
                    <span className="text-sm font-mono">{user.username}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}