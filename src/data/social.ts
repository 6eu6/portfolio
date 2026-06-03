export interface NavItem { label: string; href: string; sectionId: string; }

export interface SocialPlatform { name: string; description: string; metric: string; metricLabel: string; url: string; icon: string; color: string; }

export const navigation: NavItem[] = [
  { label: "Home", href: "#home", sectionId: "home" },
  { label: "Projects", href: "#projects-all", sectionId: "projects-all" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Blog", href: "#blog", sectionId: "blog" },
  { label: "Contact", href: "#contact", sectionId: "contact" }
];

export const stats = [
  { value: "20+", label: "Projects" },
  { value: "5+", label: "Years Building" },
  { value: "50+", label: "Articles" },
  { value: "10K+", label: "Community Reach" }
];

export const socialPlatforms: SocialPlatform[] = [
  { name: "GitHub", description: "Open source projects and developer tools", metric: "120+", metricLabel: "Repos", url: "#", icon: "Github", color: "#333" },
  { name: "Telegram", description: "Private channel with notes and resources", metric: "2.1K+", metricLabel: "Members", url: "#", icon: "Send", color: "#229ED9" },
  { name: "X / Twitter", description: "Short ideas, threads, and progress updates", metric: "3.2K+", metricLabel: "Followers", url: "#", icon: "Twitter", color: "#000" },
  { name: "LinkedIn", description: "Professional insights and collaborations", metric: "1.8K+", metricLabel: "Network", url: "#", icon: "Linkedin", color: "#0A66C2" },
  { name: "YouTube", description: "Tutorials, case studies, and walkthroughs", metric: "12K+", metricLabel: "Views", url: "#", icon: "Youtube", color: "#FF0000" },
  { name: "Newsletter", description: "Essays, frameworks, and curated resources", metric: "2.5K+", metricLabel: "Subscribers", url: "#", icon: "Mail", color: "#8FB7A6" }
];
