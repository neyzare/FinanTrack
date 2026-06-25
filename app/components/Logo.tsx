import { TrendingUp } from 'lucide-react';

interface LogoProps {
    showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
    return (
        <div className={`flex items-center gap-2`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#38BDF8] to-[#22C55E] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {showText && (
                <span className="text-xl tracking-tight">
          <span className="text-foreground">Finan</span>
          <span className="text-[#38BDF8]">track</span>
        </span>
            )}
        </div>
    );
}
