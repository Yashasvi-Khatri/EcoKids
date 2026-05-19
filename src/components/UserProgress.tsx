import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserProfile } from '@/lib/carbon-utils';
import { Award, Flame, Star } from 'lucide-react';

interface UserProgressProps { user: UserProfile & { role?: string; classCode?: string }; }

const LEVEL_TITLES = ['Seedling 🌱', 'Sprout 🌿', 'Sapling 🌳', 'Eco Warrior 🦸', 'Planet Hero 🌍'];

const UserProgress: React.FC<UserProgressProps> = ({ user }) => {
  const nextLevelPoints = user.level * 100;
  const progressPercentage = Math.min((user.points / nextLevelPoints) * 100, 100);
  const levelTitle = LEVEL_TITLES[Math.min(user.level - 1, LEVEL_TITLES.length - 1)];

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" /> My Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-xl">
              {user.level <= 1 ? '🌱' : user.level <= 2 ? '🌿' : user.level <= 3 ? '🌳' : user.level <= 4 ? '🦸' : '🌍'}
            </div>
            <div>
              <p className="font-bold text-base">{levelTitle}</p>
              <p className="text-xs text-muted-foreground">{user.points} / {nextLevelPoints} XP</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-bold text-orange-600 text-sm">{user.streakDays} days</span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-3 rounded-full mb-1" />
        <p className="text-xs text-muted-foreground mb-4">{(nextLevelPoints - user.points)} XP to next level</p>
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl text-center">
          <p className="text-sm font-medium text-green-700">You've helped save</p>
          <p className="text-3xl font-bold eco-gradient-text">{user.totalSavedKg} kg CO₂</p>
          <p className="text-xs text-green-600 mt-1">= {Math.round(user.totalSavedKg / 20)} trees worth of oxygen! 🌳</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProgress;
