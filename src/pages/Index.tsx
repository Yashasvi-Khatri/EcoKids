import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowRight, Plus, User, LogOut, Gift, Map, Navigation, MapPin, Calendar, X, Check, GraduationCap, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CarbonActivityCard from '@/components/CarbonActivityCard';
import MicroHabitCard from '@/components/MicroHabitCard';
import CarbonChart from '@/components/CarbonChart';
import UserProgress from '@/components/UserProgress';
import DayTracker from '@/components/DayTracker';
import CarbonActivityForm from '@/components/CarbonActivityForm';
import RoutePlannerForm from '@/components/RoutePlannerForm';
import Footer from '@/components/Footer';
import EcoHabitChatbot from '@/components/EcoHabitChatbot';
import { CarbonActivity, MOCK_ACTIVITIES, MOCK_USER, MicroHabit, getRandomMicroHabits, UserProfile } from '@/lib/carbon-utils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComp } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Reward {
  id: string; title: string; description: string; pointCost: number;
  emoji: string; category: 'voucher' | 'badge' | 'tier'; isAvailable: boolean;
}
interface EcoEvent {
  id: string; title: string; description: string; date: string;
  location: string; organizer: string; link: string;
  category: 'cleanup' | 'workshop' | 'protest' | 'fundraiser';
}
interface ExtendedUserProfile extends UserProfile {
  redeemedRewards?: string[]; treesPlanted?: number; role?: string; classCode?: string; email?: string;
}

// Leaderboard mock (classmates)
const MOCK_CLASSMATES = [
  { name: 'Aarav S.', points: 340, emoji: '🥇' },
  { name: 'Priya N.', points: 290, emoji: '🥈' },
  { name: 'Rohan G.', points: 210, emoji: '🥉' },
];

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<CarbonActivity[]>(MOCK_ACTIVITIES);
  const [user, setUser] = useState<ExtendedUserProfile | null>(null);
  const [habits, setHabits] = useState<MicroHabit[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [events, setEvents] = useState<EcoEvent[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const eventForm = useForm({
    defaultValues: { title: '', description: '', date: new Date(), location: '', organizer: '', link: '', category: 'cleanup' as const }
  });

  useEffect(() => {
    const stored = localStorage.getItem('ecoKidsUser') || localStorage.getItem('carbonCompanionUser');
    if (stored) {
      const u = JSON.parse(stored);
      if (!u.redeemedRewards) u.redeemedRewards = [];
      if (!u.treesPlanted) u.treesPlanted = 0;
      setUser(u);
    } else {
      setUser({ ...MOCK_USER, redeemedRewards: [], treesPlanted: 0 });
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const suggested = getRandomMicroHabits(6, activities).map(h => ({
      ...h, isAdopted: user.adoptedHabits.includes(h.id)
    }));
    setHabits(suggested);
    setRewards([
      { id: '1', title: '5% Off Eco Store', description: 'Get a discount at eco-friendly shops', pointCost: 200, emoji: '🛍️', category: 'voucher', isAvailable: user.points >= 200 },
      { id: '2', title: 'Tree Planter Badge', description: 'Earn this badge for adopting 5 eco-habits', pointCost: 100, emoji: '🌳', category: 'badge', isAvailable: user.points >= 100 },
      { id: '3', title: 'Eco Champion Tier', description: 'Unlock special features and exclusive rewards', pointCost: 500, emoji: '🏆', category: 'tier', isAvailable: user.points >= 500 },
      { id: '4', title: 'Green Star Certificate', description: 'Digital certificate for your eco efforts', pointCost: 300, emoji: '⭐', category: 'badge', isAvailable: user.points >= 300 },
    ]);
    setEvents([
      { id: '1', title: 'School Park Cleanup 🌿', description: 'Join us for a morning of cleaning up our school park and learning about local wildlife.', date: '2025-05-15', location: 'School Field', organizer: 'Eco Club', link: '#', category: 'cleanup' },
      { id: '2', title: 'Sustainable Living Workshop', description: 'Learn cool tips for reducing your carbon footprint in everyday life.', date: '2025-05-22', location: 'Online', organizer: 'Eco Warriors', link: '#', category: 'workshop' },
    ]);
  }, [activities, user?.adoptedHabits]);

  const saveUser = (updated: ExtendedUserProfile) => {
    setUser(updated);
    localStorage.setItem('ecoKidsUser', JSON.stringify(updated));
  };

  const handleAddActivity = (activity: CarbonActivity) => setActivities(prev => [activity, ...prev]);

  const handleAdoptHabit = (habitId: string) => {
    if (!user) return;
    const habitObj = habits.find(h => h.id === habitId);
    saveUser({ ...user, adoptedHabits: [...user.adoptedHabits, habitId], points: user.points + 10, totalSavedKg: user.totalSavedKg + (habitObj?.potentialSavingKg || 0) });
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, isAdopted: true } : h));
    toast({ title: '🌱 Habit adopted!', description: 'You earned 10 EcoXP — keep it up!' });
  };

  const handleAddCustomHabit = (habit: { name: string; description: string; carbonImpact: string }) => {
    const newHabit: MicroHabit = { id: `custom-${Date.now()}`, title: habit.name, icon: 'footprints', description: `${habit.description} (${habit.carbonImpact})`, potentialSavingKg: parseInt(habit.carbonImpact) || 5, difficulty: 'medium', category: 'home' };
    setHabits(prev => [newHabit, ...prev]);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (!user || user.points < reward.pointCost) {
      toast({ title: 'Not enough EcoXP!', description: `You need ${reward.pointCost - (user?.points || 0)} more points.`, variant: 'destructive' });
      return;
    }
    saveUser({ ...user, points: user.points - reward.pointCost, redeemedRewards: [...(user.redeemedRewards || []), reward.id] });
    toast({ title: `${reward.emoji} Reward claimed!`, description: `You've redeemed: ${reward.title}` });
  };

  const handleDonatePoints = (points: number, trees: number) => {
    if (!user || user.points < points) {
      toast({ title: 'Not enough EcoXP!', description: `Need ${points - (user?.points || 0)} more points.`, variant: 'destructive' });
      return;
    }
    saveUser({ ...user, points: user.points - points, treesPlanted: (user.treesPlanted || 0) + trees });
    toast({ title: '🌳 Trees planted!', description: `You donated ${points} XP to plant ${trees} real tree${trees > 1 ? 's' : ''}!` });
  };

  const handleLogout = () => {
    localStorage.removeItem('ecoKidsUser');
    localStorage.removeItem('carbonCompanionUser');
    navigate('/login');
  };

  const totalCarbon = activities.reduce((s, a) => s + a.carbonKg, 0);
  const nextTier = { name: 'Eco Champion', points: 500, progress: Math.min(((user?.points || 0) / 500) * 100, 100) };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading your eco-journey... 🌱</p></div>;

  const onSubmitEvent = (data: any) => {
    const newEvent: EcoEvent = { id: Math.random().toString(36).slice(2, 9), title: data.title, description: data.description, date: format(data.date, 'yyyy-MM-dd'), location: data.location, organizer: data.organizer || 'You', link: data.link || '#', category: data.category };
    setEvents([...events, newEvent]);
    setIsCreatingEvent(false);
    eventForm.reset();
    toast({ title: '📅 Event created!', description: 'Your eco event has been added to the board.' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b shadow-sm bg-background sticky top-0 z-30">
        <div className="container py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold eco-gradient-text">EcoKids</h1>
            {user.classCode && (
              <Badge variant="outline" className="hidden sm:inline-flex rounded-full text-xs">
                Class: {user.classCode}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-1" /> Log Activity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CarbonActivityForm onAddActivity={handleAddActivity} />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline font-medium">{user?.name || 'Explorer'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => navigate('/account')} className="rounded-lg">
                  <User className="h-4 w-4 mr-2 text-primary" /> My Account
                </DropdownMenuItem>
                {user.role === 'teacher' && (
                  <DropdownMenuItem onClick={() => navigate('/teacher')} className="rounded-lg">
                    <GraduationCap className="h-4 w-4 mr-2 text-blue-500" /> Teacher Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <div className="bg-muted/40 border-b sticky top-[61px] z-20">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent flex justify-start w-full gap-1 py-2 overflow-x-auto">
              {[
                { value: 'dashboard', label: '🏠 Home' },
                { value: 'activities', label: '📋 Activities' },
                { value: 'habits', label: '🌿 Habits' },
                { value: 'rewards', label: '🏆 Rewards' },
                { value: 'routeplanner', label: '🗺️ Commute' },
                { value: 'events', label: '📅 Events' },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}
                  className="rounded-full bg-background/70 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm whitespace-nowrap">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">

          {/* ─── DASHBOARD ─── */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Welcome banner */}
            <div className="hero-gradient rounded-2xl p-5 flex items-center justify-between border border-green-100">
              <div>
                <h2 className="text-2xl font-bold">Hello, {user.name}! 👋</h2>
                <p className="text-muted-foreground text-sm mt-1">You've saved <strong className="text-primary">{user.totalSavedKg} kg CO₂</strong> so far. Keep going, Eco Hero!</p>
              </div>
              <div className="text-5xl hidden sm:block animate-bounce-slow">🌍</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-sm border-2 border-primary/10 overflow-hidden">
                <CardContent className="p-0"><UserProgress user={user} /></CardContent>
              </Card>
              <Card className="shadow-sm border-2 border-orange-100 overflow-hidden">
                <CardContent className="p-0"><DayTracker activities={activities} /></CardContent>
              </Card>
              <Card className="shadow-sm border-2 border-blue-100 overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Total Impact 🌿</h3>
                  <p className="text-3xl font-bold eco-gradient-text">{totalCarbon.toFixed(1)} kg CO₂</p>
                  <p className="text-sm text-muted-foreground mt-2">From {activities.length} logged activities</p>
                  {/* Mini class leaderboard */}
                  <div className="mt-4 border-t border-blue-100 pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Class Top 3</p>
                    {MOCK_CLASSMATES.map((c, i) => (
                      <div key={i} className="flex justify-between text-sm py-0.5">
                        <span>{c.emoji} {c.name}</span>
                        <span className="font-semibold text-primary">{c.points} XP</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Route planner promo */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-teal-500" />
                      <CardTitle>🚴 Green Commute Explorer</CardTitle>
                    </div>
                    <CardDescription>Compare how much CO₂ you save by cycling, bussing, or walking to school instead of driving!</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full gap-2 rounded-full"><Navigation className="h-4 w-4" /> Plan my route</Button>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>🗺️ Green Commute Explorer</DialogTitle>
                  <DialogDescription>Enter your start and end points to see how eco-friendly your journey is!</DialogDescription>
                </DialogHeader>
                <RoutePlannerForm onCalculateRoutes={() => toast({ title: '✅ Route calculated!', description: 'Check out the eco-friendly options below.' })} />
              </DialogContent>
            </Dialog>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-2 border-green-100 overflow-hidden">
                <CardHeader className="pb-2"><CardTitle className="text-lg">📈 Daily CO₂ Footprint</CardTitle></CardHeader>
                <CardContent><CarbonChart activities={activities} chartType="daily" title="" /></CardContent>
              </Card>
              <Card className="shadow-sm border-2 border-green-100 overflow-hidden">
                <CardHeader className="pb-2"><CardTitle className="text-lg">🍕 CO₂ by Category</CardTitle></CardHeader>
                <CardContent><CarbonChart activities={activities} chartType="category" title="" /></CardContent>
              </Card>
            </div>

            {/* Suggested habits */}
            <Card className="shadow-sm border-2 border-yellow-100 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">⭐ Suggested Eco Habits</CardTitle>
                <CardDescription>Small changes that make a big difference for our planet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {habits.slice(0, 3).map(habit => (
                    <MicroHabitCard key={habit.id} habit={habit} isAdopted={user?.adoptedHabits.includes(habit.id) || false} onAdopt={handleAdoptHabit} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="ml-auto text-primary" onClick={() => setActiveTab('habits')}>
                  View all habits <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ─── ACTIVITIES ─── */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="shadow-sm border-2 border-green-100">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">📋 My Eco Activities</CardTitle>
                    <CardDescription>Track your daily eco-friendly actions</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="rounded-full"><Plus className="h-4 w-4 mr-2" /> Add Activity</Button>
                    </DialogTrigger>
                    <DialogContent><CarbonActivityForm onAddActivity={handleAddActivity} /></DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map(activity => (<CarbonActivityCard key={activity.id} activity={activity} />))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── HABITS ─── */}
          <TabsContent value="habits" className="space-y-6">
            <EcoHabitChatbot onAddHabit={handleAddCustomHabit} />
            <div className="grid grid-cols-1 gap-4">
              {habits.map(habit => (
                <MicroHabitCard key={habit.id} habit={habit} isAdopted={user?.adoptedHabits.includes(habit.id) || false} onAdopt={() => handleAdoptHabit(habit.id)} />
              ))}
            </div>
            <Card className="border-2 border-green-100 text-center">
              <CardContent className="py-8">
                <p className="text-lg mb-2 font-semibold">Your total impact so far</p>
                <p className="text-4xl font-bold eco-gradient-text mb-2">{user.totalSavedKg} kg CO₂ saved!</p>
                <p className="text-sm text-muted-foreground">That's like planting {Math.round(user.totalSavedKg / 20)} trees 🌳</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── REWARDS ─── */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="col-span-1 md:col-span-3 border-2 border-amber-100">
                <CardContent className="pt-6">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-bold eco-gradient-text">{user.points}</span>
                    <span className="text-muted-foreground pb-1">EcoXP</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Progress to Eco Champion 🏆</span>
                      <span className="text-sm font-semibold">{nextTier.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={nextTier.progress} className="h-3 rounded-full" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Current level</span>
                      <span className="text-xs text-muted-foreground">Eco Champion (500 XP)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-yellow-100">
                <CardContent className="pt-5">
                  <h3 className="font-bold text-base mb-3">Earn more XP 💡</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2 bg-yellow-50 p-2 rounded-lg"><span>🔥</span>7-day streak bonus</li>
                    <li className="flex gap-2 bg-green-50 p-2 rounded-lg"><span>🌿</span>Adopt 3 new habits</li>
                    <li className="flex gap-2 bg-blue-50 p-2 rounded-lg"><span>📉</span>Cut weekly emissions 5%</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-amber-100">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /> Available Rewards</CardTitle>
                <CardDescription>Spend your EcoXP on these eco-friendly rewards</CardDescription>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold">🌳 Donate XP to plant real trees</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ points: 50, trees: 1 }, { points: 100, trees: 2 }, { points: 200, trees: 5 }].map(o => (
                      <Button key={o.points} variant="outline" size="sm" className="rounded-full"
                        disabled={!user || user.points < o.points}
                        onClick={() => handleDonatePoints(o.points, o.trees)}>
                        {o.points} XP = {o.trees} tree{o.trees > 1 ? 's' : ''} 🌱
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rewards.map(reward => (
                    <Card key={reward.id} className={`border-2 ${reward.isAvailable ? 'border-green-200 hover:shadow-md transition-all' : 'border-gray-100 opacity-60'}`}>
                      <CardContent className="pt-5">
                        <div className="text-4xl text-center mb-3">{reward.emoji}</div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-sm">{reward.title}</h3>
                          <Badge variant={reward.isAvailable ? 'default' : 'outline'} className="rounded-full text-xs ml-1">{reward.pointCost} XP</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                        <Button className="w-full rounded-full text-sm" variant={reward.isAvailable ? 'default' : 'outline'}
                          disabled={!reward.isAvailable} onClick={() => handleRedeemReward(reward)}>
                          {reward.isAvailable ? 'Claim! 🎉' : `Need ${reward.pointCost - user.points} more`}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ROUTE PLANNER ─── */}
          <TabsContent value="routeplanner" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <Map className="h-5 w-5 text-primary" /> 🚴 Green Commute Explorer
              </h2>
              <p className="text-muted-foreground text-sm">See how much CO₂ you can save by choosing eco-friendly travel to school</p>
            </div>
            <RoutePlannerForm onCalculateRoutes={() => {
              if (user) saveUser({ ...user, points: user.points + 2 });
              toast({ title: '✅ Route planned!', description: 'You earned 2 EcoXP for planning a green route!' });
            }} />
            <Card className="border-2 border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-3">Why choose green travel? 🌿</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/80 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">↓15%</p>
                    <p className="text-xs text-muted-foreground">Less CO₂ on average</p>
                  </div>
                  <div className="text-center p-3 bg-white/80 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">💪</p>
                    <p className="text-xs text-muted-foreground">Better for your health</p>
                  </div>
                  <div className="text-center p-3 bg-white/80 rounded-xl">
                    <p className="text-2xl font-bold text-amber-600">+XP</p>
                    <p className="text-xs text-muted-foreground">Earn EcoXP points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── EVENTS ─── */}
          <TabsContent value="events" className="space-y-6">
            <Card className="border-2 border-green-100">
              <CardHeader>
                <CardTitle className="text-xl">📅 Eco Events Board</CardTitle>
                <CardDescription>Join school and community eco events — earn bonus XP for participating!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map(event => (
                    <Card key={event.id} className="border-2 border-green-100 hover:shadow-md transition-all">
                      <CardContent className="pt-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                            {event.category === 'cleanup' ? '🧹' : event.category === 'workshop' ? '🎓' : event.category === 'protest' ? '✊' : '💝'}
                          </div>
                          <Badge variant="default" className="rounded-full text-xs">{event.date}</Badge>
                        </div>
                        <h3 className="font-bold mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                        <p className="text-xs text-muted-foreground mb-3">📍 {event.location} · {event.organizer}</p>
                        <Button className="w-full rounded-full" variant="outline" onClick={() => window.open(event.link, '_blank')}>
                          Learn More →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 rounded-full border-2">
                  <Plus className="h-4 w-4" /> Host Your Own Eco Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>🌿 Host an Eco Event</DialogTitle>
                  <DialogDescription>Share your eco-initiative with your school community</DialogDescription>
                </DialogHeader>
                <Form {...eventForm}>
                  <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-4">
                    <FormField control={eventForm.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Event Title</FormLabel><FormControl><Input placeholder="School Litter Pick 🌿" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={eventForm.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Tell everyone about your event..." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={eventForm.control} name="date" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                          <Popover><PopoverTrigger asChild><FormControl>
                            <Button variant="outline" className="pl-3 text-left font-normal">
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl></PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComp mode="single" selected={field.value} onSelect={field.onChange} disabled={d => d < new Date()} initialFocus />
                            </PopoverContent>
                          </Popover><FormMessage /></FormItem>
                      )} />
                      <FormField control={eventForm.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                            <SelectContent>
                              <SelectItem value="cleanup">🧹 Cleanup</SelectItem>
                              <SelectItem value="workshop">🎓 Workshop</SelectItem>
                              <SelectItem value="protest">✊ Campaign</SelectItem>
                              <SelectItem value="fundraiser">💝 Fundraiser</SelectItem>
                            </SelectContent>
                          </Select><FormMessage /></FormItem>
                      )} />
                    </div>
                    <FormField control={eventForm.control} name="location" render={({ field }) => (
                      <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="School field or Online" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={eventForm.control} name="organizer" render={({ field }) => (
                      <FormItem><FormLabel>Organiser</FormLabel><FormControl><Input placeholder="Your name or club" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <DialogFooter>
                      <Button type="submit" className="rounded-full gap-2"><Check className="h-4 w-4" /> Post Event</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
