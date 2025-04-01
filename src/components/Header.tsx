
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.header 
      className="w-full px-4 py-6 flex flex-col items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl flex justify-between items-center mb-12">
        <div className="flex items-center">
          <AnimatedLogo />
          <motion.h2 
            className="text-xl font-bold ml-2 hidden sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            SnapSummary
          </motion.h2>
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/pricing">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {features.map((feature) => (
                    <ListItem
                      key={feature.title}
                      title={feature.title}
                      href={feature.href}
                    >
                      {feature.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="hidden sm:inline-flex"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
        </div>
      </div>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold tracking-tight mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        SnapSummary
      </motion.h1>
      
      <motion.p 
        className="text-muted-foreground mt-4 max-w-xl text-center text-balance px-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        AI-powered summarization for text, articles, and documents — now with premium features
      </motion.p>
    </motion.header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const features = [
  {
    title: "Text Summarization",
    href: "/dashboard",
    description: "Quickly summarize any text content with our advanced AI."
  },
  {
    title: "URL Summarization",
    href: "/dashboard?tab=url",
    description: "Extract and summarize content from any webpage with a single click."
  },
  {
    title: "PDF Summarization",
    href: "/dashboard?tab=url",
    description: "Upload PDF documents and get concise summaries instantly."
  },
  {
    title: "YouTube Summaries",
    href: "/dashboard?tab=youtube",
    description: "Summarize YouTube videos without watching the entire content."
  },
];

export default Header;
