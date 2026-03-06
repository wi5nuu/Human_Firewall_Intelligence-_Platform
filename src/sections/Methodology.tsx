import { motion } from 'framer-motion';
import { Target, Search, Fingerprint, ShieldCheck, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: 'OSINT & Reconnaissance',
        description: 'Automated digital footprint analysis to generate personalized pretexting scenarios based on publicly available data.'
    },
    {
        icon: Target,
        title: 'Precision Simulation',
        description: 'Deployment of polymorphic, context-aware phishing and vishing lures mimicking advanced persistent threats.'
    },
    {
        icon: Fingerprint,
        title: 'Behavioral Profiling',
        description: 'Real-time capture of interaction telemetry (click latency, payload execution, MFA fatigue susceptibility).'
    },
    {
        icon: ShieldCheck,
        title: 'Adaptive Mitigation',
        description: 'Generation of dynamic security posture reports and tailored academic remediation pathways.'
    }
];

export function Methodology() {
    return (
        <section className="relative py-24 bg-slate-900 overflow-hidden border-t border-cyan-900/30">
            <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono tracking-[0.2em] text-[#0f62fe] uppercase mb-4">Assessment Methodology</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                            Evidence-based <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">threat modeling</span>.
                        </h3>
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative bg-slate-800/80 border border-slate-700/50 hover:border-cyan-500/50 transition-colors p-6 rounded-2xl group backdrop-blur-md"
                            >
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center font-mono text-cyan-400 text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                    0{index + 1}
                                </div>

                                <div className="w-12 h-12 bg-slate-900/80 border border-slate-600/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-950/50 transition-all">
                                    <step.icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
                                </div>

                                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    {step.title}
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="w-4 h-4 text-slate-500 hidden md:inline ml-auto group-hover:text-cyan-400 transition-colors" />
                                    )}
                                </h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Compliance Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-20 pt-10 border-t border-slate-800 flex flex-col items-center justify-center"
                >
                    <p className="text-slate-500 text-sm font-mono mb-6 uppercase tracking-wider">Aligned With Global Frameworks</p>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-white" />
                            <span className="text-lg font-bold text-white tracking-widest">NIST CSF 2.0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-6 h-6 text-white" />
                            <span className="text-lg font-bold text-white tracking-widest">MITRE ATT&CK®</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-6 h-6 text-white" />
                            <span className="text-lg font-bold text-white tracking-widest">ISO/IEC 27001</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
