import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, AlertTriangle, Cloud, X, Lock,
    ExternalLink, ChevronRight, ChevronLeft, GraduationCap,
    Clock, Cpu, Globe, Users, CheckCircle, Target, Monitor, FileLock, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceType } from '@/hooks/useDeviceType';
import { Button } from '@/components/ui/button';

// ─── Types ─────────────────────────────────────────────────
interface Lesson {
    title: string;
    content: React.ReactNode;
}

interface CourseModule {
    id: string;
    title: string;
    icon: any;
    duration: string;
    level: string;
    description?: string;
    lessons: Lesson[];
    keyPoints: string[];
    sources: { title: string; url: string }[];
    quiz: {
        question: string;
        options: string[];
        correctAnswer: number;
    };
}

// ─── Level Badge Colors ──────────────────────────────────
const levelColors: Record<string, string> = {
    'Intermediate': 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
    'Advanced': 'bg-purple-900/50 text-purple-300 border border-purple-700/50',
    'Critical': 'bg-red-900/50 text-red-300 border border-red-700/50',
    'Enterprise': 'bg-amber-900/50 text-amber-300 border border-amber-700/50',
    'Emerging': 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50',
};

// ─── Modules Data ──────────────────────────────────────────
const modules: CourseModule[] = [
    {
        id: 'module-1',
        title: 'Advanced Social Engineering & MFA Bypass',
        icon: Users,
        duration: '25 Min Read',
        level: 'Advanced',
        lessons: [
            {
                title: 'Introduction to Social Engineering',
                content: (
                    <>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            Social engineering is the exploitation of human psychology rather than technical vulnerabilities. Advanced attackers combine Open-Source Intelligence (OSINT) with sophisticated pretexting to bypass even the most robust technical controls.
                        </p>
                        <div className="bg-slate-900 border-l-4 border-cyan-500 p-6 mb-6 rounded-r-lg">
                            <h4 className="text-white font-mono uppercase tracking-widest text-sm mb-3">Core Principle</h4>
                            <p className="text-slate-400 text-base leading-relaxed">
                                "Humans are often the weakest link in the security chain."
                            </p>
                        </div>
                    </>
                )
            },
            {
                title: 'OSINT & Reconnaissance',
                content: (
                    <>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            Attackers spend 90% of their time on <strong>OSINT (Open Source Intelligence)</strong>. Platforms like LinkedIn, GitHub, and corporate press releases are gold mines for identifying targets and their internal jargon.
                        </p>
                        <ul className="space-y-3 mb-6">
                            {['Identifying organizational hierarchy via LinkedIn', 'Scraping employee emails using automated tools', 'Analyzing social media for personal interests/pretexts'].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </>
                )
            },
            {
                title: 'MFA Fatigue / Push Bombing',
                content: (
                    <>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            <strong>MFA Fatigue</strong> is a technique where attackers flood a victim with MFA approval push notifications, hoping the user will eventually accept to stop the disruption.
                        </p>
                        <div className="bg-slate-900 border-l-4 border-cyan-500 p-6 mb-6 rounded-r-lg">
                            <h4 className="text-white font-mono uppercase tracking-widest text-sm mb-3">Case Study: MGM Resorts (2023)</h4>
                            <p className="text-slate-400 text-base leading-relaxed">
                                Scammers used a simple helpdesk call to reset MFA, gaining full access to the corporate network via Okta.
                            </p>
                        </div>
                    </>
                )
            },
            {
                title: 'Vishing 2.0: AI-Voice Cloning',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Modern vishing leverages AI to clone voices with just a 3-second sample. Attackers impersonate IT Support or Executives to authorize high-value transactions or password resets.
                    </p>
                )
            },
            {
                title: 'Session Hijacking & AitM',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Adversary-in-the-Middle (AitM) proxies like Evilginx2 capture session cookies in real-time, effectively bypassing most MFA solutions that rely on codes or push notifications.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Cognitive biases in pretexting',
            'Bypassing push-based MFA via fatigue',
            'AI-voice cloning (Vishing 2.0)',
            'Session token theft via Evilginx'
        ],
        sources: [
            { title: 'CISA: Social Engineering Advisory', url: '#' },
            { title: 'MITRE ATT&CK: Phishing (T1566)', url: '#' }
        ],
        quiz: {
            question: "Metode manakah yang paling efektif untuk menghentikan serangan Session Hijacking / AitM?",
            options: [
                "Mengganti password secara berkala",
                "Menggunakan Hardware Security Keys (FIDO2)",
                "Mengaktifkan Push Notification MFA",
                "Menggunakan VPN"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-2',
        title: 'Business Email Compromise (BEC)',
        icon: Target,
        duration: '35 Min Read',
        level: 'Critical',
        lessons: [
            {
                title: 'The BEC Epidemic',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        BEC resulted in over $2.9 Billion in losses in 2023 alone. BEC occurs when threat actors infiltrate legitimate corporate accounts to manipulate financial communications.
                    </p>
                )
            },
            {
                title: 'Email Thread Hijacking',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Attackers gain access to a low-level account and interject themselves into ongoing financial discussions, waiting for the perfect moment to redirect a payment.
                    </p>
                )
            },
            {
                title: 'Invoice Manipulation',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Substituting account numbers on legitimate PDF invoices. Attackers often use sophisticated PDF editing tools to ensure the font and alignment match the original.
                    </p>
                )
            },
            {
                title: 'Executive Impersonation (CEO Fraud)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Posing as a high-level executive during a "secret acquisition" or "urgent legal matter" to pressure staff into bypassing standard financial controls.
                    </p>
                )
            },
            {
                title: 'Defensive Workflow: Out-of-Band Verification',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Every change to banking details MUST be verified via a second, known-good communication channel, such as a direct phone call to a known number.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Email thread hijacking',
            'Executive impersonation',
            'Supplier portal compromise',
            'Wire transfer diversion'
        ],
        sources: [
            { title: 'FBI: BEC Statistics Report', url: '#' },
            { title: 'SANS: Defending Against BEC', url: '#' }
        ],
        quiz: {
            question: "Apa alasan utama mengapa Secure Email Gateways (SEG) sering gagal mendeteksi serangan BEC?",
            options: [
                "Karena serangan BEC menggunakan malware terenkripsi",
                "Karena email berasal dari akun sah yang terkompromi",
                "Karena SEG tidak memiliki fitur filter spam",
                "Karena penyerang menggunakan koneksi satelit"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-3',
        title: 'Ransomware & Kerberoasting',
        icon: FileLock,
        duration: '40 Min Read',
        level: 'Advanced',
        lessons: [
            {
                title: 'The Ransomware Kill-Chain',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Modern ransomware is not just about encryption. It involves a multi-stage process: Recon, Lateral Movement, Data Exfiltration, and finally, Encryption.
                    </p>
                )
            },
            {
                title: 'Kerberoasting: Lateral Movement 101',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Kerberoasting exploits the way service tickets are requested in Active Directory. Any user can request a ticket for a service account and crack the hash offline.
                    </p>
                )
            },
            {
                title: 'Double Extortion Tactics',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        "Pay us to decrypt your data, and pay us again to prevent us from leaking your sensitive files to the public on our leak site."
                    </p>
                )
            },
            {
                title: 'Living-off-the-Land (LotL)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Using legitimate tools like PowerShell, WMI, and PsExec to perform malicious actions, making detection much harder for traditional antivirus.
                    </p>
                )
            },
            {
                title: 'Backup Integrity & Immutable Storage',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Ransomware often targets backups first. Immutable storage (WORM) ensures that once data is written, it cannot be modified or deleted, even with admin credentials.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Silver/Golden Ticket attacks',
            'Ransomware-as-a-Service (RaaS) model',
            'Exfiltration before encryption',
            'Kerberos ticket manipulation'
        ],
        sources: [
            { title: 'Microsoft: AD Security Guide', url: '#' },
            { title: 'CrowdStrike: Ransomware Trends', url: '#' }
        ],
        quiz: {
            question: "Apa tujuan utama dari 'Double Extortion' dalam serangan Ransomware modern?",
            options: [
                "Mengenkripsi data dua kali dengan kunci berbeda",
                "Meminta tebusan untuk deskripsi dan untuk tidak mempublikasikan data",
                "Menyerang dua perusahaan sekaligus",
                "Menginfeksi server dan perangkat mobile secara bersamaan"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-4',
        title: 'Cloud Security Posture & Architecture',
        icon: Cloud,
        duration: '35 Min Read',
        level: 'Enterprise',
        lessons: [
            {
                title: 'Shared Responsibility Model',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        The cloud provider is responsible for the "security of the cloud" (infrastructure), but the customer is responsible for "security in the cloud" (data, IAM, app).
                    </p>
                )
            },
            {
                title: 'IAM as the New Perimeter',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        In the cloud, network boundaries are fluid. Identity is the only consistent security boundary. Least privilege in IAM is critical.
                    </p>
                )
            },
            {
                title: 'S3 & Storage Misconfigurations',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        "Publicly accessible" buckets remain a top cause of data breaches. Understanding ACLs vs Bucket Policies is essential.
                    </p>
                )
            },
            {
                title: 'SSRF in Cloud Environments',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Exploiting IMDS (Instance Metadata Service) to steal temporary IAM credentials. IMDSv2 adds session-based authentication to prevent this.
                    </p>
                )
            },
            {
                title: 'Serverless Security (FaaS)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Functions like AWS Lambda have short lifespans but can still be targets for event-injection attacks and poisoned dependencies.
                    </p>
                )
            }
        ],
        keyPoints: [
            'IAM policy over-privilege',
            'SSRF in cloud environments',
            'S3 bucket misconfigurations',
            'Shared Responsibility Model'
        ],
        sources: [
            { title: 'AWS: Security Best Practices', url: '#' },
            { title: 'Cloud Security Alliance (CSA)', url: '#' }
        ],
        quiz: {
            question: "IP Address mana yang menjadi target serangan SSRF untuk mendapatkan metadata AWS Metadata Service?",
            options: [
                "192.168.1.1",
                "8.8.8.8",
                "169.254.169.254",
                "127.0.0.1"
            ],
            correctAnswer: 2
        }
    },
    {
        id: 'module-5',
        title: 'AI Offense & Deepfakes',
        icon: Cpu,
        duration: '40 Min Read',
        level: 'Emerging',
        lessons: [
            {
                title: 'Democratization of Cybercrime',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Generative AI has eliminated the "language barrier" for international threat actors. LLMs like FraudGPT allow scammers to draft flawless spear-phishing campaigns at scale.
                    </p>
                )
            },
            {
                title: 'Real-time Voice Cloning (Vishing 2.0)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        With just 3 seconds of a victim's voice, AI can clone it perfectly. Attackers use this to bypass voice-based authentication or trick employees over the phone.
                    </p>
                )
            },
            {
                title: 'Video Deepfakes in Live Calls',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        The 2024 Hong Kong CFO deepfake attack used real-time video manipulation to recreate an entire video conference, tricked a worker into transferring $25M.
                    </p>
                )
            },
            {
                title: 'LLM Jailbreaking & Prompt Injection',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Attackers can bypass LLM safety guardrails using "jailbreak" prompts, forcing the AI to generate malicious code or provide instructions for illicit acts.
                    </p>
                )
            },
            {
                title: 'Automated Vulnerability Research',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        AI-driven tools can now scan codebases for zero-day vulnerabilities significantly faster than human researchers, shifting the "window of opportunity" for attackers.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Generative AI Phishing',
            'Video and Voice Deepfakes',
            'LLM Jailbreaking (Prompt Injection)',
            'Automated Malware Generation'
        ],
        sources: [
            { title: 'Europol: Deepfake Report', url: '#' },
            { title: 'OWASP: Top 10 for LLMs', url: '#' }
        ],
        quiz: {
            question: "Bagaimana scammers menipu karyawan keuangan di Hong Kong (2024) sebesar $25.6M?",
            options: [
                "Mengirim email phishing sederhana",
                "Menggunakan Video Deepfake dalam live conference call",
                "Mencuri laptop CFO secara fisik",
                "Membajak koneksi Wi-Fi perusahaan"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-6',
        title: 'Insider Threats & Zero Trust',
        icon: Users,
        duration: '35 Min Read',
        level: 'Intermediate',
        lessons: [
            {
                title: 'The Malicious Insider',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Employees with access to sensitive data and systems who use their positions for personal gain, revenge, or espionage.
                    </p>
                )
            },
            {
                title: 'The Negligent & Compromised Insider',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        The most common threat type. Employees who accidentally leak data or whose accounts are taken over by external attackers via phishing.
                    </p>
                )
            },
            {
                title: 'Zero Trust Core Principles',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Moving from "perimeteter security" (firewalls) to "never trust, always verify." Every request is authenticated and authorized regardless of location.
                    </p>
                )
            },
            {
                title: 'Micro-segmentation Strategy',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Dividing the network into small zones to limit lateral movement. If one server is compromised, the attacker cannot automatically reach the rest of the network.
                    </p>
                )
            },
            {
                title: 'UEBA (User & Entity Behavior Analytics)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Using machine learning to establish a "normal" baseline for user behavior. If an employee suddenly downloads 10GB of data at 3 AM, an alert is triggered.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Malicious vs Negligent insiders',
            'Zero Trust Least Privilege',
            'Behavioral Analytics (UEBA)',
            'Physical Security Controls'
        ],
        sources: [
            { title: 'CERT: Insider Threat Center', url: '#' },
            { title: 'NIST: Zero Trust Architecture', url: '#' }
        ],
        quiz: {
            question: "Apa prinsip utama dari Zero Trust Architecture?",
            options: [
                "Percaya semua pengguna internal",
                "Hanya blokir alamat IP asing",
                "Never trust, always verify",
                "Gunakan password yang sangat panjang"
            ],
            correctAnswer: 2
        }
    },
    {
        id: 'module-7',
        title: 'Software Supply Chain Attacks',
        icon: Globe,
        duration: '45 Min Read',
        level: 'Critical',
        lessons: [
            {
                title: 'Trusting the Builders',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Supply Chain attacks target the foundational trust relationships. Attackers compromise a trusted vendor to reach their ultimate targets (the vendor's customers).
                    </p>
                )
            },
            {
                title: 'Build Pipeline Compromise (SUNBURST)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        The SolarWinds attack showed that even signed DLLs can be malicious if the build environment itself is compromised.
                    </p>
                )
            },
            {
                title: 'Dependency Confusion & Typosquatting',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Uploading malicious packages to NPM or PyPI with names similar to popular libraries, or exploiting internal vs external naming overlaps.
                    </p>
                )
            },
            {
                title: 'Open Source Risky Business',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Modern apps are 80-90% open source. High-profile vulnerabilities like Log4Shell demonstrate the systemic risk of unpatched community libraries.
                    </p>
                )
            },
            {
                title: 'SBOM (Software Bill of Materials)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        A list of all components and dependencies in a piece of software. SBOMs are becoming mandatory for government and critical infrastructure suppliers.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Build pipeline compromise',
            'Dependency confusion',
            'Digital signature spoofing',
            'Third-party risk management'
        ],
        sources: [
            { title: 'CISA: SolarWinds Analysis', url: '#' },
            { title: 'NCSC: Supply Chain Security', url: '#' }
        ],
        quiz: {
            question: "Apa yang membuat serangan SolarWinds SUNBURST sangat berbahaya?",
            options: [
                "Karena hanya menyerang komputer pribadi",
                "Karena disisipkan ke dalam update resmi yang ditandatangani vendor",
                "Karena menggunakan virus tradisional",
                "Karena memerlukan akses fisik ke server"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-8',
        title: 'Digital Forensics & IR',
        icon: Target,
        duration: '45 Min Read',
        level: 'Advanced',
        lessons: [
            {
                title: 'Incident Handling Flow',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Incident Response (IR) is the organized approach to managing and addressing a security breach. Following a standardized framework ensures nothing is missed.
                    </p>
                )
            },
            {
                title: 'Volatile Memory Forensics',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        RAM contains a goldmine of evidence: running processes, network connections, and even encryption keys that never touch the hard drive.
                    </p>
                )
            },
            {
                title: 'Log Correlation & SIEM',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Stitching together disparate logs from firewalls, servers, and endpoints to create a cohesive "story" of the attack timeline.
                    </p>
                )
            },
            {
                title: 'The SANS Top 6 Steps',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Preparation, Identification, Containment, Eradication, Recovery, and Lessons Learned. Each phase is critical for long-term resilience.
                    </p>
                )
            },
            {
                title: 'Anti-Forensics & Log Tampering',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Modern attackers attempt to delete Windows Event Logs (wevtutil cl) and modify file timestamps (timestomping) to hide their tracks.
                    </p>
                )
            }
        ],
        keyPoints: [
            'Volatile memory analysis',
            'Log correlation and timeline',
            'Chain of custody',
            'Eradication vs Containment'
        ],
        sources: [
            { title: 'SANS: Incident Handler Guide', url: '#' },
            { title: 'NIST: SP 800-61 Rev 2', url: '#' }
        ],
        quiz: {
            question: "Apa fokus utama dari Memory Forensics modern?",
            options: [
                "Menganalisis file di hardisk",
                "Menganalisis volatile RAM untuk mendeteksi fileless malware",
                "Mengecek kabel jaringan secara fisik",
                "Membaca email yang sudah dihapus"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-9',
        title: 'Endpoint Detection & Response (EDR) Evasion',
        icon: Monitor,
        duration: '50 Min Read',
        level: 'Advanced',
        lessons: [
            {
                title: 'How EDR Works',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        EDR solutions monitor endpoint activity in real-time. They use "hooks" in common Windows APIs to inspect arguments before they reach the kernel.
                    </p>
                )
            },
            {
                title: 'Userland Hooking Bypass',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Loading a clean copy of <code className="text-cyan-400">ntdll.dll</code> from disk into memory to overwrite the EDR's patched (hooked) version.
                    </p>
                )
            },
            {
                title: 'Direct System Calls (Syscalls)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Using Assembly to invoke kernel functions directly, bypassing <code className="text-cyan-400">ntdll.dll</code> and the EDR hooks entirely.
                    </p>
                )
            },
            {
                title: 'Process Injection (Reflective DLL)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Injecting malicious code into the memory space of a legitimate process (like <code className="text-cyan-400">explorer.exe</code>) to blend in with normal system activity.
                    </p>
                )
            },
            {
                title: 'Parent PID Spoofing',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Making a malicious process appear as if it was started by a trusted system process, breaking the "process tree" chain used by EDR detections.
                    </p>
                )
            }
        ],
        keyPoints: [
            'API hooking mechanisms',
            'Direct System Calls',
            'Unmanaged code execution',
            'Parent PID spoofing'
        ],
        sources: [
            { title: 'Mandiant: EDR Evasion Study', url: '#' },
            { title: 'SentinelOne: Modern Evasion', url: '#' }
        ],
        quiz: {
            question: "Teknik apa yang digunakan penyerang untuk melewati API hooking pada EDR?",
            options: [
                "Menggunakan task manager untuk mematikan EDR",
                "Menggunakan Direct Syscalls untuk memanggil kernel secara langsung",
                "Menghapus file log Windows",
                "Mengubah registry key EDR"
            ],
            correctAnswer: 1
        }
    },
    {
        id: 'module-10',
        title: 'Global Data Privacy & Compliance',
        icon: FileLock,
        duration: '35 Min Read',
        level: 'Enterprise',
        lessons: [
            {
                title: 'GDPR: The Gold Standard',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        The General Data Protection Regulation (GDPR) mandates "Privacy by Design" and imposes heavy fines for data breaches (up to 4% of global turnover).
                    </p>
                )
            },
            {
                title: 'Data Sovereignty & Cross-border Flow',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Understanding where data resides and the legal implications of moving personal data from the EU to countries without "adequate" protection.
                    </p>
                )
            },
            {
                title: 'The Right to be Forgotten',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Data subjects have the right to request the deletion of their personal data. Implementing this in complex distributed databases is a major engineering challenge.
                    </p>
                )
            },
            {
                title: 'Compliance Frameworks (NIST/ISO)',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Frameworks like NIST CSF and ISO 27001 provide a common language and roadmap for building an effective security program.
                    </p>
                )
            },
            {
                title: 'DPIA: Risk Assessment for Privacy',
                content: (
                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        Data Protection Impact Assessments are mandatory for high-risk processing activities to identify and mitigate privacy risks before they materialize.
                    </p>
                )
            }
        ],
        keyPoints: [
            'GDPR / CCPA / HIPAA',
            'Data Protection Impact Assessments',
            'The Right to be Forgotten',
            'Encryption at Rest and Transit'
        ],
        sources: [
            { title: 'EU: GDPR official text', url: '#' },
            { title: 'ICO: Data Protection guide', url: '#' }
        ],
        quiz: {
            question: "Berapa lama batas waktu notifikasi kebocoran data menurut GDPR?",
            options: [
                "24 jam",
                "30 hari",
                "72 jam",
                "1 tahun"
            ],
            correctAnswer: 2
        }
    },
];



// ─── Progress Storage ───────────────────────────────────────
const getStorageKey = (userId: string | undefined) =>
    userId ? `hfip_progress_${userId}` : 'hfip_progress_guest';

function loadProgress(userId: string | undefined): number {
    try {
        const raw = localStorage.getItem(getStorageKey(userId));
        if (!raw) return 0;
        const idx = parseInt(raw, 10);
        return isNaN(idx) ? 0 : Math.min(idx, modules.length - 1);
    } catch { return 0; }
}

function saveProgress(userId: string | undefined, index: number) {
    try {
        localStorage.setItem(getStorageKey(userId), String(index));
    } catch { /* ignore */ }
}

// ─── Props ─────────────────────────────────────────────────
interface LearningHubProps {
    onStartChallenge: () => void;
}

// ─── Component ─────────────────────────────────────────────
export function LearningHub({ onStartChallenge }: LearningHubProps) {
    const { user, isAuthenticated } = useAuth();
    const { isDesktop, isMobile } = useDeviceType();
    const [currentIndex, setCurrentIndex] = useState<number>(() => loadProgress(user?.id));
    const [completedModules, setCompletedModules] = useState<Set<number>>(() => {
        try {
            const raw = localStorage.getItem(getStorageKey(user?.id) + '_completed');
            if (!raw) return new Set<number>();
            return new Set<number>(JSON.parse(raw));
        } catch { return new Set<number>(); }
    });

    const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
    const [isQuizPassed, setIsQuizPassed] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sync progress when user changes (login/logout)
    useEffect(() => {
        const savedIdx = loadProgress(user?.id);
        setCurrentIndex(savedIdx);
        try {
            const raw = localStorage.getItem(getStorageKey(user?.id) + '_completed');
            setCompletedModules(raw ? new Set<number>(JSON.parse(raw)) : new Set<number>());
        } catch {
            setCompletedModules(new Set<number>());
        }
    }, [user?.id]);

    // goToModule removed here to resolve duplicate definition.

    const handleQuizSubmit = () => {
        if (selectedAnswer === activeModule.quiz.correctAnswer) {
            setQuizResult('correct');
            setIsQuizPassed(true);
            saveProgress(user?.id, currentIndex + 1); // Unlock next
            markCompleted(currentIndex);
        } else {
            setQuizResult('wrong');
        }
    };

    const markCompleted = (index: number) => {
        const next = new Set(completedModules);
        next.add(index);
        setCompletedModules(next);
        try {
            localStorage.setItem(getStorageKey(user?.id) + '_completed', JSON.stringify([...next]));
        } catch { /* ignore */ }
    };

    const goToModule = (index: number) => {
        if (index > completedModules.size && index !== 0) return;
        setCurrentIndex(index);
        setActiveLessonIndex(0);
        setShowQuiz(false);
        setSelectedAnswer(null);
        setQuizResult(null);
        setIsQuizPassed(completedModules.has(index));
        setIsMobileMenuOpen(false); // Close drawer on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNext = () => {
        if (showQuiz) {
            if (isQuizPassed && currentIndex < modules.length - 1) {
                goToModule(currentIndex + 1);
            }
        } else {
            if (activeLessonIndex < activeModule.lessons.length - 1) {
                setActiveLessonIndex(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setShowQuiz(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handlePrev = () => {
        if (showQuiz) {
            setShowQuiz(false);
        } else if (activeLessonIndex > 0) {
            setActiveLessonIndex(prev => prev - 1);
        } else if (currentIndex > 0) {
            const prevModuleIdx = currentIndex - 1;
            const prevModule = modules[prevModuleIdx];
            setCurrentIndex(prevModuleIdx);
            setActiveLessonIndex(prevModule.lessons.length - 1);
            setShowQuiz(true);
        }
    };

    const activeModule = modules[currentIndex];
    const progressPercent = Math.round(((completedModules.size) / modules.length) * 100);
    const isLastModule = currentIndex === modules.length - 1;

    return (
        <>
            <section className={`relative min-h-screen overflow-hidden ${isDesktop ? 'py-12 px-8' : 'pt-24 pb-32 px-4'}`}>
                {/* Adaptive background */}
                <div className={`absolute inset-0 ${isDesktop ? 'cyber-gradient cyber-grid-bg opacity-30' : 'bg-slate-950'}`} />

                <div className="relative z-10 w-full mx-auto max-w-7xl">
                    {/* ── Page Header ─────────────────────────────── */}
                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5 ${isMobile ? 'items-start' : ''}`}>
                        <div>
                            <p className="text-[10px] font-mono tracking-[0.3em] text-cyan-500 uppercase mb-3">INTELLIGENCE UNIT · ADVANCED TRAINING</p>
                            <h2 className={`${isDesktop ? 'text-6xl' : 'text-4xl'} font-black text-white mb-3 leading-tight tracking-tight`}>
                                Security <span className="heading-gradient">Learning Hub</span>
                            </h2>
                            <p className="text-slate-500 font-medium">
                                Professional grade curriculum for Human Firewall Pioneers.
                            </p>
                        </div>


                        {/* Auth Status + CTA */}
                        <div className={`flex flex-col items-start md:items-end gap-4 flex-shrink-0 ${isMobile ? 'w-full' : ''}`}>
                            {isAuthenticated ? (
                                <div className="w-full md:w-64">
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-2 font-black tracking-widest uppercase">
                                        <span>Progress {completedModules.size}/{modules.length}</span>
                                        <span className="text-cyan-400">{progressPercent}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-[10px] font-black tracking-widest uppercase text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                                    Guest User · Progress not saved
                                </div>
                            )}
                            <Button
                                onClick={onStartChallenge}
                                className={`${isDesktop ? 'rounded-2xl h-12 px-8' : 'rounded-full h-14 w-full'} bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-tighter transition-all active:scale-95 flex items-center gap-2`}
                            >
                                GO TO SIMULATION <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* ── Main Layout ──────────────────────────────── */}
                    <div className="flex flex-col lg:flex-row gap-6 pb-24 lg:pb-0">

                        {/* ── Sidebar (Desktop) ──────────────────────────── */}
                        <div className="hidden lg:block lg:w-80 flex-shrink-0">
                            <div className={`bg-white/[0.02] border border-white/5 overflow-hidden sticky top-24 ${isDesktop ? 'rounded-2xl' : 'rounded-[2.5rem]'}`}>
                                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                                    <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Course Modules</span>
                                    <span className="text-xs font-mono text-cyan-400">{modules.length} Lessons</span>
                                </div>
                                <nav className="divide-y divide-slate-800/60">
                                    {modules.map((mod, idx) => {
                                        const isActive = idx === currentIndex;
                                        const isDone = completedModules.has(idx);

                                        return (
                                            <button
                                                key={mod.id}
                                                onClick={() => goToModule(idx)}
                                                className={`w-full text-left px-5 py-6 flex flex-col gap-3 transition-colors group ${isActive ? 'bg-cyan-950/50' : 'hover:bg-slate-800/50'}`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <span className={`text-2xl font-mono font-bold ${isActive ? 'text-cyan-500' : isDone ? 'text-emerald-500' : 'text-slate-700'}`}>
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    {isDone && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold leading-tight mb-2 ${isActive ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-300 group-hover:text-white'}`}>
                                                        {mod.title}
                                                    </p>
                                                    <div className="flex flex-col gap-1 text-[10px] font-mono uppercase tracking-wider">
                                                        <span className="text-slate-500 flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" /> {mod.duration}
                                                        </span>
                                                        <span className={`${levelColors[mod.level]?.split(' ')?.[1] || 'text-slate-400'} flex items-center gap-1.5`}>
                                                            <GraduationCap className="w-3 h-3" /> {mod.level}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* ── Main Content ────────────────────── */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeModule.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -16 }}
                                    transition={{ duration: 0.2 }}
                                    className={`bg-white/[0.01] border border-white/5 overflow-hidden shadow-2xl ${isDesktop ? 'rounded-[2.5rem]' : 'rounded-[3rem]'}`}
                                >
                                    {/* Module Header */}
                                    <div className="px-8 pt-8 pb-6 border-b border-slate-800">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-mono text-cyan-500 uppercase tracking-[0.3em]">
                                                    Module {String(currentIndex + 1).padStart(2, '0')} / {String(modules.length).padStart(2, '0')}
                                                </span>
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                                                    <activeModule.icon className="w-5 h-5 text-cyan-400" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <span className={`w-fit text-[10px] font-mono px-3 py-1 rounded-md uppercase tracking-widest ${levelColors[activeModule.level] ?? 'bg-slate-800 text-slate-400'}`}>
                                                    {activeModule.level}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-cyan-500" /> {activeModule.duration}
                                                </span>
                                            </div>

                                            <div className="pt-2">
                                                <h2 className="text-3xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">{activeModule.title}</h2>
                                                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl">{activeModule.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Module Body */}
                                    <div className="px-8 py-8">
                                        {!showQuiz ? (
                                            <>
                                                {/* Lesson Content */}
                                                <div className="mb-12">
                                                    <div className="flex items-center gap-3 mb-8 md:mb-6">
                                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 font-mono text-xs">
                                                            {activeLessonIndex + 1}
                                                        </div>
                                                        <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">
                                                            {activeModule.lessons[activeLessonIndex].title}
                                                        </h3>
                                                    </div>

                                                    <div className="prose prose-invert max-w-none text-slate-300 text-base md:text-lg leading-relaxed">
                                                        {activeModule.lessons[activeLessonIndex].content}
                                                    </div>
                                                </div>

                                                {/* Lesson Progress Dots */}
                                                <div className="flex justify-center gap-2 mb-12">
                                                    {activeModule.lessons.map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1 rounded-full transition-all duration-300 ${i === activeLessonIndex ? 'w-8 bg-cyan-500' : 'w-1.5 bg-slate-800'}`}
                                                        />
                                                    ))}
                                                    <div className="h-1 w-1.5 bg-slate-800 rounded-full flex items-center justify-center">
                                                        <HelpCircle className="w-2 h-2 text-slate-500" />
                                                    </div>
                                                </div>

                                                {/* Reference Metadata */}
                                                <div className="grid lg:grid-cols-2 gap-8 mt-12 pt-12 border-t border-slate-800/50">
                                                    <div>
                                                        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-500 mb-4">Strategic Takeaways</h4>
                                                        <ul className="space-y-3">
                                                            {activeModule.keyPoints.map((point, idx) => (
                                                                <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                                                                    <span className="text-cyan-500/50 font-mono font-bold flex-shrink-0 mt-0.5">
                                                                        {String(idx + 1).padStart(2, '0')}
                                                                    </span>
                                                                    <span>{point}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-4">Reference Sources</h4>
                                                        <div className="flex flex-col gap-2">
                                                            {activeModule.sources.map((source, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={source.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" /> {source.title}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* ── Mini Quiz ────────────────────────── */
                                            <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-8 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Shield className="w-32 h-32 text-cyan-500" />
                                                </div>

                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-3 mb-8">
                                                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                                            <HelpCircle className="w-5 h-5 text-cyan-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Mini Quiz</h3>
                                                            <p className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">Final Assessment</p>
                                                        </div>
                                                    </div>

                                                    <p className="text-slate-200 text-xl mb-10 font-medium leading-relaxed">
                                                        {activeModule.quiz.question}
                                                    </p>

                                                    <div className="grid gap-3 mb-10">
                                                        {activeModule.quiz.options.map((option, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    if (quizResult !== 'correct') {
                                                                        setSelectedAnswer(idx);
                                                                        setQuizResult(null);
                                                                    }
                                                                }}
                                                                disabled={isQuizPassed && quizResult === 'correct'}
                                                                className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between group/opt ${selectedAnswer === idx
                                                                    ? quizResult === 'correct'
                                                                        ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400'
                                                                        : quizResult === 'wrong'
                                                                            ? 'bg-red-900/20 border-red-500/50 text-red-400'
                                                                            : 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400'
                                                                    : 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                                                    }`}
                                                            >
                                                                <span className="text-sm font-medium">{option}</span>
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedAnswer === idx
                                                                    ? quizResult === 'correct'
                                                                        ? 'bg-emerald-500 border-emerald-500'
                                                                        : quizResult === 'wrong'
                                                                            ? 'bg-red-500 border-red-500'
                                                                            : 'bg-cyan-500 border-cyan-500'
                                                                    : 'border-slate-700'
                                                                    }`}>
                                                                    {selectedAnswer === idx && (
                                                                        quizResult === 'correct' ? <CheckCircle className="w-3 h-3 text-white" /> :
                                                                            quizResult === 'wrong' ? <AlertTriangle className="w-3 h-3 text-white" /> :
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {!isQuizPassed ? (
                                                        <button
                                                            onClick={handleQuizSubmit}
                                                            disabled={selectedAnswer === null}
                                                            className="w-full py-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                                                        >
                                                            Submit Answer
                                                        </button>
                                                    ) : (
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex items-center gap-3 p-5 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-emerald-400">
                                                                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                                                <div>
                                                                    <span className="text-sm font-bold block">Assessment Passed!</span>
                                                                    <span className="text-xs opacity-70">You have unlocked the next module content.</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-4">
                                                                <div className="flex justify-between items-center gap-4">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={handlePrev}
                                                                        className={`${isDesktop ? 'rounded-xl' : 'rounded-full'} border-white/10 text-slate-400 h-14 flex-1 font-black uppercase tracking-widest text-[10px]`}
                                                                    >
                                                                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                                                    </Button>
                                                                    <Button
                                                                        onClick={handleNext}
                                                                        className={`${isDesktop ? 'rounded-xl' : 'rounded-full'} bg-cyan-500 hover:bg-cyan-400 text-black h-14 flex-1 font-black uppercase tracking-widest text-[10px]`}
                                                                    >
                                                                        {showQuiz ? (isQuizPassed ? (isLastModule ? 'Finish Hub' : 'Next Stage') : 'Submit Quiz') : 'Mark as Read'} <ChevronRight className="w-4 h-4 ml-2" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {quizResult === 'wrong' && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="mt-6 text-center text-sm text-red-400 font-medium"
                                                        >
                                                            Incorrect. Review the lesson steps and try again!
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Component Navigation Footer */}
                                    <div className="px-8 py-6 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between gap-4">
                                        <button
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0 && activeLessonIndex === 0 && !showQuiz}
                                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-30 px-4 py-2 text-sm font-medium"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Previous
                                        </button>

                                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                            {showQuiz ? 'Final Assessment' : `Lesson ${activeLessonIndex + 1} / ${activeModule.lessons.length}`}
                                        </div>

                                        {!showQuiz ? (
                                            <button
                                                onClick={handleNext}
                                                className="bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 text-white border border-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                                            >
                                                {activeLessonIndex === activeModule.lessons.length - 1 ? 'Take Quiz' : 'Next Lesson'} <ChevronRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <div className="w-32" />
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Premium Floating Bottom Navigation (Mobile) removed in favor of Global Nav */}

                {/* ── Mobile Module Drawer (Bottom Sheet) ───────────── */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
                            />
                            {/* Drawer */}
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-white/5 rounded-t-[3rem] max-h-[85vh] overflow-hidden flex flex-col pt-2 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                            >
                                {/* Drag Handle */}
                                <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-4 mt-2" />

                                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Course Modules</h3>
                                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">10 Advanced Stages</p>
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto px-4 py-6">
                                    <nav className="grid gap-3">
                                        {modules.map((mod, idx) => {
                                            const isActive = idx === currentIndex;
                                            const isDone = completedModules.has(idx);
                                            const isLocked = idx > completedModules.size && idx !== 0;

                                            return (
                                                <button
                                                    key={mod.id}
                                                    onClick={() => {
                                                        if (!isLocked) goToModule(idx);
                                                    }}
                                                    className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${isActive
                                                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                                                        : isLocked
                                                            ? 'bg-slate-900/40 border-slate-800/50 opacity-40 grayscale'
                                                            : 'bg-slate-900/60 border-slate-800/50 hover:border-slate-700'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg flex-shrink-0 ${isActive ? 'bg-cyan-500 text-black' : isDone ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'
                                                        }`}>
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={`text-base font-bold leading-tight truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                                {mod.title}
                                                            </p>
                                                            {isDone && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                                                            <span>{mod.duration}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                            <span className={levelColors[mod.level]?.split(' ')?.[1] || 'text-slate-400'}>{mod.level}</span>
                                                        </div>
                                                    </div>

                                                    {!isLocked && isActive && (
                                                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                                    )}
                                                    {isLocked && (
                                                        <Lock className="w-4 h-4 text-slate-600" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                    {/* Bottom Padding for safe area */}
                                    <div className="h-12" />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </section>

            <style>{`
                @keyframes badgePulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
                    50% { transform: scale(1.1); box-shadow: 0 0 12px 2px rgba(34, 211, 238, 0.2); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
                }
                @media (max-width: 1024px) {
                    body {
                        padding-bottom: 120px;
                    }
                }
            `}</style>
        </>
    );
}
