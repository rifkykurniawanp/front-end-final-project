"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Users, BookOpen, ShoppingBag, Star, Zap, Globe, TrendingUp, Play, CheckCircle, ArrowRight } from 'lucide-react';
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonProps, CardProps, TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps, AnimatedSectionProps, TeamMember, Feature, Stat } from "@/types/about";
const cn = (...inputs: (string | undefined | null | boolean)[]): string => {
    return inputs.filter(Boolean).join(' ');
};

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-gray-900 text-gray-50 hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5",
                destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90",
                outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:-translate-y-0.5",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200/80",
                ghost: "hover:bg-gray-100 hover:text-gray-900",
                link: "text-gray-900 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
);
Button.displayName = "Button";

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("rounded-2xl border border-gray-200/75 bg-white text-gray-900 shadow-sm transition-all duration-300", className)}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-6", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

const Tabs: React.FC<TabsProps> = ({ children }) => <div>{children}</div>;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500", className)}
            {...props}
        />
    )
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, isActive, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
                className
            )}
            {...props}
        />
    )
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent: React.FC<TabsContentProps> = ({ children, isActive }) => (
    isActive ? <div className="mt-6 animate-fade-in">{children}</div> : null
);

const teamMembers: TeamMember[] = [
  {
    name: "Rifky Kurniawan Putra",
    role: "CEO & Founder",
    specialty: "Strategi Edu-Commerce",
    imageUrl: "/member/profileCEO.jpg",
    stats: "Belajar hari ini, nikmati teh dan kopi esok hari."
  },
  {
    name: "Bereket A.",
    role: "Head of Marketing",
    specialty: "Pertumbuhan Digital",
    imageUrl: "/images/bereket.jpg",
    stats: "Setiap cangkir teh adalah langkah menuju hidup sehat."
  },
  {
    name: "Emnet T.",
    role: "Direktur Pengalaman Belajar",
    specialty: "Desain Kurikulum",
    imageUrl: "/images/emnet.jpg",
    stats: "Ilmu tumbuh seperti daun herbal—alami dan mendalam."
  },
  {
    name: "Milkias Y.",
    role: "Pimpinan Desain UX/UI",
    specialty: "Pengalaman Pengguna",
    imageUrl: "/images/milkias.jpg",
    stats: "Rancang hidupmu dengan kopi pagi dan semangat belajar."
  },
  {
    name: "Arminur",
    role: "Manajer Produk",
    specialty: "Pengembangan Platform",
    imageUrl: "/images/arminur.jpg",
    stats: "Herbal terbaik untuk tubuh, ilmu terbaik untuk pikiran."
  },
  {
    name: "Zabstract",
    role: "Kreator Konten",
    specialty: "Produksi Video",
    imageUrl: "/images/zabstract.jpg",
    stats: "Konten yang kuat dimulai dengan teh hangat dan pikiran terbuka."
  },
];

const features: Feature[] = [
    { 
        icon: <ShoppingBag className="w-8 h-8" />, 
        title: "Belanja Produk Terkurasi", 
        description: "Temukan produk-produk pilihan yang relevan dengan minat belajar Anda, semua dalam satu platform." 
    },
    { 
        icon: <BookOpen className="w-8 h-8" />, 
        title: "Kursus Online Imersif", 
        description: "Akses ribuan kursus dengan konten multimedia yang menarik untuk meningkatkan keahlian Anda." 
    },
    { 
        icon: <Users className="w-8 h-8" />, 
        title: "Komunitas Pembelajar", 
        description: "Berinteraksi dan berkolaborasi dengan sesama pembelajar dalam komunitas yang suportif." 
    },
    { 
        icon: <TrendingUp className="w-8 h-8" />, 
        title: "Rekomendasi Cerdas", 
        description: "Dapatkan rekomendasi kursus dan produk yang dipersonalisasi sesuai minat dan kemajuan Anda." 
    },
];

const stats: Stat[] = [
    { number: "50rb+", label: "Pengguna Aktif", icon: <Users className="w-6 h-6" /> },
    { number: "2.500+", label: "Kursus & Produk", icon: <BookOpen className="w-6 h-6" /> },
    { number: "98%", label: "Tingkat Kepuasan", icon: <Star className="w-6 h-6" /> },
    { number: "180+", label: "Negara Terjangkau", icon: <Globe className="w-6 h-6" /> },
];

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, id }) => {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section
            id={id}
            ref={ref}
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </section>
    );
};

const AboutPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'values'>('mission');

    const values = ['Pengalaman Terintegrasi', 'Kesuksesan Pengguna', 'Kualitas Terkurasi', 'Dampak Global'];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10"></div>
            
            <div className="relative z-10">
                <section className="pt-24 pb-32 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full border border-gray-200 mb-8 animate-fade-in-up">
                            <Zap className="w-4 h-4 text-gray-700 mr-2" />
                            <span className="text-sm font-medium text-gray-800">Pengalaman Belajar dan Belanja di Satu Tempat</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Tentang <span className="text-gray-600">RUIND EDU-COMMERS</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            Di RUIND EDU-COMMERS, kami menciptakan sebuah platform di mana kegiatan belajar dan berbelanja menyatu dengan sempurna. Kami meruntuhkan batasan antara edukasi dan e-commerce untuk memberikan Anda pengalaman yang lebih kaya, efisien, dan menyenangkan.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <Button size="lg" className="group">
                                Mulai Belajar & Belanja
                                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="group">
                                <Play className="w-5 h-5 inline mr-2" />
                                Tonton Kisah Kami
                            </Button>
                        </div>

                        <Card className="max-w-5xl mx-auto p-4 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop"
                                alt="Kolaborasi tim"
                                className="w-full h-64 md:h-96 object-cover rounded-xl"
                            />
                        </Card>
                    </div>
                </section>

                {/* Stats Section */}
                <AnimatedSection id="stats">
                    <div className="py-20 px-4 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {stats.map((stat, index) => (
                                    <Card key={index} className="p-8 text-center hover:shadow-xl hover:-translate-y-2">
                                        <div className="text-gray-800 mb-4 flex justify-center transform group-hover:scale-110 transition-transform">
                                            {stat.icon}
                                        </div>
                                        <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                        <div className="text-gray-600 font-medium">{stat.label}</div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection id="mission-vision">
                    <div className="py-20 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Filosofi Inti Kami</h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Menyatukan dunia pembelajaran dan perdagangan melalui satu platform teknologi yang inovatif.
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-12 items-center">
                                <div className="flex-1">
                                    <Tabs>
                                        <TabsList>
                                            <TabsTrigger onClick={() => setActiveTab('mission')} isActive={activeTab === 'mission'}>Misi</TabsTrigger>
                                            <TabsTrigger onClick={() => setActiveTab('vision')} isActive={activeTab === 'vision'}>Visi</TabsTrigger>
                                            <TabsTrigger onClick={() => setActiveTab('values')} isActive={activeTab === 'values'}>Nilai</TabsTrigger>
                                        </TabsList>
                                        <TabsContent isActive={activeTab === 'mission'}>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi Kami</h3>
                                            <p className="text-lg text-gray-600 leading-relaxed">
                                                Menyediakan akses tak terbatas ke pendidikan berkualitas dan produk-produk pilihan untuk mendukung perjalanan belajar serta gaya hidup setiap pengguna kami.
                                            </p>
                                        </TabsContent>
                                        <TabsContent isActive={activeTab === 'vision'}>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
                                            <p className="text-lg text-gray-600 leading-relaxed">
                                                Menjadi platform Edu-Commerce terdepan di dunia, di mana setiap individu dapat dengan mudah menemukan pengetahuan dan produk yang mereka butuhkan untuk bertumbuh.
                                            </p>
                                        </TabsContent>
                                        <TabsContent isActive={activeTab === 'values'}>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h3>
                                            <div className="space-y-4">
                                                {values.map((value) => (
                                                    <div key={value} className="flex items-center gap-3">
                                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-700 font-medium">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                <div className="flex-1">
                                    <Card className="overflow-hidden hover:shadow-xl">
                                        <CardContent className="p-0">
                                            <img
                                                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                                                alt="Ruang kerja inovasi"
                                                className="w-full h-72 object-cover"
                                            />
                                            <div className="p-6 text-center bg-gray-50">
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">Lab Inovasi</h4>
                                                <p className="text-gray-600">Tempat ide menjadi kenyataan melalui teknologi mutakhir.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection id="features">
                    <div className="py-20 px-4 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Fitur Unggulan</h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Nikmati berbagai fitur yang dirancang untuk menyempurnakan pengalaman belajar dan berbelanja Anda.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {features.map((feature) => (
                                    <Card key={feature.title} className="p-8 text-center group hover:shadow-xl hover:-translate-y-2">
                                        <div className="text-gray-800 mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection id="team">
                    <div className="py-20 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Temui Tim Kami</h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Inovator penuh semangat yang berdedikasi untuk mentransformasi dunia Edu-Commerce.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {teamMembers.map((member) => (
                                    <Card key={member.name} className="text-center transition-shadow duration-300 hover:shadow-2xl overflow-hidden group">
                                        <div className="relative">
                                            <img
                                                src={member.imageUrl}
                                                alt={member.name}
                                                className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        </div>
                                        <div className="p-6 bg-white">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                            <p className="text-gray-800 font-semibold mb-2 text-sm">{member.role}</p>
                                            <p className="text-gray-600 mb-4 text-sm">{member.specialty}</p>
                                            <div className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-3 py-1 rounded-full">{member.stats}</div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* CTA Section */}
                <AnimatedSection id="cta">
                    <div className="py-20 px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="relative rounded-2xl p-12 bg-gray-900 text-white overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
                                <div className="absolute -bottom-16 -left-10 w-52 h-52 bg-white/5 rounded-full"></div>
                                <div className="relative z-10">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                        Siap Bertumbuh di Ekosistem Edu-Commerce?
                                    </h2>
                                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                        Bergabunglah dengan ribuan pembelajar dan pembeli yang sudah menemukan masa depan mereka bersama RUIND EDU-COMMERS.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button size="lg" variant="secondary" className="group">
                                            Mulai Perjalanan Anda
                                            <ChevronRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button size="lg" variant="outline" className="bg-transparent text-white border-gray-600 hover:bg-white hover:text-gray-900">
                                            Jadwalkan Demo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default AboutPage;