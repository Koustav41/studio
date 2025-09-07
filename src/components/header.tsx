import { Compass } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Compass className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">
              Internship Compass
            </h1>
            <p className="text-sm text-muted-foreground">
              Your Guide to the PM Internship Scheme
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
