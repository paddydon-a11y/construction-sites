export interface Project {
  name: string;
  trade: string;
  location: string;
  // Hero style config: each combo creates a unique look
  bg: string;           // tailwind gradient/bg classes
  accent: string;       // accent colour for buttons/highlights
  textColor: string;    // main text colour
  layout: 'centered' | 'left' | 'right' | 'split' | 'bold' | 'minimal';
}

export const projects: Project[] = [
  { name: "Spark Brothers Electrical", trade: "Electricians", location: "Manchester", bg: "from-blue-900 to-blue-700", accent: "bg-yellow-400", textColor: "text-white", layout: "centered" },
  { name: "Dave Wilson Plumbing", trade: "Plumbers", location: "Leeds", bg: "from-sky-800 to-sky-600", accent: "bg-orange-400", textColor: "text-white", layout: "left" },
  { name: "NorthPoint Roofing", trade: "Roofers", location: "Newcastle", bg: "from-slate-900 to-slate-700", accent: "bg-red-500", textColor: "text-white", layout: "bold" },
  { name: "Greenway Landscapes", trade: "Landscapers", location: "Bristol", bg: "from-green-900 to-green-700", accent: "bg-lime-400", textColor: "text-white", layout: "split" },
  { name: "Apex Building Solutions", trade: "Builders", location: "Birmingham", bg: "from-amber-600 to-amber-800", accent: "bg-white", textColor: "text-white", layout: "right" },
  { name: "ProHeat Gas Services", trade: "Heating Engineers", location: "Sheffield", bg: "from-red-900 to-red-700", accent: "bg-orange-400", textColor: "text-white", layout: "minimal" },
  { name: "Summit Scaffolding", trade: "Scaffolders", location: "London", bg: "from-zinc-900 to-zinc-700", accent: "bg-yellow-400", textColor: "text-white", layout: "centered" },
  { name: "Precision Plastering", trade: "Plasterers", location: "Liverpool", bg: "from-stone-200 to-stone-100", accent: "bg-stone-800", textColor: "text-stone-900", layout: "left" },
  { name: "ClearView Windows & Doors", trade: "Window Fitters", location: "Nottingham", bg: "from-cyan-700 to-cyan-500", accent: "bg-white", textColor: "text-white", layout: "bold" },
  { name: "Oakwood Joinery", trade: "Joiners", location: "Edinburgh", bg: "from-amber-900 to-amber-700", accent: "bg-amber-300", textColor: "text-white", layout: "split" },
  { name: "RapidFix Drainage", trade: "Drainage", location: "Glasgow", bg: "from-teal-900 to-teal-700", accent: "bg-teal-300", textColor: "text-white", layout: "right" },
  { name: "ProTile Solutions", trade: "Tilers", location: "Cardiff", bg: "from-indigo-900 to-indigo-700", accent: "bg-indigo-300", textColor: "text-white", layout: "minimal" },
  { name: "Stronghold Groundworks", trade: "Groundworkers", location: "Leicester", bg: "from-yellow-600 to-yellow-800", accent: "bg-black", textColor: "text-white", layout: "centered" },
  { name: "Bright Spark Electrics", trade: "Electricians", location: "Southampton", bg: "from-gray-950 to-gray-800", accent: "bg-yellow-400", textColor: "text-white", layout: "bold" },
  { name: "K&S Bricklaying", trade: "Bricklayers", location: "Brighton", bg: "from-orange-800 to-orange-600", accent: "bg-white", textColor: "text-white", layout: "left" },
  { name: "TopDeck Fencing", trade: "Fencing", location: "Manchester", bg: "from-emerald-900 to-emerald-700", accent: "bg-emerald-300", textColor: "text-white", layout: "split" },
  { name: "Premier Paving Co", trade: "Paving", location: "London", bg: "from-gray-200 to-gray-100", accent: "bg-gray-900", textColor: "text-gray-900", layout: "right" },
  { name: "Lockdown Security", trade: "Locksmiths", location: "Leeds", bg: "from-gray-900 to-black", accent: "bg-red-600", textColor: "text-white", layout: "minimal" },
  { name: "BrushStroke Decorators", trade: "Painters & Decorators", location: "Bristol", bg: "from-purple-800 to-purple-600", accent: "bg-pink-400", textColor: "text-white", layout: "centered" },
  { name: "Hargreaves Heating", trade: "Heating Engineers", location: "Liverpool", bg: "from-red-700 to-orange-600", accent: "bg-white", textColor: "text-white", layout: "left" },
  { name: "TotalDemo Demolition", trade: "Demolition", location: "Birmingham", bg: "from-black to-zinc-800", accent: "bg-yellow-500", textColor: "text-white", layout: "bold" },
  { name: "FreshFlow Plumbing", trade: "Plumbers", location: "Newcastle", bg: "from-blue-600 to-blue-400", accent: "bg-white", textColor: "text-white", layout: "split" },
  { name: "Metro Kitchen Fitters", trade: "Kitchen Fitters", location: "London", bg: "from-neutral-100 to-white", accent: "bg-neutral-900", textColor: "text-neutral-900", layout: "right" },
  { name: "AquaLux Bathrooms", trade: "Bathroom Fitters", location: "Sheffield", bg: "from-sky-600 to-sky-400", accent: "bg-sky-100", textColor: "text-white", layout: "minimal" },
  { name: "Redline Roofing", trade: "Roofers", location: "Glasgow", bg: "from-red-800 to-red-600", accent: "bg-white", textColor: "text-white", layout: "centered" },
  { name: "Taylor Made Joinery", trade: "Joiners", location: "Nottingham", bg: "from-yellow-800 to-yellow-600", accent: "bg-yellow-200", textColor: "text-white", layout: "left" },
  { name: "PowerGrid Electrical", trade: "Electricians", location: "Edinburgh", bg: "from-blue-950 to-blue-800", accent: "bg-blue-400", textColor: "text-white", layout: "bold" },
  { name: "SolidBase Construction", trade: "Builders", location: "Cardiff", bg: "from-orange-700 to-orange-500", accent: "bg-black", textColor: "text-white", layout: "split" },
  { name: "Greenfield Landscaping", trade: "Landscapers", location: "Leicester", bg: "from-green-800 to-green-600", accent: "bg-white", textColor: "text-white", layout: "right" },
  { name: "Pinnacle Plastering", trade: "Plasterers", location: "Southampton", bg: "from-rose-200 to-rose-100", accent: "bg-rose-700", textColor: "text-rose-900", layout: "minimal" },
  { name: "AllAccess Scaffolding", trade: "Scaffolders", location: "Brighton", bg: "from-zinc-800 to-zinc-600", accent: "bg-amber-400", textColor: "text-white", layout: "centered" },
  { name: "Phoenix Groundworks", trade: "Groundworkers", location: "Manchester", bg: "from-orange-900 to-red-800", accent: "bg-orange-300", textColor: "text-white", layout: "left" },
  { name: "SecureKey Locksmiths", trade: "Locksmiths", location: "Birmingham", bg: "from-gray-800 to-gray-600", accent: "bg-green-400", textColor: "text-white", layout: "bold" },
  { name: "Lakeview Fencing", trade: "Fencing", location: "Leeds", bg: "from-teal-800 to-teal-600", accent: "bg-white", textColor: "text-white", layout: "split" },
  { name: "Elite Driveways & Paving", trade: "Paving", location: "Liverpool", bg: "from-slate-800 to-slate-600", accent: "bg-slate-200", textColor: "text-white", layout: "right" },
  { name: "Westway Drainage", trade: "Drainage", location: "Bristol", bg: "from-emerald-800 to-teal-700", accent: "bg-emerald-200", textColor: "text-white", layout: "minimal" },
];

export interface Testimonial {
  name: string;
  trade: string;
  location: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "James, Thompson Landscapes",
    trade: "Landscaping",
    location: "Newcastle",
    text: "The website paid for itself ten fold in the first month. Landed a £12k garden project from someone who found us on Google. Best investment we've made in the business.",
    rating: 5,
  },
  {
    name: "Kev, K&S Bricklaying",
    trade: "Bricklaying Contractor",
    location: "Birmingham",
    text: "Went from zero online presence to page one of Google in our area. Getting 3-4 new enquiries a week now and the quality of work coming through has gone right up.",
    rating: 5,
  },
  {
    name: "Mark, Spark Brothers Electrical",
    trade: "Electrical Contractor",
    location: "Manchester",
    text: "Enquiries doubled in the first month and we're now turning work away. We've even had experienced sparks reaching out wanting to join us off the back of the site. Didn't expect that from a website.",
    rating: 5,
  },
  {
    name: "Pete, AquaFlow Plumbing",
    trade: "Plumbing & Heating",
    location: "Leeds",
    text: "I was quoted £3k plus a yearly retainer for what looked like a template. Construction Sites are the only sensible people in the industry who understand us.",
    rating: 5,
  },
  {
    name: "Sarah, Apex Roofing",
    trade: "Roofing Contractor",
    location: "Bristol",
    text: "The site looks so professional that clients trust us before we even turn up. We've landed three commercial contracts since launch. Even had good lads getting in touch wanting to come and work for us.",
    rating: 5,
  },
  {
    name: "Rob, J&R Plastering",
    trade: "Plastering & Rendering",
    location: "Sheffield",
    text: "Clean, professional, does exactly what it needs to. We've seen a real uplift in the quality of enquiries coming through. Customers actually comment on how good the site looks.",
    rating: 5,
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "How can it only be £100 a month?",
    answer: "Yes, we know agencies charge thousands plus monthly fees for hosting and SSL. We play the long game so we're invested in your success. We're so confident you'll win work and love it that you'll continue to pay for it. If you don't, simply stop.",
  },
  {
    question: "Can I make changes to my site?",
    answer: "Absolutely. You get 1 hour of edits per month included in your plan. Need a new photo, updated prices, or a new service page? Just ping us. Need more than an hour? It's only £50/hour after that.",
  },
  {
    question: "How long does it take to build?",
    answer: "Most sites are live within 5-7 working days. We've done same-week turnarounds for lads who needed it yesterday. We move fast because no one wants to wait around for a website.",
  },
  {
    question: "Do I own my domain?",
    answer: "Yes, 100%. Your domain is registered in your name. We'll sort out the purchase and setup, but it's yours. If you ever leave, you take it with you.",
  },
  {
    question: "What about Google Ads?",
    answer: "Every site we build is optimised for Google Ads from the ground up. Proper landing pages, conversion tracking, the lot. When you're ready to run ads, your site is already built to convert.",
  },
  {
    question: "I already have a website. Can you rebuild it?",
    answer: "Course we can. We'll rebuild it from scratch, move your domain over, and make sure you don't lose any Google rankings in the process. Seamless handover, no downtime.",
  },
  {
    question: "Seriously, how does this work?",
    answer: "We build you a fully custom website to win you work and stand out from your competitors. If you don't want to pay for it anymore, you just go back to your old website. No contract, £100/mo.",
  },
  {
    question: "Do you do e-commerce / online shops?",
    answer: "Nah, that's not our thing. We build websites for construction and trade businesses who want their phone to ring. If you're trying to sell products online, we're probably not the right fit. But if you want leads? We're your lot.",
  },
];

export const trades = [
  "Electrician",
  "Plumber",
  "Builder",
  "Roofer",
  "Plasterer",
  "Kitchen Fitter",
  "Bathroom Fitter",
  "Landscaper",
  "Painter & Decorator",
  "Tiler",
  "Joiner / Carpenter",
  "Scaffolder",
  "Demolition",
  "Groundworker",
  "Bricklayer",
  "Heating Engineer",
  "Locksmith",
  "Drainage Specialist",
  "Fencing Contractor",
  "Paving / Driveways",
  "General Contractor",
  "Other",
];
