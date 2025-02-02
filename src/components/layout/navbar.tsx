"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Learn", href: "/learn", icon: Brain },
  { name: "Quizzes", href: "/quizzes", icon: BookOpen },
  { name: "AI Tutor", href: "/tutor", icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl gradient-text">
            AI Learning
          </Link>

          <div className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn("gap-2", pathname === item.href && "bg-accent")}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}

            {session ? (
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="gap-2 ml-4"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" asChild className="gap-2 ml-4">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
