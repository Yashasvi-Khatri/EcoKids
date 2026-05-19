import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER } from '@/lib/carbon-utils';
import { signupWithEmail, loginWithGoogle } from '@/lib/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [classCode, setClassCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) {
      toast({ title: 'Oops!', description: 'Please fill all fields. Password must be 6+ characters.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Generate a class code for teachers
      const generatedClassCode = role === 'teacher'
        ? Math.random().toString(36).substring(2, 8).toUpperCase()
        : classCode.toUpperCase();

      const userCredential = await signupWithEmail(email, password);
      
      const userData = {
        ...MOCK_USER,
        name,
        email,
        role,
        classCode: generatedClassCode,
        points: 50, // welcome bonus
        redeemedRewards: [],
        treesPlanted: 0,
        uid: userCredential.user.uid,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      localStorage.setItem('ecoEducatorUser', JSON.stringify(userData));
      
      toast({ title: '🌱 Account created!', description: `Welcome to Eco Educator, ${name}! You earned 50 welcome points.` });
      navigate(role === 'teacher' ? '/teacher' : '/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({ title: 'Signup failed', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      
      const userData = {
        ...MOCK_USER,
        name: userCredential.user.displayName || 'Eco Explorer',
        email: userCredential.user.email,
        role: 'student',
        classCode: '',
        points: 50,
        redeemedRewards: [],
        treesPlanted: 0,
        uid: userCredential.user.uid,
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      localStorage.setItem('ecoEducatorUser', JSON.stringify(userData));
      
      toast({ title: '🌱 Account created!', description: `Welcome to Eco Educator, ${userData.name}!` });
      navigate('/');
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast({ title: 'Google signup failed', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Sprout className="h-14 w-14 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold eco-gradient-text">Eco Educator</h1>
          <p className="text-gray-600 mt-2 text-lg">Join thousands of young planet heroes! 🌍</p>
        </div>

        <Card className="shadow-xl border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Start your eco-adventure today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Eco Explorer" value={name}
                  onChange={e => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>I am a...</Label>
                <Select value={role} onValueChange={(v: 'student' | 'teacher') => setRole(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">🎒 Student</SelectItem>
                    <SelectItem value="teacher">🍎 Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {role === 'student' && (
                <div>
                  <Label htmlFor="classCode">Class Code (optional)</Label>
                  <Input id="classCode" placeholder="e.g. GREEN7" value={classCode}
                    onChange={e => setClassCode(e.target.value)} className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">Ask your teacher for the class code</p>
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@school.com" value={email}
                  onChange={e => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min. 6 characters" value={password}
                  onChange={e => setPassword(e.target.value)} className="mt-1" />
              </div>
              {role === 'teacher' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  🍎 A unique class code will be generated for your students to join your class.
                </div>
              )}
              <Button type="submit" className="w-full text-lg py-5 rounded-xl" disabled={isLoading}>
                {isLoading ? 'Creating account...' : '🌱 Join Eco Educator!'}
              </Button>
              <Button type="button" variant="outline" className="w-full text-lg py-5 rounded-xl" onClick={handleGoogleSignup} disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Continue with Google'}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
