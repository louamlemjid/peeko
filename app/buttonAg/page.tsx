// app/page.tsx
import AggressiveButton from '@/components/ui/agressiveButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center gap-8 flex-wrap p-8">
      <AggressiveButton size="lg">Launch</AggressiveButton>
      
      <AggressiveButton size="md" variant="outline">
        Engage
      </AggressiveButton>
      
      <AggressiveButton size="sm" variant="ghost">
        Activate
      </AggressiveButton>
      
      <AggressiveButton size="lg" className="animate-pulse">
        Destroy
      </AggressiveButton>
    </div>
  );
}