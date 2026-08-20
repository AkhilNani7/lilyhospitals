/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  HeartPulse, 
  Moon, 
  Stethoscope, 
  User, 
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Award,
  Users,
  Sparkles,
  ExternalLink,
  Activity,
  Thermometer,
  Wind,
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Video,
  RotateCcw,
  Film
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoTopic {
  id: string;
  title: string;
  category: string;
  speaker: string;
  duration: string;
  description: string;
  videoUrl: string;
  poster: string;
}

const DEFAULT_VIDEOS: VideoTopic[] = [
  {
    id: "hospital-tour",
    title: "Lily Hospital Tour & Clinical Facility",
    category: "Hospital Overview",
    speaker: "Lily Hospital Care Team",
    duration: "00:00",
    description: "Take a virtual walkthrough of Lily Hospital in Gowri Nagar, Thukivakam. See our spotless consultation rooms, diagnostic facilities, and hygienic patient care environment.",
    videoUrl: "https://youtu.be/d3Vnu_tsYPA?si=iyAkRjlm6fq1E8B-",
    poster: ""
  }
];

const TESTIMONIALS = [
  {
    text: "Experienced doctor, good service. The diagnosis was very accurate and the treatment plan was clear.",
    author: "Local Resident",
    rating: 5,
    tag: "Experienced Doctor"
  },
  {
    text: "Perfect treatment... supported even during night time. Truly a dependable local hospital.",
    author: "Patient Family",
    rating: 5,
    tag: "Night-time Support"
  },
  {
    text: "Empathetic staff and a very clean environment. Dr. Christal Doss is very communicative.",
    author: "Verified Patient",
    rating: 5,
    tag: "Clean Environment"
  }
];

const SERVICES = [
  {
    title: "B.P & Sugar Management",
    description: "Regular monitoring and expert management of blood pressure and blood sugar levels for long-term health.",
    icon: <Activity className="w-6 h-6" />,
    color: "bg-medical-blue-light text-medical-blue-dark",
    border: "border-medical-blue/10"
  },
  {
    title: "Thyroid Consultation",
    description: "Specialized diagnosis and treatment for thyroid-related disorders to restore hormonal balance.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-medical-green-light text-medical-green-dark",
    border: "border-medical-green/10"
  },
  {
    title: "Fever & Infection",
    description: "Comprehensive care for various types of fevers and infections with accurate diagnostic testing.",
    icon: <Thermometer className="w-6 h-6" />,
    color: "bg-medical-blue-light text-medical-blue-dark",
    border: "border-medical-blue/10"
  },
  {
    title: "Lung & Respiratory",
    description: "Expert care for breathing difficulties, asthma, and other lung-related health concerns.",
    icon: <Wind className="w-6 h-6" />,
    color: "bg-medical-green-light text-medical-green-dark",
    border: "border-medical-green/10"
  },
  {
    title: "Gastric & Digestive",
    description: "Effective treatment for acidity, indigestion, and other gastric or digestive system problems.",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-medical-blue-light text-medical-blue-dark",
    border: "border-medical-blue/10"
  },
  {
    title: "Skin Allergies",
    description: "Diagnosis and treatment for various skin conditions, rashes, and allergic reactions.",
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-medical-green-light text-medical-green-dark",
    border: "border-medical-green/10"
  },
  {
    title: "Medical Diagnosis",
    description: "Accurate and reliable diagnostic services using modern medical practices to identify health issues effectively.",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "bg-medical-blue-light text-medical-blue-dark",
    border: "border-medical-blue/10"
  },
  {
    title: "Treatment & Care",
    description: "Patient-centered treatment plans focused on recovery and long-term wellness with empathetic nursing staff.",
    icon: <HeartPulse className="w-6 h-6" />,
    color: "bg-medical-green-light text-medical-green-dark",
    border: "border-medical-green/10"
  },
  {
    title: "Physiotherapy & Rehabilitation",
    description: "Committed to providing comprehensive physiotherapy and rehabilitation services to help patients recover and improve their quality of life.",
    icon: <Moon className="w-6 h-6" />,
    color: "bg-medical-blue-light text-medical-blue-dark",
    border: "border-medical-blue/10"
  }
];

function parseVideoSource(url: string) {
  if (!url) return { type: 'video' as const, src: '' };
  
  // YouTube link matching
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'embed' as const,
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
    };
  }

  // Vimeo link matching
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'embed' as const,
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    };
  }

  return { type: 'video' as const, src: url };
}

function formatVideoTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Video Section States
  const videos = DEFAULT_VIDEOS;
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const activeVideo = videos[activeVideoIndex] || videos[0];
  const parsedSource = parseVideoSource(activeVideo.videoUrl);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error("Failed to fetch testimonials:", err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync video state when active video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }, [activeVideoIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Play interrupted:", err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Services', id: 'services' },
    { label: 'Introduction', id: 'introduction' },
    { label: 'Doctors', id: 'doctors' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen selection:bg-medical-blue/10 selection:text-medical-blue-dark">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
              <div className="w-11 h-11 bg-medical-blue rounded-xl flex items-center justify-center shadow-lg shadow-medical-blue/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-extrabold tracking-tight text-medical-ink leading-none">LILY HOSPITAL</h1>
                <p className="text-[10px] font-bold text-medical-blue uppercase tracking-widest mt-1">LILY హాస్పిటల్</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-sm font-semibold text-medical-muted hover:text-medical-blue transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-medical-blue transition-all group-hover:w-full" />
                </button>
              ))}
              <a 
                href="tel:07416640024"
                className="bg-medical-ink text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-medical-blue transition-all shadow-xl shadow-medical-ink/10 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                7416640024
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-medical-ink" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-2xl"
            >
              <div className="px-6 py-8 space-y-6">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)} 
                    className="block w-full text-left text-lg font-bold text-medical-ink"
                  >
                    {item.label}
                  </button>
                ))}
                <a href="tel:07416640024" className="block w-full text-center bg-medical-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-medical-blue/20">
                  Call 7416640024
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 medical-gradient -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-blue-light border border-medical-blue/10 text-medical-blue-dark text-xs font-extrabold uppercase tracking-widest mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Trusted Local Healthcare Provider
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-medical-ink leading-[1.05] mb-8 tracking-tight">
                Quality Care for <br />
                <span className="text-medical-blue">Your Family.</span>
              </h1>
              <p className="text-xl text-medical-muted mb-10 max-w-lg leading-relaxed font-medium">
                Lily Hospital provides dependable medical diagnosis and treatment in Thukivakam. 
                Experience patient-centered care with our dedicated team.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-medical-blue text-white px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-medical-blue-dark transition-all shadow-2xl shadow-medical-blue/30 flex items-center justify-center gap-3 group"
                >
                  Visit Hospital
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-5 px-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://picsum.photos/seed/patient${i}/100/100`} alt="Patient" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-white bg-medical-blue text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      +26
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-extrabold text-medical-ink">5.0</span>
                    </div>
                    <p className="text-xs font-bold text-medical-muted uppercase tracking-wider">Patient Reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative z-10 border-8 border-white">
                <img 
                  src="/LilyHospital2.jpeg" 
                  alt="Lily Clinic Banner" 
                  className="w-full h-full object-contain bg-medical-ink"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Trust Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-slate-100 hidden sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-medical-green-light rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="text-medical-green w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-medical-ink">Clean Environment</p>
                    <p className="text-sm font-bold text-medical-muted">Patient Safety First</p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-medical-blue/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-medical-green/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals Bar */}
      <div className="bg-white border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Google Rating", value: "5.0", icon: <Star className="w-5 h-5 text-amber-400" /> },
              { label: "Patient Reviews", value: "26+", icon: <Users className="w-5 h-5 text-medical-blue" /> },
              { label: "Clean Environment", value: "100%", icon: <Sparkles className="w-5 h-5 text-medical-green" /> },
              { label: "Emergency Support", value: "9AM - 9PM", icon: <Clock className="w-5 h-5 text-rose-500" /> }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="mb-3">{stat.icon}</div>
                <p className="text-3xl font-extrabold text-medical-ink mb-1">{stat.value}</p>
                <p className="text-[10px] font-bold text-medical-muted uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-32 bg-medical-slate/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-extrabold text-medical-blue uppercase tracking-[0.3em] mb-4">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-medical-ink tracking-tight">Comprehensive Medical Services</h3>
            </div>
            <p className="text-medical-muted font-medium max-w-xs">
              Providing reliable healthcare, diagnosis, and treatment to the Thukivakam community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {SERVICES.map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -12 }}
                className={`p-10 rounded-[2.5rem] bg-white border ${service.border} shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group`}
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h4 className="text-2xl font-extrabold text-medical-ink mb-5">{service.title}</h4>
                <p className="text-medical-muted font-medium leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Introduction Section */}
      <section id="introduction" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-blue-light border border-medical-blue/10 text-medical-blue-dark text-xs font-extrabold uppercase tracking-widest mb-4">
              <Film className="w-3.5 h-3.5" />
              Video Introduction
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-medical-ink tracking-tight mb-4">
              Watch Our Hospital Introduction
            </h3>
            <p className="text-lg text-medical-muted font-medium leading-relaxed">
              Get an authentic look at Lily Hospital's clean clinical facility, consultation rooms, and patient care environment in Thukivakam.
            </p>
          </div>

          {/* Video Selector Tabs (Shown if multiple videos) */}
          {videos.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-10 pb-2">
              {videos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-3 ${
                    activeVideoIndex === idx
                      ? 'bg-medical-blue text-white shadow-lg shadow-medical-blue/20 scale-[1.02]'
                      : 'bg-medical-slate text-medical-ink hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${activeVideoIndex === idx ? 'bg-white animate-pulse' : 'bg-medical-blue'}`} />
                  <span>{vid.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg ${activeVideoIndex === idx ? 'bg-white/20 text-white' : 'bg-white text-medical-muted'}`}>
                    {vid.duration}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Main Video Presentation Grid */}
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Video Player Column */}
            <div className="lg:col-span-8">
              <div 
                ref={videoContainerRef}
                className="relative rounded-[2.5rem] overflow-hidden bg-medical-ink shadow-2xl border-4 border-slate-100 group aspect-[16/9]"
              >
                {parsedSource.type === 'embed' ? (
                  <iframe
                    src={parsedSource.src}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      src={parsedSource.src}
                      poster={activeVideo.poster}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                      onClick={togglePlay}
                      className="w-full h-full object-cover cursor-pointer"
                      playsInline
                    />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-20">
                      <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>HD 1080p • Telugu & English</span>
                      </div>
                      <div className="px-3.5 py-1.5 rounded-full bg-medical-blue/80 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                        {activeVideo.duration}
                      </div>
                    </div>

                    {/* Big Center Play Button Overlay */}
                    {!isPlaying && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-medical-ink/40 backdrop-blur-[2px] flex items-center justify-center z-20 cursor-pointer"
                        onClick={togglePlay}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 rounded-full bg-white text-medical-blue flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-medical-blue hover:text-white transition-all pl-1.5 group-hover:shadow-medical-blue/40">
                            <Play className="w-10 h-10 fill-current" />
                          </div>
                          <p className="text-white font-extrabold text-lg drop-shadow-md tracking-wide">
                            Click to Play Video
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Bottom Custom Controls Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30 transition-opacity duration-300 opacity-95 group-hover:opacity-100">
                      {/* Timeline Scrubber */}
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-medical-blue mb-3 hover:h-2.5 transition-all"
                      />

                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={togglePlay}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                          </button>

                          <button
                            onClick={toggleMute}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>

                          <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
                            {formatVideoTime(currentTime)} / {formatVideoTime(duration || 135)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                              }
                            }}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors hidden sm:block"
                            title="Replay from start"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>

                          <button
                            onClick={handleFullscreen}
                            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                            aria-label="Fullscreen"
                          >
                            <Maximize2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Video Details & Interactive Chapters */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-medical-slate border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-medical-blue text-white flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-medical-ink text-lg leading-snug">
                      {activeVideo.speaker}
                    </h4>
                    <p className="text-xs font-bold text-medical-blue uppercase tracking-wider">
                      {activeVideo.category}
                    </p>
                  </div>
                </div>

                <h5 className="text-xl font-extrabold text-medical-ink mb-3 leading-tight">
                  {activeVideo.title}
                </h5>

                <p className="text-medical-muted text-sm font-medium leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>

              {/* Consultation / Call CTA Card */}
              <div className="p-6 rounded-3xl bg-medical-ink text-white shadow-xl flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-medical-green uppercase tracking-wider mb-1">
                    Have Questions?
                  </p>
                  <p className="text-base font-extrabold">Speak with Our Team</p>
                </div>
                <a
                  href="tel:07416640024"
                  className="bg-medical-blue hover:bg-medical-blue-dark text-white px-5 py-3 rounded-xl font-extrabold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-medical-blue/30"
                >
                  <Phone className="w-4 h-4" />
                  7416640024
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Section */}
      <section id="doctors" className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-medical-slate">
                <img 
                  src="/Doctor%20Image.jpg" 
                  alt="Dr. Christal Doss" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-medical-blue/5 rounded-full blur-3xl -z-10" />
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute -bottom-8 -right-8 bg-medical-ink p-8 rounded-3xl shadow-2xl z-20 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-medical-green animate-pulse" />
                  <p className="text-[10px] font-bold text-medical-green uppercase tracking-widest">Available for Consult</p>
                </div>
                <p className="text-xl font-extrabold mb-1">Dr. Christal Doss</p>
                <p className="text-xs font-bold text-medical-muted uppercase tracking-widest">Chief Medical Officer</p>
              </motion.div>
            </div>
            
            <div>
              <h2 className="text-sm font-extrabold text-medical-blue uppercase tracking-[0.3em] mb-6">Meet the Doctors</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-medical-ink mb-8 tracking-tight">Experienced & Empathetic Care</h3>
              
              <div className="space-y-10 mb-12">
                <div className="p-6 rounded-3xl bg-medical-slate border border-slate-100">
                  <h4 className="text-xl font-extrabold text-medical-ink mb-1">Dr. S. Christal Doss, M.B.B.S.</h4>
                  <p className="text-medical-blue font-bold text-sm uppercase tracking-wider">Family Physician</p>
                </div>
                <div className="p-6 rounded-3xl bg-medical-slate border border-slate-100">
                  <h4 className="text-xl font-extrabold text-medical-ink mb-1">Dr. D. Ratna Kumari, MPT(SVIMS)</h4>
                  <p className="text-medical-blue font-bold text-sm uppercase tracking-wider">Physiotherapy in Cardiothoracic</p>
                </div>
              </div>
              
              <p className="text-lg text-medical-muted mb-10 leading-relaxed font-medium italic border-l-4 border-medical-blue pl-6">
                "We treat, God heals." Our doctors bring a communicative and patient-focused approach, 
                with years of experience recognized by our local community.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  "Family Physician Expertise",
                  "Specialized Physiotherapy",
                  "Patient-centered approach",
                  "Night-time emergency care"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-medical-green-light flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-medical-green" />
                    </div>
                    <span className="text-medical-ink font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <a 
                href="tel:07416640024"
                className="inline-flex items-center gap-3 bg-medical-ink text-white px-10 py-5 rounded-2xl font-extrabold hover:bg-medical-blue transition-all shadow-xl shadow-medical-ink/20"
              >
                <Phone className="w-5 h-5" />
                Contact Our Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-32 bg-medical-blue-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-medical-green rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-extrabold text-medical-blue uppercase tracking-[0.3em] mb-4">Patient Stories</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Trusted by the Community</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {(testimonials.length > 0 ? testimonials : TESTIMONIALS).map((t, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="p-10 rounded-[2.5rem] bg-white shadow-2xl flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-medical-blue-light text-medical-blue-dark text-[10px] font-extrabold uppercase tracking-wider">
                    {t.tag || "Verified"}
                  </div>
                </div>
                
                <p className="text-medical-ink font-medium italic mb-10 leading-relaxed flex-grow">
                  "{t.text}"
                </p>
                
                <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-medical-slate flex items-center justify-center text-medical-blue font-extrabold text-lg">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-extrabold text-medical-ink">{t.author}</p>
                    <p className="text-[10px] font-bold text-medical-muted uppercase tracking-widest">Verified Patient</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-extrabold">5.0</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <p className="text-sm font-bold uppercase tracking-widest">Based on 26 Google Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Info */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-medical-ink rounded-[3rem] p-12 lg:p-24 text-white relative overflow-hidden shadow-[0_48px_96px_-24px_rgba(15,23,42,0.3)]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-medical-blue/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Visit Lily Hospital</h2>
                <p className="text-medical-muted text-lg max-w-xl mx-auto font-medium">
                  We are conveniently located in Gowri Nagar, Thukivakam. Visit us for professional medical care.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-16">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-medical-blue transition-colors">
                    <MapPin className="text-medical-blue group-hover:text-white w-10 h-10 transition-colors" />
                  </div>
                  <p className="text-medical-muted text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Location</p>
                  <p className="text-xl font-bold leading-relaxed">
                    Gowri Nagar, Thukivakam,<br />
                    Andhra Pradesh 517520, India
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-medical-green transition-colors">
                    <Phone className="text-medical-green group-hover:text-white w-10 h-10 transition-colors" />
                  </div>
                  <p className="text-medical-muted text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Phone</p>
                  <a href="tel:07416640024" className="text-3xl font-extrabold text-medical-blue hover:text-white transition-colors">074166 40024</a>
                  <p className="text-sm font-bold text-medical-muted mt-2">Emergency: 9652198941</p>
                </div>
                
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-amber-500 transition-colors">
                    <Clock className="text-amber-500 group-hover:text-white w-10 h-10 transition-colors" />
                  </div>
                  <p className="text-medical-muted text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Hours</p>
                  <p className="text-2xl font-extrabold">Opens at 9:00 AM to 9:00 PM</p>
                  <p className="text-sm font-bold text-medical-muted mt-2">Available for Day Emergencies</p>
                </div>
              </div>
              
              <div className="mt-24 text-center">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Lily+Hospital+Gowri+Nagar+Thukivakam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-white text-medical-ink px-12 py-6 rounded-[2rem] font-extrabold text-lg hover:bg-medical-blue hover:text-white transition-all shadow-2xl shadow-black/20"
                >
                  <MapPin className="w-6 h-6" />
                  Get Directions on Maps
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-medical-slate border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-medical-blue rounded-xl flex items-center justify-center shadow-lg shadow-medical-blue/20">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-medical-ink font-extrabold tracking-tight">LILY HOSPITAL</span>
                <span className="text-[10px] font-bold text-medical-muted uppercase tracking-widest">LILY హాస్పిటల్</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)} 
                  className="text-sm font-bold text-medical-muted hover:text-medical-blue transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            <p className="text-sm font-bold text-medical-muted">
              © {new Date().getFullYear()} Lily Hospital. All rights reserved.
            </p>
          </div>
          
          <div className="mt-16 pt-10 border-t border-slate-200 text-center">
            <p className="text-xs font-bold text-medical-muted max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
              Providing reliable healthcare, diagnosis, and treatment to the Thukivakam community. 
              Committed to patient safety and clean clinical environments.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
