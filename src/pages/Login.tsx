import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, LogIn, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { MOCK_USER } from '@/lib/carbon-utils';
import { loginWithEmail, loginWithGoogle } from '@/lib/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || password.length < 6) {
      toast({ title: 'Oops!', description: 'Please check your email and password.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const userCredential = await loginWithEmail(email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        // Create user document if it doesn't exist
        userData = {
          ...MOCK_USER,
          email,
          name: email.split('@')[0],
          role: 'student',
          classCode: '',
          redeemedRewards: [],
          treesPlanted: 0,
          uid: userCredential.user.uid,
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      }
      
      localStorage.setItem('ecoEducatorUser', JSON.stringify(userData));
      toast({ title: '🌿 Welcome back!', description: `Great to see you, ${userData.name}!` });
      navigate(userData.role === 'teacher' ? '/teacher' : '/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({ title: 'Login failed', description: error.message || 'Please check your credentials.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const userCredential = await loginWithGoogle();
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
      } else {
        // Create user document if it doesn't exist
        userData = {
          ...MOCK_USER,
          email: userCredential.user.email,
          name: userCredential.user.displayName || 'Eco Explorer',
          role: 'student',
          classCode: '',
          redeemedRewards: [],
          treesPlanted: 0,
          uid: userCredential.user.uid,
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      }
      
      localStorage.setItem('ecoEducatorUser', JSON.stringify(userData));
      toast({ title: '🌿 Welcome back!', description: `Great to see you, ${userData.name}!` });
      navigate(userData.role === 'teacher' ? '/teacher' : '/');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({ title: 'Google login failed', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('ecoEducatorUser', JSON.stringify({
        ...MOCK_USER,
        email: 'demo@ecokids.app',
        name: 'Eco Explorer',
        role: 'student',
        classCode: 'DEMO01',
        isDemoAccount: true,
        redeemedRewards: [],
        treesPlanted: 2,
      }));
      toast({ title: '🌱 Demo mode!', description: 'Exploring Eco Educator with sample data.' });
      navigate('/');
    }, 800);
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
          <p className="text-gray-600 mt-2 text-lg">Learn. Act. Save the Planet 🌍</p>
        </div>

        <Card className="shadow-xl border-2 border-green-100">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" /> Welcome back!
            </CardTitle>
            <CardDescription>Sign in to continue your eco-journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@school.com" value={email}
                  onChange={e => setEmail(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)} className="mt-1" />
              </div>
              <Button type="submit" className="w-full text-lg py-5 rounded-xl" disabled={isLoading}>
                {isLoading ? 'Signing in...' : <><LogIn className="h-5 w-5 mr-2" /> Sign In</>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button variant="outline" className="w-full rounded-xl" onClick={handleGoogleLogin} disabled={isLoading}>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full rounded-xl" onClick={handleDemoLogin} disabled={isLoading}>
              🚀 Try Demo
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              New here?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">Create account</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
