import { motion } from 'framer-motion';
import { ShieldAlert, Network, BrainCircuit, ActivitySquare } from 'lucide-react';

const features = [
    {
        icon: BrainCircuit,
        title: 'AI-Powered Analytics',
        description: 'Leverage state-of-the-art machine learning models to profile user vulnerability, detecting susceptible behavioral patterns before real attacks occur.',
    },
    {
        icon: ShieldAlert,
        title: 'Enterprise Threat Simulation',
        description: 'Immersive, hyper-realistic zero-day scenarios mimicking actual Advanced Persistent Threat (APT) methodologies and Business Email Compromises.',
    },
    {
        icon: Network,
        title: 'Zero-Trust Architecture',
        description: 'Designed under the strict assumption of breach. Complete segmentation of assessment data emphasizing data sovereignty and cryptographic anonymity.',
    },
    {
        icon: ActivitySquare,
        title: 'Real-Time Telemetry',
        description: 'Live academic tracking of campus-wide resilience scores, mapping the human risk surface dynamically across multiple university departments.',
    }
];

export function PlatformFeatures() {
    return (
        <section className="relative py-24 bg-slate-900/40 overflow-hidden border-t border-cyan-900/30">
            {/* Background styling elements */}
            <div
                className="absolute top-0 left-0 w-full h-full opacity-100 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(6, 182, 212, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 25%)'
                }}
            />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono tracking-[0.2em] text-[#0f62fe] uppercase mb-4">Core Infrastructure</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            engineered for absolute <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">resilience</span>.
                        </h3>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-colors p-8 rounded-2xl group backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 bg-slate-800 border border-slate-600/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">{feature.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
