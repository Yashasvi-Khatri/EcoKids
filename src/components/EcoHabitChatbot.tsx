import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Leaf, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = { role: 'user' | 'assistant'; content: string; };
type SuggestedHabit = { name: string; description: string; carbonImpact: string; };

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export default function EcoHabitChatbot({ onAddHabit }: { onAddHabit: (habit: SuggestedHabit) => void }) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi there, Eco Hero! 🌱 I'm EcoCoach, your friendly planet helper! Tell me about a green habit you'd like to try — like saving water, cycling to school, or eating less meat — and I'll help you understand how it helps the Earth!"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedHabit, setSuggestedHabit] = useState<SuggestedHabit | null>(null);
  const { toast } = useToast();

  const analyzeHabit = async (habitDescription: string): Promise<SuggestedHabit> => {
    const prompt = `You are EcoCoach, a friendly and encouraging environmental tutor for school children aged 8-16. 
A student wants to try this habit: "${habitDescription}"

Your job:
1. If this is an eco-friendly habit, APPROVE it with a fun, simple explanation a child can understand.
2. If it's harmful to the environment, kindly REJECT and suggest a better alternative.
3. Keep all language positive, age-appropriate, and encouraging.
4. Never discuss anything unrelated to environment/nature/habits.

Respond ONLY with this JSON (no extra text):
{
  "status": "APPROVED" | "REJECTED",
  "name": "Short habit name (max 4 words)",
  "description": "One fun sentence explaining why this helps the Earth, suitable for a child",
  "carbonImpact": "X kg CO2/month"
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error('Could not reach EcoCoach right now');
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
    if (json.status === 'REJECTED') throw new Error(json.description || 'That habit might not help the planet.');
    if (!json.name || !json.description) throw new Error('Invalid response');
    return { name: json.name, description: json.description, carbonImpact: json.carbonImpact };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    try {
      const habit = await analyzeHabit(input);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great idea, Eco Hero! 🌟\n\n✅ Habit: ${habit.name}\n🌍 Why it helps: ${habit.description}\n💚 Impact: ${habit.carbonImpact} saved!\n\nWant to add this to your eco-habits?`
      }]);
      setSuggestedHabit(habit);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Hmm, let me think about that... 🤔\n\n${err.message}\n\nTry something like: "Walk to school instead of driving" or "Turn off lights when leaving a room"!`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!suggestedHabit) return;
    onAddHabit(suggestedHabit);
    setMessages([{
      role: 'assistant',
      content: `Awesome! 🎉 "${suggestedHabit.name}" is now in your habit list! Keep it up, Eco Hero! What other green habits do you want to try?`
    }]);
    setSuggestedHabit(null);
    toast({ title: '🌱 Habit added!', description: `Keep up the great work!` });
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">EcoCoach AI 🤖🌿</CardTitle>
              <p className="text-xs text-muted-foreground">Your friendly planet helper</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {
            setMessages([{ role: 'assistant', content: "Hi again, Eco Hero! 🌱 What green habit shall we explore today?" }]);
            setSuggestedHabit(null);
          }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${
                msg.role === 'assistant'
                  ? 'bg-white border border-green-100 text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-green-100 rounded-2xl px-4 py-2 text-sm text-muted-foreground animate-pulse">
                EcoCoach is thinking... 🌿
              </div>
            </div>
          )}
        </div>
        {suggestedHabit && (
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSuggestedHabit(null)}>
              Not now
            </Button>
            <Button size="sm" className="rounded-full gap-1" onClick={handleAdd}>
              <Leaf className="h-4 w-4" /> Add this habit!
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)}
            placeholder="e.g. Walk to school instead of driving 🚶"
            disabled={isLoading} className="rounded-full" />
          <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-full">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
