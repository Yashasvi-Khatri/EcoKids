import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Users, Trophy, Flame, Leaf, ArrowLeft, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock students data — in production this would be a Firestore query on classCode
const MOCK_STUDENTS = [
  { id: '1', name: 'Aarav Sharma',    points: 340, streakDays: 7,  totalSavedKg: 18.2, habitsAdopted: 6, level: 3 },
  { id: '2', name: 'Priya Nair',      points: 290, streakDays: 5,  totalSavedKg: 14.5, habitsAdopted: 5, level: 2 },
  { id: '3', name: 'Rohan Gupta',     points: 210, streakDays: 3,  totalSavedKg: 10.1, habitsAdopted: 4, level: 2 },
  { id: '4', name: 'Sneha Patel',     points: 175, streakDays: 9,  totalSavedKg: 8.8,  habitsAdopted: 3, level: 2 },
  { id: '5', name: 'Kabir Mehta',     points: 155, streakDays: 2,  totalSavedKg: 7.3,  habitsAdopted: 3, level: 1 },
  { id: '6', name: 'Anjali Singh',    points: 130, streakDays: 4,  totalSavedKg: 6.1,  habitsAdopted: 2, level: 1 },
  { id: '7', name: 'Dev Choudhary',   points: 95,  streakDays: 1,  totalSavedKg: 4.4,  habitsAdopted: 2, level: 1 },
  { id: '8', name: 'Meera Iyer',      points: 70,  streakDays: 0,  totalSavedKg: 2.9,  habitsAdopted: 1, level: 1 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('edoEducatorUser') || localStorage.getItem('ecoKidsUser');
    if (!stored) { navigate('/login'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'teacher') { navigate('/'); return; }
    setUser(u);
  }, [navigate]);

  if (!user) return null;

  const sortedStudents = [...MOCK_STUDENTS].sort((a, b) => b.points - a.points);
  const totalClassKg = MOCK_STUDENTS.reduce((s, st) => s + st.totalSavedKg, 0);
  const totalClassPoints = MOCK_STUDENTS.reduce((s, st) => s + st.points, 0);
  const avgStreak = (MOCK_STUDENTS.reduce((s, st) => s + st.streakDays, 0) / MOCK_STUDENTS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b shadow-sm bg-background">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div className="bg-primary/10 p-2 rounded-full">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold eco-gradient-text">Teacher Dashboard</h1>
              <p className="text-xs text-muted-foreground">Class code: <span className="font-bold text-primary">{user.classCode || 'GREEN7'}</span></p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full">
            🍎 {user.name}
          </Badge>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Class code share box */}
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="py-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Share this code with your students</p>
              <p className="text-4xl font-bold tracking-widest text-primary">{user.classCode || 'GREEN7'}</p>
            </div>
            <div className="flex-1 hidden sm:block border-l border-primary/20 pl-4">
              <p className="text-sm text-muted-foreground">Students enter this code during signup to join your class leaderboard automatically.</p>
            </div>
          </CardContent>
        </Card>

        {/* Class summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <Users className="h-7 w-7 text-blue-500 mx-auto mb-1" />
              <p className="text-3xl font-bold">{MOCK_STUDENTS.length}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <Leaf className="h-7 w-7 text-green-500 mx-auto mb-1" />
              <p className="text-3xl font-bold">{totalClassKg.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">kg CO₂ saved</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <Trophy className="h-7 w-7 text-amber-500 mx-auto mb-1" />
              <p className="text-3xl font-bold">{totalClassPoints}</p>
              <p className="text-xs text-muted-foreground">Total EcoXP</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-5 pb-4">
              <Flame className="h-7 w-7 text-orange-500 mx-auto mb-1" />
              <p className="text-3xl font-bold">{avgStreak}</p>
              <p className="text-xs text-muted-foreground">Avg streak days</p>
            </CardContent>
          </Card>
        </div>

        {/* Class CO₂ goal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Class Goal: 200 kg CO₂ saved
            </CardTitle>
            <CardDescription>Keep motivating your class to hit the goal!</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(totalClassKg / 200) * 100} className="h-4 rounded-full" />
            <p className="text-sm text-muted-foreground mt-2">{totalClassKg.toFixed(1)} / 200 kg — {((totalClassKg / 200) * 100).toFixed(0)}% complete</p>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Class Leaderboard
            </CardTitle>
            <CardDescription>Ranked by EcoXP — top 3 earn special badges this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedStudents.map((student, idx) => (
                <div key={student.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border ${idx < 3 ? 'border-amber-200 bg-amber-50/50' : 'border-border/50 bg-background'}`}>
                  <span className="text-2xl w-8 text-center font-bold">{getRankIcon(idx + 1)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{student.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-green-500" />{student.totalSavedKg} kg CO₂
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-400" />{student.streakDays}d streak
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />{student.habitsAdopted} habits
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">{student.points}</p>
                    <p className="text-xs text-muted-foreground">EcoXP</p>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex rounded-full">Lv {student.level}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherDashboard;
