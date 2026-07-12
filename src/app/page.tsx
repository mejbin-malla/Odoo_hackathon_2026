"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, TrendingUp, Users, ArrowRight, Activity, MapPin, Settings, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              TransitOps
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle iconOnly />
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/login">
              <Button className="rounded-full shadow-lg shadow-primary/20 group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-status-success/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              TransitOps 2.0 is now live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold font-heading leading-[1.1] tracking-tight text-foreground">
              Fleet management <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-400">
                built for the future.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Automate fleet operations, track maintenance in real-time, and control total costs. The modern operating system for fleets of all sizes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-xl shadow-primary/25 group w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-border/60 hover:bg-muted/50 w-full sm:w-auto">
                Book a Demo
              </Button>
            </div>
            
            <div className="pt-4 flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=transparent`} alt="avatar" />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="text-foreground font-bold">10,000+</span> fleet managers</p>
            </div>
          </motion.div>

          {/* Floating UI Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Mockup Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/60 shadow-2xl rounded-3xl p-6 relative z-20"
            >
              <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Truck className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold font-heading">Volvo FH16-A</h3>
                    <p className="text-xs text-status-success font-medium flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-status-success"></div> Active on Route
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Max Capacity</p>
                  <p className="font-bold">4000kg</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/40 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-status-success/10 p-2 rounded-xl text-status-success">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Driver Safety Score</p>
                    <p className="text-xs text-muted-foreground">Score: 95/100 (Excellent)</p>
                  </div>
                </div>
                <div className="bg-muted/40 rounded-2xl p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Current Trip</p>
                    <p className="text-xs text-muted-foreground">New York → Boston</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 1 */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-card/80 backdrop-blur-xl border border-border/60 shadow-xl rounded-2xl p-5 z-30 hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-status-success/10 p-3 rounded-full text-status-success">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-heading">Active</p>
                  <p className="text-xs text-muted-foreground font-medium">License Status</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div 
              animate={{ y: [0, -25, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 -right-10 bg-card/80 backdrop-blur-xl border border-border/60 shadow-xl rounded-2xl p-5 z-30 hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <div className="bg-status-warning/10 p-3 rounded-full text-status-warning">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-heading">$1,450</p>
                  <p className="text-xs text-muted-foreground font-medium">Trip Expense</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">Everything you need to manage your fleet</h2>
            <p className="text-lg text-muted-foreground">TransitOps provides purpose-built workflows tailored for every role in your transport operation.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Settings className="w-6 h-6 text-primary" />}
              title="Fleet Managers"
              description="Add and manage vehicles, create new trips, assign drivers, and oversee the entire operation from a central dashboard."
              delay={0}
            />
            <FeatureCard 
              icon={<Truck className="w-6 h-6 text-status-info" />}
              title="Drivers"
              description="Sign up securely, view your assigned trips, and mark trips as completed once the cargo is delivered."
              delay={0.1}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-6 h-6 text-status-warning" />}
              title="Safety Officers"
              description="Monitor driver safety scores and get automated alerts for upcoming or expired driver licenses."
              delay={0.2}
            />
            <FeatureCard 
              icon={<TrendingUp className="w-6 h-6 text-status-success" />}
              title="Financial Analysts"
              description="Calculate total trip expenses, track cargo weight vs distance, and download CSV reports."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-accent-500" />}
              title="Role-Based Access"
              description="Secure authentication ensures each user only sees the data and actions relevant to their specific role."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-status-alert" />}
              title="Live Validation"
              description="Built-in business logic prevents assigning expired drivers or overloading vehicles past their maximum capacity."
              delay={0.5}
            />
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6 text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading tracking-tight">Ready to optimize your fleet?</h2>
          <p className="text-xl text-muted-foreground">Join thousands of fleet managers who use TransitOps to reduce costs and improve safety.</p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-xl shadow-primary/25 w-full sm:w-auto">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full bg-background w-full sm:w-auto border-border/60">
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xl font-heading font-extrabold tracking-tight">
              TransitOps
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span className="hover:text-foreground cursor-pointer">Terms</span>
            <span className="hover:text-foreground cursor-pointer">Security</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 TransitOps. All rights reserved.</p>
        </motion.div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className="bg-card/60 backdrop-blur-lg border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold font-heading mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
