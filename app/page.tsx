import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Meet <span className="text-primary">Peeko</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Your adorable AI robot companion that brings joy, fights boredom, and supports you every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg">Pre-Order Now</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Why Peeko is Special</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-semibold mb-2">Expressive Animations & Personality</h3>
            <p className="text-muted-foreground">
              Peeko performs cute animations and develops a unique personality. It even gets bored if ignored and shows it!
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="text-5xl mb-4">💌</div>
            <h3 className="text-2xl font-semibold mb-2">Pair with Valentine Mode</h3>
            <p className="text-muted-foreground">
              Connect two Peekos (yours and your partner's) to send direct messages, sweet animations, and feel closer even when apart.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="text-5xl mb-4">🗣️</div>
            <h3 className="text-2xl font-semibold mb-2">Voice-Activated AI Assistant</h3>
            <p className="text-muted-foreground">
              Talk to Peeko hands-free! It responds intelligently, plays music, sets reminders, and chats with you.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-2">Study Buddy</h3>
            <p className="text-muted-foreground">
              Peeko helps with learning: quizzes, explanations, timers, and motivational encouragement to keep you focused.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-2xl font-semibold mb-2">Combats Boredom & Supports Mental Health</h3>
            <p className="text-muted-foreground">
              With playful interactions, games, and empathetic responses, Peeko lifts your mood and helps ease feelings of loneliness or depression.
            </p>
          </div>

          <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="text-5xl mb-4">🤗</div>
            <h3 className="text-2xl font-semibold mb-2">Always There for You</h3>
            <p className="text-muted-foreground">
              Your loyal desktop or bedside companion that reacts to your voice, touch, and presence.
            </p>
          </div>
        </div>
      </section>

      {/* Placeholder for Images */}
      <section className="py-16 px-8 text-center">
        <p className="text-muted-foreground">(Images of Peeko would go here – cute robot animations, paired mode, etc.)</p>
      </section>
    </div>
  );
}