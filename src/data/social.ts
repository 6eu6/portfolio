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
  { value: "9+", label: "Projects Built" },
  { value: "4", label: "Live Products" },
  { value: "4", label: "Open Source Repos" },
  { value: "10+", label: "Technologies" }
];

export const socialPlatforms: SocialPlatform[] = [
  { name: "GitHub", description: "Projects, open source work, and experiments", metric: "9+", metricLabel: "Projects", url: "https://github.com/6eu6", icon: "Github", color: "#333" },
  { name: "LinkedIn", description: "Professional profile and work experience", metric: "Open", metricLabel: "To Work", url: "https://www.linkedin.com/in/ahmed-a-14050a383", icon: "Linkedin", color: "#0A66C2" },
  { name: "Email", description: "The fastest way to reach me directly", metric: "24h", metricLabel: "Response", url: "mailto:Ahmed-alshaibani@outlook.com", icon: "Mail", color: "#8FB7A6" }
];
