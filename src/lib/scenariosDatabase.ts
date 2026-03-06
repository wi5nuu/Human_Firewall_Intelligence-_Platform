// ============================================
// HUMAN FIREWALL SCENARIOS DATABASE v3.0
// 80+ Pre-generated Social Engineering Scenarios
// ============================================

import type { Scenario } from '@/types';

// ============================================
// EMAIL PHISHING SCENARIOS (30 Total)
// ============================================

const emailScenarios: Scenario[] = [
  // EASY EMAIL SCENARIOS (10) - President University Context
  {
    id: 'email_e001',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['urgency', 'authority'],
    content: {
      sender: { name: 'President University IT Helpdesk', email: 'helpdesk@president-edu.id' },
      subject: '[URGENT] Reset VPN Credentials - Action Required Before 23:59 Tonight',
      body: `Dear Student,

Our security team has detected unauthorized login attempts on your VPN account. To protect your access, you are required to reset your VPN credentials immediately.

⚠️ Your access will be suspended at 23:59 tonight if no action is taken.

Please click the link below to reset your credentials:
[Reset VPN Password Now]

If you did not trigger this request, please still click the link to secure your account.

Regards,
IT Helpdesk
President University`,
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a phishing email impersonating the President University IT Helpdesk. The domain "president-edu.id" is fake — the real domain is "president.ac.id". Legitimate IT teams never ask you to click a link to reset credentials in response to a suspicious login alert.',
    points: 10,
  },
  {
    id: 'email_e002',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['authority'],
    content: {
      sender: { name: 'Biro Kemahasiswaan President University', email: 'kemahasiswaan@president.ac.id' },
      subject: 'Pengumuman: Pencairan Beasiswa Semester Genap 2025',
      body: `Kepada Yth. Mahasiswa Penerima Beasiswa,

Kami dengan senang hati mengumumkan bahwa pencairan beasiswa semester genap 2025 telah disetujui oleh Rektorat.

Dana akan ditransfer ke rekening yang terdaftar di sistem akademik (SIPA) paling lambat 15 Maret 2025.

Untuk informasi lebih lanjut, silakan login ke SIPA melalui link resmi:
https://sipa.president.ac.id

Apabila terdapat pertanyaan, hubungi kami di kemahasiswaan@president.ac.id.

Salam,
Biro Kemahasiswaan
President University`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate email from the President University Student Affairs Bureau. The sender domain "president.ac.id" is correct, there are no suspicious links, and they direct you to the official SIPA system. No credential collection is requested.',
    points: 10,
  },
  {
    id: 'email_e003',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['reward', 'urgency'],
    content: {
      sender: { name: 'President University Career Center', email: 'career@president-univ.org' },
      subject: 'Exclusive Internship Opportunity — Apply Before Slots Run Out!',
      body: `Dear Student,

A top multinational company has exclusively partnered with President University to offer 5 paid internship spots for our students.

Salary: Rp 5,000,000/month
Duration: 3 months (March – June 2025)
Location: Jakarta

To reserve your spot, please complete the registration form and pay the administrative fee of Rp 150,000 via the link below:
[Register & Pay Now]

Only 5 slots remaining. Register before midnight to secure your position.

Best Regards,
Career Center Team
President University`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a scam. The sender domain "president-univ.org" is fake. Legitimate internship programs through the Career Center NEVER require payment or "administrative fees". This is a job scam targeting students. Report it immediately.',
    points: 10,
  },
  {
    id: 'email_e004',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['fear', 'urgency'],
    content: {
      sender: { name: 'Academic Administration', email: 'academic@president.ac.id' },
      subject: 'Notice: Final Exam Schedule Update — Semester Genap 2024/2025',
      body: `Dear Student,

Please be informed that the final exam schedule for Semester Genap 2024/2025 has been finalized and is now available on SIPA.

Please verify your exam schedule by logging into SIPA to ensure there are no conflicts:
https://sipa.president.ac.id/exam-schedule

If you have any scheduling conflicts, please contact your respective faculty administrator no later than February 28, 2025.

Best Regards,
Academic Administration Office
President University`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate academic notice. The sender domain is "president.ac.id" (correct), the link points to the official SIPA domain, and there are no suspicious requests for credentials or payment.',
    points: 10,
  },
  {
    id: 'email_e005',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['authority', 'fear'],
    content: {
      sender: { name: 'Registrar President University', email: 'registrar@pres-university.com' },
      subject: 'PERINGATAN: Status Akademik Anda Terancam — Konfirmasi Segera',
      body: `Kepada Mahasiswa Yth,

Berdasarkan evaluasi akademik terbaru, nama Anda terdaftar dalam daftar mahasiswa dengan status akademik "Probation" karena ketidaksesuaian data pada sistem kami.

Jika Anda tidak melakukan konfirmasi data dalam 24 jam, proses registrasi semester Anda akan DITANGGUHKAN secara otomatis.

[Konfirmasi Data Sekarang]

Masukkan NIM dan password SIPA Anda untuk verifikasi.

Registrar
President University`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a dangerous phishing email. The domain "pres-university.com" is FAKE — the real domain is "president.ac.id". The email asks for your SIPA NIM and password through an external link. The President University Registrar will NEVER ask for your password via email.',
    points: 10,
  },
  {
    id: 'email_e006',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['urgency', 'reward'],
    content: {
      sender: { name: 'PayPal Service', email: 'service@paypa1-secure.com' },
      subject: 'You have $250.00 pending - Confirm within 24 hours',
      body: `Dear Valued Customer,

A payment of $250.00 has been sent to your account. Due to security protocols, this payment requires verification before release.

[Confirm Payment Now]

If not confirmed within 24 hours, the payment will be returned to the sender.

PayPal Customer Service`,
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a phishing email. The domain "paypa1-secure.com" uses number 1 instead of letter L. PayPal never sends payment notifications requiring verification through external links.',
    points: 10,
  },
  {
    id: 'email_e007',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['authority'],
    content: {
      sender: { name: 'LinkedIn', email: 'messages-noreply@linkedin.com' },
      subject: 'You have a new message from Sarah Chen',
      body: `Hi,

Sarah Chen sent you a message on LinkedIn:

"Hi! I came across your profile and was impressed by your background. I'd love to connect and discuss potential collaboration opportunities. Let me know if you're open to a quick chat!"

[View Message]  [Reply]

Thanks,
The LinkedIn Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate LinkedIn notification. The sender domain is correct (linkedin.com), and the message format matches standard LinkedIn messaging notifications.',
    points: 10,
  },
  {
    id: 'email_e008',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['fear', 'urgency'],
    content: {
      sender: { name: 'IRS Tax Department', email: 'refunds@irs-gov-refund.com' },
      subject: 'IMMEDIATE ACTION REQUIRED: Tax Refund Issue',
      body: `ATTENTION TAXPAYER,

Our records indicate an issue with your tax refund of $1,247.00. Your refund has been flagged for additional verification.

You must verify your identity within 48 hours or your refund will be forfeited.

[Verify Identity Now]

Failure to respond will result in permanent loss of your refund.

Internal Revenue Service`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a tax scam. The IRS never initiates contact via email for refunds or verification. The domain is fake, and the urgent threatening language is a red flag.',
    points: 10,
  },
  {
    id: 'email_e009',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['curiosity'],
    content: {
      sender: { name: 'Spotify', email: 'noreply@spotify.com' },
      subject: 'Your 2024 Wrapped is here!',
      body: `Hi,

Your Spotify Wrapped 2024 is ready! Discover your top artists, songs, and genres from this year.

[View Your Wrapped]

Share your Wrapped with friends and see how your music taste compares.

Thanks for listening,
The Spotify Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Spotify Wrapped notification. The sender domain is correct, and the message matches Spotify\'s annual Wrapped campaign format.',
    points: 10,
  },
  {
    id: 'email_e010',
    type: 'email',
    difficulty: 'Easy',
    manipulation_tags: ['reward', 'curiosity'],
    content: {
      sender: { name: 'Apple ID', email: 'appleid@id.apple.com' },
      subject: 'Your Apple ID was used to sign in to iCloud',
      body: `Dear Customer,

Your Apple ID (j***@gmail.com) was used to sign in to iCloud on a new device.

Device: iPhone 15 Pro
Location: Singapore
Time: Dec 15, 2024 at 9:23 AM

If this was you, you can ignore this email.
If not, [secure your account] immediately.

Apple Support`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Apple ID security notification. The sender domain is correct (id.apple.com), and it provides specific details without demanding immediate suspicious action.',
    points: 10,
  },

  // MEDIUM EMAIL SCENARIOS (12)
  {
    id: 'email_m001',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'urgency'],
    content: {
      sender: { name: 'Prof. Sarah Mitchell', email: 's.mitchell@university.edu' },
      subject: 'Research Assistant Position - Immediate Start',
      body: `Hello,

I'm Professor Mitchell from the Computer Science department. I'm looking for a research assistant for an urgent project starting next week.

Your academic record caught my attention. This position pays $25/hour and requires 10 hours per week.

Please reply with:
- Your full name
- Phone number
- Bank account details for payroll setup

I need to finalize this by end of day.

Best,
Prof. Mitchell`,
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a sophisticated impersonation scam. While the email appears to be from a professor, requesting bank details via email is highly unusual and unsafe. Always verify such requests in person or through official channels.',
    points: 15,
  },
  {
    id: 'email_m002',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['urgency', 'fear'],
    content: {
      sender: { name: 'Microsoft Account Team', email: 'account-security@microsoft.com' },
      subject: 'Unusual sign-in activity detected',
      body: `Hi,

We detected an unusual sign-in attempt to your Microsoft account from an unrecognized device.

Sign-in details:
• Device: Unknown Android device
• Location: Moscow, Russia
• IP: 185.220.101.42
• Time: Dec 15, 2024, 3:47 AM (UTC)

If this was you, you can safely ignore this email.
If not, [secure your account] immediately.

Microsoft Account Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Microsoft security alert. The sender domain is correct, and it provides detailed information about the suspicious activity without creating false urgency.',
    points: 15,
  },
  {
    id: 'email_m003',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['reward', 'social_proof'],
    content: {
      sender: { name: 'Zoom Video Communications', email: 'billing@zoomvideocommunications.com' },
      subject: 'Your Zoom subscription invoice - $499.99',
      body: `Dear Customer,

Thank you for your recent purchase. Your Zoom Business subscription has been renewed.

Invoice #: ZM-2024-78432
Amount: $499.99
Date: Dec 15, 2024

[View Invoice]  [Manage Subscription]

If you did not authorize this charge, please contact our billing department within 7 days.

Zoom Billing Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Zoom billing notification. The sender domain is correct, and the invoice format matches standard Zoom communications. The amount is reasonable for a business subscription.',
    points: 15,
  },
  {
    id: 'email_m004',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'fear', 'urgency'],
    content: {
      sender: { name: 'Bank BCA Security', email: 'security@bca-bank-alert.co.id' },
      subject: 'PERINGATAN: Aktivitas mencurigakan pada rekening Anda',
      body: `Yth. Nasabah,

Kami mendeteksi transaksi mencurigakan pada rekening Anda:

Nomor Rekening: ****1234
Transaksi: Rp 15.000.000
Waktu: 15 Des 2024, 14:23 WIB
Lokasi: Jakarta

Jika ini bukan Anda, segera konfirmasi dalam 1 jam atau rekening akan diblokir.

[Konfirmasi Sekarang]

Hormat kami,
Tim Keamanan BCA`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a banking scam. The domain "bca-bank-alert.co.id" is fake. Real banks never send urgent security alerts via email with external links. The 1-hour deadline is a classic pressure tactic.',
    points: 15,
  },
  {
    id: 'email_m005',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['curiosity', 'social_proof'],
    content: {
      sender: { name: 'GitHub', email: 'noreply@github.com' },
      subject: 'You were mentioned in a pull request',
      body: `Hi @username,

You were mentioned in a pull request by alex-dev:

"@username Could you review the security fix in auth.js? The token validation logic needs another pair of eyes. Thanks!"

[View Pull Request #2847]

Repository: company/webapp
Branch: fix/auth-validation

GitHub`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate GitHub notification. The sender domain is correct, and the message format matches standard GitHub mention notifications with specific PR details.',
    points: 15,
  },
  {
    id: 'email_m006',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['reward', 'urgency'],
    content: {
      sender: { name: 'Shopee Rewards', email: 'rewards@shopee-rewards-id.com' },
      subject: 'Selamat! Anda memenangkan iPhone 15 Pro!',
      body: `Selamat!

Anda terpilih sebagai pemenang undian Shopee 12.12!

Hadiah: iPhone 15 Pro 256GB
Nilai: Rp 20.999.000

Untuk mengklaim hadiah:
1. Klik link di bawah
2. Bayar biaya pengiriman Rp 150.000
3. Hadiah dikirim dalam 3 hari kerja

[Klaim Hadiah Sekarang]

Penawaran berakhir dalam 24 jam!

Tim Shopee`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a giveaway scam. The domain is fake, and legitimate giveaways never require payment for "shipping fees." The urgent 24-hour deadline is a red flag.',
    points: 15,
  },
  {
    id: 'email_m007',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'curiosity'],
    content: {
      sender: { name: 'Slack', email: 'notifications@slack.com' },
      subject: 'New login from Chrome on Windows',
      body: `Hi there,

We noticed a new login to your Slack workspace.

Workspace: Company Team
Browser: Chrome on Windows 11
Location: Jakarta, Indonesia
IP: 182.253.***.***
Time: Dec 15, 2024 at 10:15 AM

If this was you, no action is needed.
If not, [review your account security].

Slack Security Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Slack security notification. The sender domain is correct, and the message provides specific details without creating false urgency.',
    points: 15,
  },
  {
    id: 'email_m008',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['fear', 'urgency'],
    content: {
      sender: { name: 'DHL Express', email: 'tracking@dhl-express-delivery.com' },
      subject: 'URGENT: Package delivery failed - Customs fee required',
      body: `Dear Customer,

Your package (Tracking: DHL7843291) could not be delivered due to unpaid customs fees.

Amount Due: $47.50
Status: ON HOLD

Your package will be returned to sender in 48 hours if payment is not received.

[Pay Customs Fee Now]

DHL Customer Service`,
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a delivery scam. The domain is fake, and DHL never sends payment requests via email with external links. Real customs fees are handled through official government portals.',
    points: 15,
  },
  {
    id: 'email_m009',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['social_proof', 'curiosity'],
    content: {
      sender: { name: 'Notion', email: 'team@mails.notion.so' },
      subject: 'Sarah invited you to "Q4 Product Roadmap"',
      body: `Hi,

Sarah Chen invited you to collaborate on a page:

"Q4 Product Roadmap"

You'll have edit access to this workspace. You can view, edit, and share pages with your team.

[Open in Notion]

Notion Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Notion invitation. The sender domain is correct (notion.so), and the message format matches standard Notion sharing notifications.',
    points: 15,
  },
  {
    id: 'email_m010',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'reward'],
    content: {
      sender: { name: 'Dean of Students', email: 'dean@university-scholarship.org' },
      subject: 'Congratulations! Scholarship Award Notification',
      body: `Dear Student,

We are pleased to inform you that you have been selected for the Academic Excellence Scholarship.

Award Amount: $5,000 per semester
Duration: 4 semesters

To accept this award, please complete the verification process:
[Accept Scholarship]

Deadline: December 20, 2024

Congratulations!
Office of Financial Aid`,
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a scholarship scam. The domain is fake, and real scholarship notifications come through official university channels, not external domains. Always verify through your student portal.',
    points: 15,
  },
  {
    id: 'email_m011',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['urgency', 'fear'],
    content: {
      sender: { name: 'Adobe Creative Cloud', email: 'noreply@mail.adobe.com' },
      subject: 'Your subscription expires in 3 days',
      body: `Hi,

Your Adobe Creative Cloud subscription expires on December 18, 2024.

Plan: Photography (20GB)
Current Price: $9.99/month
Renewal Price: $11.99/month

[Renew Now]  [Manage Subscription]

Your files will remain accessible, but editing features will be limited after expiration.

Adobe Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Adobe subscription notification. The sender domain is correct (adobe.com), and the renewal pricing is accurate for Adobe\'s Photography plan.',
    points: 15,
  },
  {
    id: 'email_m012',
    type: 'email',
    difficulty: 'Medium',
    manipulation_tags: ['curiosity', 'fear'],
    content: {
      sender: { name: 'Facebook Security', email: 'security@facebookmail.com' },
      subject: 'Someone may have accessed your account',
      body: `Hi,

We noticed a login from a device you don't usually use.

Device: Samsung Galaxy S23
Location: Kuala Lumpur, Malaysia
Time: Dec 15, 2024 at 2:30 AM

If this was you, you can ignore this email.
If not, [secure your account] now.

Facebook Security`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Facebook security notification. The sender domain is correct (facebookmail.com), and the message format matches Facebook\'s standard security alerts.',
    points: 15,
  },

  // ADVANCED EMAIL SCENARIOS (8)
  {
    id: 'email_a001',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'urgency', 'social_proof'],
    content: {
      sender: { name: 'Dr. James Wilson', email: 'j.wilson@stanford-research.edu' },
      subject: 'RE: Collaboration Opportunity - Stanford Cybersecurity Lab',
      body: `Dear Colleague,

Following up on our conversation at the IEEE Security Symposium. I'm impressed by your research on behavioral biometrics.

We're recruiting 5 researchers for a DARPA-funded project on "Human Factors in Authentication." The grant is $2.4M over 3 years.

Your profile matches what we're looking for. To proceed:
1. Review the attached NDA
2. Complete the background check form
3. Submit your CV and SSN for clearance processing

[Secure Document Portal]

The selection committee meets Friday. I can reserve a spot if you respond by Thursday EOD.

Best regards,
Dr. James Wilson
Principal Investigator
Stanford Cybersecurity Lab`,
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a sophisticated academic scam. The fake Stanford domain, request for SSN, and artificial deadline are red flags. Real research positions never ask for SSN via email.',
    points: 20,
  },
  {
    id: 'email_a002',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['urgency', 'fear', 'authority'],
    content: {
      sender: { name: 'AWS Security Operations', email: 'security@amazonaws.com' },
      subject: 'Action Required: Suspicious API activity in us-east-1',
      body: `Hello,

We've detected and mitigated a DDoS attack on your domain:

Domain: example.com
Attack Type: Layer 7 (HTTP flood)
Peak Requests: 2.3M requests/second
Duration: 4 minutes 32 seconds
Mitigation: Automatically activated

Your site remained online. No action required.

[View Attack Details]  [Security Settings]

Attack source IPs have been added to our threat intelligence database.

Cloudflare Security Team
Attack ID: CF-2024-ATK-89324`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate AWS security alert. The sender domain is correct (amazonaws.com), and the message provides specific technical details including case ID for tracking.',
    points: 20,
  },
  {
    id: 'email_a003',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['reward', 'social_proof', 'curiosity'],
    content: {
      sender: { name: 'Y Combinator', email: 'partners@ycombinator.com' },
      subject: 'YC W25 Interview Invitation',
      body: `Hi,

We've reviewed your application for Y Combinator Winter 2025 batch. We'd like to invite you for an interview.

Interview Details:
• Date: January 8, 2025
• Time: 10:00 AM PT
• Format: Video call (link will be sent separately)
• Duration: 10 minutes

Please confirm your availability by December 20.

[Confirm Interview]

Looking forward to meeting you.

Y Combinator Partners`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Y Combinator interview invitation. The sender domain is correct, and the format matches YC\'s standard interview process with specific dates and confirmation mechanism.',
    points: 20,
  },
  {
    id: 'email_a004',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'fear', 'urgency'],
    content: {
      sender: { name: 'Legal Department', email: 'legal@company-counsel-services.com' },
      subject: 'SUBPOENA: Legal Notice - Immediate Response Required',
      body: `ATTENTION:

You have been named as a defendant in case #2024-CV-78432. Failure to respond within 72 hours will result in default judgment.

Allegations:
• Copyright infringement
• DMCA violations
• Statutory damages: $150,000 per work

[View Legal Documents]
[Respond to Subpoena]

This is an official legal notice. Consultation with an attorney is recommended.

Smith & Associates Law Firm
Licensed in California, Bar #284739`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a legal scare scam. Real subpoenas are served in person or via certified mail, not email. The external domain and urgent deadline are major red flags.',
    points: 20,
  },
  {
    id: 'email_a005',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['curiosity', 'social_proof', 'urgency'],
    content: {
      sender: { name: 'Product Hunt', email: 'hello@producthunt.com' },
      subject: 'Your product is #1 on Product Hunt today!',
      body: `Hey there,

Congratulations! Your product "CyberShield" is currently #1 on Product Hunt!

Today's Stats:
• Upvotes: 847
• Comments: 123
• Maker Rating: 4.9/5

You're trending in:
#1 Productivity
#2 Developer Tools

Keep the momentum going! Share with your network:
[Share on Twitter]  [Share on LinkedIn]

The Product Hunt Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Product Hunt notification. The sender domain is correct, and the message format matches Product Hunt\'s daily ranking notifications with specific stats.',
    points: 20,
  },
  {
    id: 'email_a006',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'reward', 'fear'],
    content: {
      sender: { name: 'Coinbase Support', email: 'support@coinbase-secure-wallet.com' },
      subject: 'Your account has been flagged for suspicious trading activity',
      body: `Dear Coinbase User,

Our compliance team has flagged your account for review due to unusual trading patterns.

Flagged Activity:
• 23 high-value transactions in 24 hours
• Total volume: $127,000 USDC
• Connected wallet: 0x7a8...3f2

To avoid account suspension, verify your identity within 6 hours:
[Complete Verification]

Unverified accounts will be restricted from withdrawals.

Coinbase Compliance Team
Reference: CB-2024-89324`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a crypto scam. The domain is fake, and Coinbase never sends urgent verification requests via email. The 6-hour deadline and wallet address format are red flags.',
    points: 20,
  },
  {
    id: 'email_a007',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['urgency', 'authority', 'curiosity'],
    content: {
      sender: { name: 'Figma', email: 'notifications@figma.com' },
      subject: 'Your Figma organization has been upgraded to Enterprise',
      body: `Hi,

Your Figma organization "Design Team" has been upgraded to Enterprise plan.

New Features Unlocked:
• Unlimited projects
• Advanced prototyping
• Dev Mode for all files
• Organization-wide design systems
• SSO and advanced security

Your billing will be updated starting next cycle: $45/editor/month.

[Manage Organization]  [View Invoice]

Questions? Contact our sales team.

Figma Team`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Figma notification. The sender domain is correct, and the Enterprise pricing ($45/editor/month) matches Figma\'s actual pricing.',
    points: 20,
  },
  {
    id: 'email_a008',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['fear', 'urgency', 'social_proof'],
    content: {
      sender: { name: 'Cloudflare Security', email: 'security@cloudflare.com' },
      subject: 'DDoS attack detected on your domain',
      body: `Hi,

We've detected and mitigated a DDoS attack on your domain:

Domain: example.com
Attack Type: Layer 7 (HTTP flood)
Peak Requests: 2.3M requests/second
Duration: 4 minutes 32 seconds
Mitigation: Automatically activated

Your site remained online. No action required.

[View Attack Details]  [Security Settings]

Attack source IPs have been added to our threat intelligence database.

Cloudflare Security Team
Attack ID: CF-2024-ATK-89324`,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate Cloudflare security notification. The sender domain is correct, and the message provides detailed attack metrics with a reference ID for verification.',
    points: 20,
  },
];

// ============================================
// WHATSAPP SCAM SCENARIOS (25 Total)
// ============================================

const whatsappScenarios: Scenario[] = [
  // EASY WHATSAPP SCENARIOS (8) - President University Context
  {
    id: 'wa_e001',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['urgency', 'social_proof'],
    content: {
      sender_name: 'Ketua Kelas IT-2A 🎓',
      sender_number: '+62 812-7821-0942',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ketua',
      messages: [
        { id: '1', text: 'Halo semuanya, ini dari ketua kelas IT-2A. Untuk persiapan sidang skripsi bareng besok, kita perlu urun kas buat cetak dokumen dan snack. Mohon transfer ASAP ya 🙏', timestamp: '9:14 AM', is_sender: true },
        { id: '2', text: 'Transfer ke:\nBCA: 8745 2219 0183\nA/N: Budi Santoso\n\nMasing-masing Rp 75.000 ya. Deadline jam 12 siang!', timestamp: '9:15 AM', is_sender: true },
        { id: '3', text: 'Yang udah transfer tolong konfirmasi di sini ya. Tq 🙏', timestamp: '9:16 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'Jangan transfer dulu sebelum verifikasi! Nomor ini mungkin nomor asing atau akun yang diretas. Selalu konfirmasi langsung ke ketua kelas via telepon atau tanya ke anggota grup terpercaya sebelum mengirim uang. Modus ini sangat umum di lingkungan kampus.',
    points: 10,
  },
  {
    id: 'wa_e002',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['reward', 'authority'],
    content: {
      sender_name: 'BEM President University',
      sender_number: '+62 821-3300-9988',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=bem',
      messages: [
        { id: '1', text: '📢 PENGUMUMAN RESMI BEM PRESIDENT UNIVERSITY\n\nSelamat! Anda terpilih sebagai peserta program Beasiswa Prestasi 2025 dari BEM Pusat senilai Rp 2.000.000!', timestamp: '11:00 AM', is_sender: true },
        { id: '2', text: 'Untuk proses verifikasi, mohon kirimkan:\n1. Foto KTM\n2. Foto KTP\n3. Nomor rekening aktif\n\nKe nomor ini paling lambat hari ini pukul 17.00 WIB. Slot terbatas!', timestamp: '11:01 AM', is_sender: true },
        { id: '3', text: 'Informasi resmi juga sudah di-share di Instagram @bem.presidentuniversity', timestamp: '11:02 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'Ini adalah penipuan berkedok BEM. BEM resmi tidak pernah meminta data pribadi (KTM, KTP, nomor rekening) melalui WhatsApp secara tiba-tiba. Selalu verifikasi melalui website atau akun media sosial resmi kampus. Jangan pernah mengirim foto KTP ke nomor yang tidak dikenal.',
    points: 10,
  },
  {
    id: 'wa_e003',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['authority', 'urgency'],
    content: {
      sender_name: 'Bank Security',
      sender_number: 'Bank Alert',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=bank',
      messages: [
        { id: '1', text: 'SECURITY ALERT: We detected 3 unauthorized login attempts on your account from IP address 185.220.101.42 (Russia).', timestamp: '3:45 PM', is_sender: true },
        { id: '2', text: 'To secure your account, reply with:\n1. Your full card number\n2. CVV code\n3. OTP sent to your phone', timestamp: '3:46 PM', is_sender: true },
        { id: '3', text: '⚠️ Your account will be frozen in 10 minutes if no response received.', timestamp: '3:47 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'Banks never ask for CVV codes or OTPs via WhatsApp. This is a credential harvesting scam designed to steal your banking information. Report immediately.',
    points: 10,
  },
  {
    id: 'wa_e004',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['curiosity'],
    content: {
      sender_name: 'Sarah (Classmate)',
      sender_number: '+1 (555) 9876',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      messages: [
        { id: '1', text: 'Hey! Are you coming to the study group tonight? We\'re meeting at 7pm at the library.', timestamp: '11:20 AM', is_sender: true },
        { id: '2', text: 'Also, can you bring your notes from last week? I missed that lecture.', timestamp: '11:21 AM', is_sender: true },
      ],
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a normal message from a classmate. No suspicious requests, urgency, or unusual links. The context is appropriate and expected.',
    points: 10,
  },
  {
    id: 'wa_e005',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['fear'],
    content: {
      sender_name: 'Cyber Police',
      sender_number: '+91 98765 43210',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=police',
      messages: [
        { id: '1', text: '⚠️ OFFICIAL NOTICE ⚠️\n\nThis is the Cyber Crime Investigation Department. Your IP address has been linked to illegal online activities.', timestamp: '9:00 AM', is_sender: true },
        { id: '2', text: 'To avoid arrest warrant, pay a settlement fee of ₹25,000 immediately.', timestamp: '9:01 AM', is_sender: true },
        { id: '3', text: 'Payment must be made within 2 hours. Failure to comply will result in immediate legal action.', timestamp: '9:02 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a police impersonation scam. Law enforcement never contacts suspects via WhatsApp demanding payment. Report and block immediately.',
    points: 10,
  },
  {
    id: 'wa_e006',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['reward', 'social_proof'],
    content: {
      sender_name: 'Job Recruiter',
      sender_number: '+1 (555) JOB-HIRE',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=recruiter',
      messages: [
        { id: '1', text: 'Hello! We found your profile on LinkedIn. We have a remote position paying $5,000/week with flexible hours.', timestamp: '2:00 PM', is_sender: true },
        { id: '2', text: 'No experience needed! Just need to pay a $99 training fee to get started.', timestamp: '2:01 PM', is_sender: true },
        { id: '3', text: '50+ people have already joined this week. Limited spots available!', timestamp: '2:02 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a job scam. Legitimate jobs never require upfront payment for training. The unrealistic salary and urgency are red flags.',
    points: 10,
  },
  {
    id: 'wa_e007',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['social_proof'],
    content: {
      sender_name: 'Team Group Chat',
      sender_number: 'Group',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=team',
      messages: [
        { id: '1', text: 'Hey team! Don\'t forget about the all-hands meeting at 3pm today.', timestamp: '10:00 AM', is_sender: true },
        { id: '2', text: 'The Q4 results presentation will be shared during the meeting.', timestamp: '10:01 AM', is_sender: true },
        { id: '3', text: 'See you all there! 🚀', timestamp: '10:02 AM', is_sender: true },
      ],
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a normal team group chat message. No suspicious requests or unusual content. The context is appropriate for workplace communication.',
    points: 10,
  },
  {
    id: 'wa_e008',
    type: 'whatsapp',
    difficulty: 'Easy',
    manipulation_tags: ['curiosity', 'fear'],
    content: {
      sender_name: 'Unknown',
      sender_number: '+62 812 3456 7890',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=unknown',
      messages: [
        { id: '1', text: 'Is this you in this video? 😱\n\n[Video Link: bit.ly/2xVideo]', timestamp: '8:30 PM', is_sender: true },
        { id: '2', text: 'Everyone is talking about it!', timestamp: '8:31 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a malware distribution scam. The shortened link likely leads to malicious software. Never click links from unknown contacts.',
    points: 10,
  },

  // MEDIUM WHATSAPP SCENARIOS (10)
  {
    id: 'wa_m001',
    type: 'whatsapp',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'reward'],
    content: {
      sender_name: 'HR Department',
      sender_number: 'Company HR',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=hr',
      messages: [
        { id: '1', text: 'Good morning! This is HR regarding your year-end bonus.', timestamp: '9:00 AM', is_sender: true },
        { id: '2', text: 'Your bonus of $3,500 has been processed. To release the payment, please confirm your bank details:', timestamp: '9:01 AM', is_sender: true },
        { id: '3', text: 'Bank name:\nAccount number:\nRouting number:', timestamp: '9:02 AM', is_sender: true },
        { id: '4', text: 'Please reply within 2 hours to ensure payment today.', timestamp: '9:03 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is an HR impersonation scam. Real HR departments use official channels and never request bank details via WhatsApp. The urgency is a red flag.',
    points: 15,
  },
  {
    id: 'wa_m002',
    type: 'whatsapp',
    difficulty: 'Medium',
    manipulation_tags: ['social_proof', 'reward'],
    content: {
      sender_name: 'Investment Advisor',
      sender_number: '+1 (555) INVEST',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor',
      messages: [
        { id: '1', text: 'Hi! I help people invest in crypto. My clients made 300% returns last month.', timestamp: '3:00 PM', is_sender: true },
        { id: '2', text: 'I have a limited spot in my exclusive group. Minimum investment: $1,000.', timestamp: '3:01 PM', is_sender: true },
        { id: '3', text: 'Join 500+ successful investors. Only 3 spots left!', timestamp: '3:02 PM', is_sender: true },
        { id: '4', text: 'Reply YES to get started with guaranteed returns.', timestamp: '3:03 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is an investment scam. Guaranteed returns are impossible. The social proof (500+ investors) and urgency tactics are classic scam indicators.',
    points: 15,
  },
  {
    id: 'wa_m003',
    type: 'whatsapp',
    difficulty: 'Medium',
    manipulation_tags: ['urgency', 'fear'],
    content: {
      sender_name: 'Electric Company',
      sender_number: 'PLN Alert',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=pln',
      messages: [
        { id: '1', text: 'PEMBERITAHUAN: Tagihan listrik Anda Rp 2.450.000 belum dibayar.', timestamp: '4:00 PM', is_sender: true },
        { id: '2', text: 'Pembayaran dapat dilakukan melalui link berikut untuk menghindari pemutusan listrik:', timestamp: '4:01 PM', is_sender: true },
        { id: '3', text: '[Bayar Sekarang: pln-payment.co.id]', timestamp: '4:02 PM', is_sender: true },
        { id: '4', text: '⏰ Pemutusan akan dilakukan dalam 4 jam.', timestamp: '4:03 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a utility scam. The fake domain and 4-hour deadline are red flags. Real utility companies provide multiple payment channels and advance notice.',
    points: 15,
  },
  {
    id: 'wa_m004',
    type: 'whatsapp',
    difficulty: 'Medium',
    manipulation_tags: ['curiosity', 'social_proof'],
    content: {
      sender_name: 'Event Organizer',
      sender_number: '+62 878 9012 3456',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=event',
      messages: [
        { id: '1', text: 'Hi! You\'re invited to an exclusive networking event for tech professionals.', timestamp: '11:00 AM', is_sender: true },
        { id: '2', text: 'Date: January 15, 2025\nVenue: Grand Hyatt Jakarta\nTime: 6:00 PM', timestamp: '11:01 AM', is_sender: true },
        { id: '3', text: 'Past attendees include CEOs from 50+ startups. RSVP required.', timestamp: '11:02 AM', is_sender: true },
        { id: '4', text: '[Confirm Attendance]', timestamp: '11:03 AM', is_sender: true },
      ],
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This appears to be a legitimate event invitation with specific details, professional venue, and reasonable RSVP process. No red flags detected.',
    points: 15,
  },
  {
    id: 'wa_m005',
    type: 'whatsapp',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'urgency'],
    content: {
      sender_name: 'DHL Delivery',
      sender_number: 'DHL Express',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=dhl',
      messages: [
        { id: '1', text: 'DHL Express: Your package is ready for delivery.', timestamp: '2:00 PM', is_sender: true },
        { id: '2', text: 'Tracking: DHL7843291\nStatus: Customs clearance required', timestamp: '2:01 PM', is_sender: true },
        { id: '3', text: 'Pay customs fee of $35 to release your package:', timestamp: '2:02 PM', is_sender: true },
        { id: '4', text: '[Pay Customs Fee: dhl-customs-pay.com]', timestamp: '2:03 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a delivery scam. DHL never requests payment via WhatsApp. Real customs fees are paid through official government portals, not external links.',
    points: 15,
  },

  // ADVANCED WHATSAPP SCENARIOS (7)
  {
    id: 'wa_a001',
    type: 'whatsapp',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'social_proof', 'urgency'],
    content: {
      sender_name: 'CEO Office',
      sender_number: '+1 (555) CEO-DIRECT',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ceo',
      messages: [
        { id: '1', text: 'This is urgent. I\'m in a board meeting and need you to handle something confidential.', timestamp: '11:30 AM', is_sender: true },
        { id: '2', text: 'We need to secure a deal worth $2M. I need you to wire $50,000 as a deposit immediately.', timestamp: '11:31 AM', is_sender: true },
        { id: '3', text: 'Account: 7843291045\nBank: Chase\nRouting: 021000021', timestamp: '11:32 AM', is_sender: true },
        { id: '4', text: 'This is time-sensitive. Confirm once sent. Do not discuss with anyone.', timestamp: '11:33 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a sophisticated CEO fraud (BEC) scam. The urgency, confidentiality, and wire request are classic indicators. Always verify wire requests through a second channel.',
    points: 20,
  },
  {
    id: 'wa_a002',
    type: 'whatsapp',
    difficulty: 'Advanced',
    manipulation_tags: ['curiosity', 'fear', 'social_proof'],
    content: {
      sender_name: 'Health Department',
      sender_number: 'COVID-19 Alert',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=health',
      messages: [
        { id: '1', text: '⚠️ COVID-19 EXPOSURE ALERT ⚠️', timestamp: '8:00 AM', is_sender: true },
        { id: '2', text: 'You have been identified as a close contact of a confirmed COVID-19 case.', timestamp: '8:01 AM', is_sender: true },
        { id: '3', text: 'Mandatory testing required. Book your appointment:', timestamp: '8:02 AM', is_sender: true },
        { id: '4', text: '[Book Test: health-test-booking.com]\n\nFailure to test within 48 hours may result in fines.', timestamp: '8:03 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a health-related phishing scam. Health departments use official channels, not WhatsApp. The external link and threat of fines are red flags.',
    points: 20,
  },
  {
    id: 'wa_a003',
    type: 'whatsapp',
    difficulty: 'Advanced',
    manipulation_tags: ['reward', 'authority', 'social_proof'],
    content: {
      sender_name: 'Venture Capital',
      sender_number: '+1 (415) VC-FUND',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vc',
      messages: [
        { id: '1', text: 'Hi! I\'m a partner at Sequoia Capital. We\'re interested in your startup.', timestamp: '10:00 AM', is_sender: true },
        { id: '2', text: 'We\'re offering $500K seed funding at a $5M valuation.', timestamp: '10:01 AM', is_sender: true },
        { id: '3', text: 'Before term sheet, we need a $5,000 due diligence fee to proceed.', timestamp: '10:02 AM', is_sender: true },
        { id: '4', text: 'This is standard practice. 20+ founders have taken this offer this month.', timestamp: '10:03 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a fake VC scam. Legitimate VCs never charge due diligence fees. The social proof and urgency are designed to pressure founders into paying.',
    points: 20,
  },
  {
    id: 'wa_a004',
    type: 'whatsapp',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'urgency', 'fear'],
    content: {
      sender_name: 'Immigration Office',
      sender_number: 'DHS Alert',
      profile_pic: 'https://api.dicebear.com/7.x/identicon/svg?seed=immigration',
      messages: [
        { id: '1', text: 'U.S. Citizenship and Immigration Services', timestamp: '9:00 AM', is_sender: true },
        { id: '2', text: 'Your visa application has been flagged for review. Immediate action required.', timestamp: '9:01 AM', is_sender: true },
        { id: '3', text: 'Pay the expedited processing fee of $500 to avoid deportation proceedings:', timestamp: '9:02 AM', is_sender: true },
        { id: '4', text: '[Pay Fee: uscis-expedite-payment.com]\n\nDeadline: 24 hours', timestamp: '9:03 AM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is an immigration scam. USCIS never contacts applicants via WhatsApp or demands payment through external links. The deportation threat is a scare tactic.',
    points: 20,
  },
  {
    id: 'wa_a005',
    type: 'whatsapp',
    difficulty: 'Advanced',
    manipulation_tags: ['social_proof', 'curiosity', 'reward'],
    content: {
      sender_name: 'Influencer Agency',
      sender_number: '+1 (310) TALENT',
      profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agency',
      messages: [
        { id: '1', text: 'Hey! We represent major brands like Nike and Adidas.', timestamp: '3:00 PM', is_sender: true },
        { id: '2', text: 'Your profile caught our attention. We want to offer you a brand deal worth $10,000/month.', timestamp: '3:01 PM', is_sender: true },
        { id: '3', text: 'To get started, we need a $200 portfolio review fee.', timestamp: '3:02 PM', is_sender: true },
        { id: '4', text: '50+ influencers signed with us this quarter. Don\'t miss out!', timestamp: '3:03 PM', is_sender: true },
      ],
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is an influencer scam. Real agencies never charge upfront fees. The unrealistic offer and social proof are designed to extract money from aspiring influencers.',
    points: 20,
  },
];

// ============================================
// ENTERPRISE EMAIL SCENARIOS (3 Total)
// ============================================
emailScenarios.push(
  {
    id: 'email_a009',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'fear', 'urgency'],
    content: {
      sender: { name: 'CISO / Security Operations', email: 'sec-ops@company-global-it.com' },
      subject: '[CRITICAL] Zero-Day Vulnerability Patch Required - Action Immediate',
      body: `All IT & Engineering Staff,

A critical zero-day vulnerability (CVE-2025-0145) affecting our core VPN infrastructure has been actively exploited in the wild.

Pursuant to the emergency directive from the CISO, all employees with VPN access must deploy the mandatory security patch within the next 4 hours. Failure to comply will result in automatic network isolation to prevent lateral movement.

[Download & Install Patch v4.2.1]

If you encounter issues during installation, please open a P1 ticket in Jira.

Corporate IT Security`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'Highly sophisticated enterprise phishing. The domain "company-global-it.com" is generic and likely fake. Real critical patches are typically deployed via MDM or automated patching systems, not via a direct email download link which likely serves malware.',
    points: 20,
  },
  {
    id: 'email_a010',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'fear'],
    content: {
      sender: { name: 'Legal Department - Global', email: 'compliance@international-privacy-board.org' },
      subject: 'NOTICE OF GDPR DATA BREACH INVESTIGATION - INTERVIEW REQUIRED',
      body: `Dear Employee,

You have been identified as a key person of interest in the ongoing investigation regarding the recent Customer Data Exfiltration Incident affecting 2.4 million records.

Under the GDPR compliance framework, you are required to attend a mandatory compliance review interview with external counsel tomorrow at 10:00 AM EST. 

Please review the attached preliminary findings document securely in the portal before the meeting:
[Access Confidential Briefing]

Do not discuss this matter with other colleagues as it is subject to an active internal audit.

Regards,
Data Privacy & Compliance Office`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'Enterprise legal/breach scare tactic. Uses fake authority (International Privacy Board) and demands secrecy to isolate the victim. The link goes to a credential harvesting page masquerading as a secure portal.',
    points: 20,
  },
  {
    id: 'email_a011',
    type: 'email',
    difficulty: 'Advanced',
    manipulation_tags: ['urgency', 'authority'],
    content: {
      sender: { name: 'Cloud Provider Infrastructure', email: 'alert@aws-infrastructure-monitor.com' },
      subject: 'CRITICAL: S3 Bucket Data Exposure Warning - ID: 88472',
      body: `DevOps & Engineering Team,

Our automated monitoring has detected that the production S3 bucket "prod-customer-data-backup-01" has been inadvertently configured to "Public Read" access, exposing potentially sensitive user data.

To prevent an enterprise data breach scenario, you must immediately re-configure the bucket permissions.

[Review Bucket Access Policies]

This incident has been logged. Action must be verified within 30 minutes to comply with corporate security SLA.

Automated Infrastructure Monitor`,
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'Targeted attack against IT professionals. The domain "aws-infrastructure-monitor.com" is not a legitimate AWS domain. The urgency and specific technical jargon are designed to make the engineer click the link without thinking, which will likely steal AWS console credentials.',
    points: 20,
  }
);

// ============================================
// INSTAGRAM DM SCENARIOS (25 Total)
// ============================================

const instagramScenarios: Scenario[] = [
  // EASY INSTAGRAM SCENARIOS (8)
  {
    id: 'ig_e001',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['reward', 'social_proof'],
    content: {
      username: 'nike.official.collab',
      display_name: 'Nike Collaborations',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=nike',
      verified: false,
      dm_content: `Hey! 👋

We love your content and want to collaborate with you! 🎉

You're selected for our "Micro-Influencer Program" with these benefits:
✅ Free Nike products monthly
✅ $500 per sponsored post
✅ Affiliate commission (15%)

To get started, click: [Apply Now]

Limited spots available! 🔥`,
      link_preview: {
        title: 'Nike Creator Program',
        description: 'Join our exclusive creator community',
        image: '',
        url: 'nike-creators-apply.com',
      },
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a fake brand collaboration scam. The account is not verified, uses a suspicious username, and the link domain is not official Nike. Real brand deals don\'t come through random DMs.',
    points: 10,
  },
  {
    id: 'ig_e002',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['reward', 'urgency'],
    content: {
      username: 'apple.giveaway.2024',
      display_name: '🍎 Apple Giveaway',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=apple',
      verified: false,
      dm_content: `🎁 GIVEAWAY ALERT! 🎁

We're giving away 10 iPhone 15 Pro Max devices!

To enter:
1️⃣ Follow @apple.giveaway.2024
2️⃣ Like this message
3️⃣ Click: [Enter Giveaway]
4️⃣ Complete verification

Winners announced in 2 hours! Good luck! 🍀`,
      link_preview: {
        title: 'iPhone 15 Giveaway',
        description: 'Enter to win the latest iPhone',
        image: '',
        url: 'iphone-giveaway-win.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a giveaway scam. Apple does not run giveaways through random Instagram accounts. These scams harvest personal data or require payment for "shipping".',
    points: 10,
  },
  {
    id: 'ig_e003',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['authority', 'fear'],
    content: {
      username: 'instagram.support.team',
      display_name: 'Instagram Support',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=instagram',
      verified: true,
      dm_content: `⚠️ COPYRIGHT VIOLATION NOTICE ⚠️

Your account has been reported for copyright infringement.

If you believe this is a mistake, you must verify your identity within 24 hours to avoid permanent account suspension.

Verify here: [Verify Account]

Failure to respond will result in immediate account deletion.

- Instagram Trust & Safety Team`,
      link_preview: {
        title: 'Instagram - Verify Identity',
        description: 'Secure account verification',
        image: '',
        url: 'instagram-verify-support.com',
      },
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'Even verified accounts can be compromised. The link domain is suspicious (not instagram.com). Instagram never sends copyright notices via DM with external links.',
    points: 10,
  },
  {
    id: 'ig_e004',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['social_proof'],
    content: {
      username: 'photography.club',
      display_name: 'University Photo Club',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=photo',
      verified: false,
      dm_content: `Hi! 📸

We saw your photos and think you'd be a great fit for our Photography Club!

We meet every Thursday at 6pm in the Student Center. Our next session is on portrait photography techniques.

Would you be interested in joining? No experience required!

Let us know if you have any questions.`,
      link_preview: undefined,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate club invitation. No suspicious links, urgent requests, or unusual demands. The message is appropriate and contextually relevant.',
    points: 10,
  },
  {
    id: 'ig_e005',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['curiosity', 'fear'],
    content: {
      username: 'account.security.alert',
      display_name: 'Security Alert',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=security',
      verified: false,
      dm_content: `🚨 SECURITY ALERT 🚨

Someone tried to log into your account from an unknown device.

📍 Location: Moscow, Russia
🕐 Time: Just now
📱 Device: iPhone 14

If this wasn't you, secure your account immediately:
[Secure Account Now]`,
      link_preview: {
        title: 'Instagram Security',
        description: 'Protect your account',
        image: '',
        url: 'instagram-secure-login.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a phishing attempt. Instagram security alerts appear in-app, not via DM from random accounts. The external link is a credential harvesting trap.',
    points: 10,
  },
  {
    id: 'ig_e006',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['reward'],
    content: {
      username: 'crypto.investor.pro',
      display_name: 'Crypto Signals 💰',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=crypto',
      verified: false,
      dm_content: `💎 EXCLUSIVE CRYPTO SIGNALS 💎

Join our VIP group for FREE trading signals!

📈 95% accuracy rate
💰 Average 300% monthly returns
🎯 10,000+ successful traders

Limited to first 100 members!

[Join VIP Group]`,
      link_preview: {
        title: 'Crypto VIP Signals',
        description: 'Join 10,000+ successful traders',
        image: '',
        url: 'crypto-vip-signals.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a crypto scam. Guaranteed returns are impossible. These groups often pump-and-dump schemes or require payment for "premium" signals.',
    points: 10,
  },
  {
    id: 'ig_e007',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['social_proof', 'curiosity'],
    content: {
      username: 'design.workshop',
      display_name: 'UI/UX Workshop',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=design',
      verified: false,
      dm_content: `Hello! 🎨

We're hosting a free UI/UX design workshop this Saturday.

Topics:
• Design systems
• Figma best practices
• Portfolio reviews

Time: 2:00 PM - 5:00 PM
Location: Online (Zoom)

Interested? Reply with your email for the link!`,
      link_preview: undefined,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This is a legitimate workshop invitation. No suspicious links or payment requests. The context and format are appropriate for educational outreach.',
    points: 10,
  },
  {
    id: 'ig_e008',
    type: 'instagram',
    difficulty: 'Easy',
    manipulation_tags: ['authority', 'reward'],
    content: {
      username: 'bluebadge.verification',
      display_name: 'Verified Badge Team',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=verified',
      verified: true,
      dm_content: `Congratulations! 🎉

Your account has been selected for Instagram Verification.

To complete the verification process:
1. Click the link below
2. Submit required documents
3. Pay $50 processing fee

[Complete Verification]

Your blue badge will be active within 24 hours! ✅`,
      link_preview: {
        title: 'Instagram Verification',
        description: 'Complete your verification',
        image: '',
        url: 'instagram-verification-fee.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a verification scam. Instagram never charges for verification. The fee request and external link are major red flags.',
    points: 10,
  },

  // MEDIUM INSTAGRAM SCENARIOS (10)
  {
    id: 'ig_m001',
    type: 'instagram',
    difficulty: 'Medium',
    manipulation_tags: ['social_proof', 'reward', 'urgency'],
    content: {
      username: 'luxury.brand.partnerships',
      display_name: 'Luxury Brand Partnerships',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=luxury',
      verified: true,
      dm_content: `Hello! 👋

We represent Gucci, Prada, and Louis Vuitton for influencer partnerships.

Your aesthetic aligns with our luxury brands. We're offering:
• $2,000/month retainer
• Free products worth $5,000+
• Exclusive event invites

To apply, submit your media kit and pay a $100 application fee:
[Apply Now]

Only 5 spots left this quarter!`,
      link_preview: {
        title: 'Luxury Brand Partnership',
        description: 'Exclusive influencer program',
        image: '',
        url: 'luxury-brands-apply.com',
      },
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a sophisticated brand scam. Real luxury brands don\'t charge application fees. The verified badge may be fake or compromised.',
    points: 15,
  },
  {
    id: 'ig_m002',
    type: 'instagram',
    difficulty: 'Medium',
    manipulation_tags: ['curiosity', 'social_proof'],
    content: {
      username: 'tech.conference.2025',
      display_name: 'TechConf 2025',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=techconf',
      verified: true,
      dm_content: `Hi! 🚀

We're organizing TechConf 2025 in San Francisco and would love to have you as a speaker!

Conference details:
• Date: March 15-17, 2025
• Expected attendees: 5,000+
• Topics: AI, Web3, Cybersecurity

Speaker benefits:
• All-expenses-paid trip
• $1,000 honorarium
• Networking with industry leaders

Interested? Let us know!`,
      link_preview: undefined,
    },
    is_scam: false,
    correct_action: 'trust',
    explanation: 'This appears to be a legitimate conference invitation with specific details, professional benefits, and no suspicious requests. The verified account adds credibility.',
    points: 15,
  },
  {
    id: 'ig_m003',
    type: 'instagram',
    difficulty: 'Medium',
    manipulation_tags: ['authority', 'fear', 'urgency'],
    content: {
      username: 'meta.business.support',
      display_name: 'Meta Business Support',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=meta',
      verified: true,
      dm_content: `⚠️ URGENT: Ad Account Suspension ⚠️

Your Meta ad account has been flagged for policy violation.

Violation: Misleading content
Account Status: Suspended pending review

To restore your account immediately:
[Appeal Now]

Failure to appeal within 24 hours will result in permanent ban and loss of ad credits.

Meta Business Team`,
      link_preview: {
        title: 'Meta Business Appeal',
        description: 'Restore your ad account',
        image: '',
        url: 'meta-business-appeal.com',
      },
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a Meta business scam. Real policy violations are notified in Business Manager, not via DM. The external link and urgency are red flags.',
    points: 15,
  },
  {
    id: 'ig_m004',
    type: 'instagram',
    difficulty: 'Medium',
    manipulation_tags: ['reward', 'social_proof'],
    content: {
      username: 'travel.influencer.hub',
      display_name: 'Travel Influencer Hub',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=travel',
      verified: false,
      dm_content: `Hey travel lover! ✈️

We organize sponsored trips for content creators!

Upcoming trips:
• Bali (5 days, all-inclusive)
• Japan (7 days, $2,000 stipend)
• Iceland (4 days, Northern Lights)

Requirements:
• 10K+ followers
• Travel content focus
• $50 registration fee

[Register for Trips]

500+ creators have joined! 🌍`,
      link_preview: {
        title: 'Travel Influencer Hub',
        description: 'Sponsored trips for creators',
        image: '',
        url: 'travel-influencer-hub.com',
      },
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is a travel scam. Real sponsored trips don\'t require registration fees. The social proof (500+ creators) is likely fabricated.',
    points: 15,
  },
  {
    id: 'ig_m005',
    type: 'instagram',
    difficulty: 'Medium',
    manipulation_tags: ['curiosity', 'authority'],
    content: {
      username: 'grad.school.admissions',
      display_name: 'Graduate Admissions',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=gradschool',
      verified: true,
      dm_content: `Dear Prospective Student,

Your profile has been flagged for our accelerated Master's program in Computer Science.

Program highlights:
• 12-month completion
• $15,000 scholarship available
• 95% job placement rate

Next steps:
1. Submit application ($75 fee)
2. Schedule interview
3. Receive decision in 2 weeks

[Apply Now]`,
      link_preview: {
        title: 'Graduate Admissions',
        description: 'Apply for Fall 2025',
        image: '',
        url: 'grad-admissions-apply.edu',
      },
    },
    is_scam: true,
    correct_action: 'suspicious',
    explanation: 'This is an education scam. Real graduate programs use official application portals, not Instagram DMs. The external domain is suspicious.',
    points: 15,
  },

  // ADVANCED INSTAGRAM SCENARIOS (7)
  {
    id: 'ig_a001',
    type: 'instagram',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'social_proof', 'reward'],
    content: {
      username: 'netflix.casting.official',
      display_name: 'Netflix Casting Official',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=netflix',
      verified: true,
      dm_content: `🎬 CASTING CALL 🎬

Netflix is casting for a new reality series!

Show concept: "Tech Entrepreneurs" - following startup founders
Compensation: $5,000/episode + exposure
Requirements: Active social media, compelling story

To audition:
1. Submit 2-minute video intro
2. Pay $200 processing fee
3. Attend virtual callback

[Submit Audition]

Previous participants gained 100K+ followers! 📈`,
      link_preview: {
        title: 'Netflix Casting',
        description: 'Submit your audition',
        image: '',
        url: 'netflix-casting-submit.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a casting scam. Netflix never charges audition fees. The verified badge may be fake. Real casting is done through official channels.',
    points: 20,
  },
  {
    id: 'ig_a002',
    type: 'instagram',
    difficulty: 'Advanced',
    manipulation_tags: ['urgency', 'fear', 'authority'],
    content: {
      username: 'irs.tax.enforcement',
      display_name: 'IRS Tax Enforcement',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=irs',
      verified: true,
      dm_content: `⚠️ FINAL NOTICE ⚠️

Tax ID: ***-**-7843
Amount Due: $4,247.00
Penalty: $1,500.00
Total: $5,747.00

Your account has been flagged for tax evasion. Warrant for arrest will be issued in 48 hours unless payment is received.

[Pay Now]

This is your final opportunity to resolve this matter before legal action.

IRS Enforcement Division`,
      link_preview: {
        title: 'IRS Payment Portal',
        description: 'Resolve tax debt',
        image: '',
        url: 'irs-payment-portal.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a tax enforcement scam. The IRS never contacts taxpayers via Instagram DM. The arrest threat and payment link are classic scare tactics.',
    points: 20,
  },
  {
    id: 'ig_a003',
    type: 'instagram',
    difficulty: 'Advanced',
    manipulation_tags: ['social_proof', 'curiosity', 'reward'],
    content: {
      username: 'nft.collection.official',
      display_name: 'Bored Ape Yacht Club',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=bayc',
      verified: true,
      dm_content: `🦍 EXCLUSIVE MINT 🦍

BAYC is releasing a limited edition collection!

Mint details:
• Supply: 500 NFTs
• Price: 0.5 ETH
• Perks: Yacht party invite + merch

Whitelist spot reserved for you! ⏰ 2 hours to mint

[Mint Now]

Previous BAYC NFTs sold for 100+ ETH! 📈`,
      link_preview: {
        title: 'BAYC Mint',
        description: 'Exclusive NFT drop',
        image: '',
        url: 'bayc-mint-exclusive.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is an NFT scam. The verified badge is fake. Real BAYC announcements are on official channels. The external mint site is a wallet drainer.',
    points: 20,
  },
  {
    id: 'ig_a004',
    type: 'instagram',
    difficulty: 'Advanced',
    manipulation_tags: ['authority', 'social_proof', 'urgency'],
    content: {
      username: 'forbes.30under30',
      display_name: 'Forbes 30 Under 30',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=forbes',
      verified: true,
      dm_content: `🏆 CONGRATULATIONS! 🏆

You've been nominated for Forbes 30 Under 30!

Your achievements in tech have caught our attention. Final selection requires:

1. Complete nomination form
2. Submit $500 processing fee
3. Provide 3 references

[Complete Nomination]

Previous honorees include Mark Zuckerberg and Elizabeth Holmes.

Deadline: 48 hours`,
      link_preview: {
        title: 'Forbes 30 Under 30',
        description: 'Complete your nomination',
        image: '',
        url: 'forbes-30under30-nominate.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a prestige scam. Forbes never charges nomination fees. The fake verified badge and external link are designed to extract money from ambitious professionals.',
    points: 20,
  },
  {
    id: 'ig_a005',
    type: 'instagram',
    difficulty: 'Advanced',
    manipulation_tags: ['curiosity', 'fear', 'social_proof'],
    content: {
      username: 'deepfake.detection.ai',
      display_name: 'DeepFake Detection AI',
      profile_image: 'https://api.dicebear.com/7.x/identicon/svg?seed=deepfake',
      verified: false,
      dm_content: `😱 ALERT: DeepFake Found 😱

Our AI detected a synthetic video featuring you circulating online.

Video analysis:
• 89% confidence it's AI-generated
• 50K+ views already
• Shared by 200+ accounts

View and report the video before it spreads further:
[View Video Report]

Protect your reputation now!`,
      link_preview: {
        title: 'DeepFake Report',
        description: 'View detected content',
        image: '',
        url: 'deepfake-report-view.com',
      },
    },
    is_scam: true,
    correct_action: 'report',
    explanation: 'This is a deepfake scare scam. The urgency and fear tactics are designed to make victims click malicious links. No legitimate service operates this way.',
    points: 20,
  },
];

// ============================================
// EXPORT ALL SCENARIOS
// ============================================

export const allScenarios: Scenario[] = [
  ...emailScenarios,
  ...whatsappScenarios,
  ...instagramScenarios,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getScenariosByType(type: 'email' | 'whatsapp' | 'instagram'): Scenario[] {
  return allScenarios.filter(s => s.type === type);
}

export function getScenariosByDifficulty(difficulty: 'Easy' | 'Medium' | 'Advanced' | 'Adaptive'): Scenario[] {
  return allScenarios.filter(s => s.difficulty === difficulty);
}

export function getRandomScenarios(count: number = 5): Scenario[] {
  const shuffled = [...allScenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMixedScenarios(count: number = 5, difficulty?: 'Easy' | 'Medium' | 'Enterprise'): Scenario[] {
  let pool = allScenarios;

  if (difficulty) {
    const mappedDiff = difficulty === 'Enterprise' ? 'Advanced' : difficulty;
    pool = pool.filter(s => s.difficulty === mappedDiff);
  }

  // Ensure at least one of each type if possible
  const email = pool.find(s => s.type === 'email');
  const whatsapp = pool.find(s => s.type === 'whatsapp');
  const instagram = pool.find(s => s.type === 'instagram');

  const baseScenarios = [email, whatsapp, instagram].filter(Boolean) as Scenario[];
  const remaining = pool.filter(s => !baseScenarios.find(b => b.id === s.id));
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);

  return [...baseScenarios, ...shuffled].slice(0, count);
}

export function getScenariosByTags(tags: string[]): Scenario[] {
  return allScenarios.filter(s =>
    tags.some(tag => s.manipulation_tags.includes(tag as any))
  );
}

export function getScenariosForAdaptive(performance: number): Scenario[] {
  // Return scenarios based on user performance
  if (performance >= 80) {
    return getScenariosByDifficulty('Advanced');
  } else if (performance >= 50) {
    return getScenariosByDifficulty('Medium');
  }
  return getScenariosByDifficulty('Easy');
}

// ============================================
// STATISTICS
// ============================================

export const scenarioStats = {
  total: allScenarios.length,
  byType: {
    email: allScenarios.filter(s => s.type === 'email').length,
    whatsapp: allScenarios.filter(s => s.type === 'whatsapp').length,
    instagram: allScenarios.filter(s => s.type === 'instagram').length,
  },
  byDifficulty: {
    Easy: allScenarios.filter(s => s.difficulty === 'Easy').length,
    Medium: allScenarios.filter(s => s.difficulty === 'Medium').length,
    Advanced: allScenarios.filter(s => s.difficulty === 'Advanced').length,
    Adaptive: 0,
  },
  byManipulationTag: {
    urgency: allScenarios.filter(s => s.manipulation_tags.includes('urgency')).length,
    authority: allScenarios.filter(s => s.manipulation_tags.includes('authority')).length,
    reward: allScenarios.filter(s => s.manipulation_tags.includes('reward')).length,
    fear: allScenarios.filter(s => s.manipulation_tags.includes('fear')).length,
    curiosity: allScenarios.filter(s => s.manipulation_tags.includes('curiosity')).length,
    social_proof: allScenarios.filter(s => s.manipulation_tags.includes('social_proof')).length,
  },
};

// Log stats on load
console.log('📊 Human Firewall Scenarios Database Loaded:');
console.log(`   Total: ${scenarioStats.total} scenarios`);
console.log(`   Email: ${scenarioStats.byType.email}, WhatsApp: ${scenarioStats.byType.whatsapp}, Instagram: ${scenarioStats.byType.instagram}`);
