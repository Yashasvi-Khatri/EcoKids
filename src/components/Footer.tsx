import React from 'react';
import { Sprout, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="border-t bg-background mt-auto">
    <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="flex items-center gap-2">
        <Sprout className="h-5 w-5 text-primary" />
        <span className="font-bold eco-gradient-text text-lg">EcoKids</span>
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        Made with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> for young planet heroes
      </p>
      <p className="text-xs text-muted-foreground">© 2025 EcoKids · Saving the planet, one habit at a time 🌍</p>
    </div>
  </footer>
);

export default Footer;
