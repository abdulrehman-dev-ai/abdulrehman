import { InlineCode } from "@/once-ui/components";
// import { Certificate } from "crypto"; <- Remove this line
import { display } from "./config";
import { title } from "process";

const person = {
  firstName: "Abdul",
  lastName: "Rehman",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: <span style={{ fontSize: "0.7em" }}>Software Engineer | Cyber Security Researcher</span>,
  avatar: "/images/avatar.png", 
  displayLocation: "Pakistan/Lahore", // Changed from .jpg to .png
  location: "Pakistan/Lahore", // Updated to show only Pakistan/Lahore
  languages: ["English", "Urdu",],
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I write about software development best practices, emerging technologies, and share insights on
      building scalable and maintainable applications. My focus is on full-stack development and
      modern software architecture.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/abdulrehman-dev-ai",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/abdulrehmansarwar",
  },
  {
    name: "Facebook",
    icon: "facebook", // Make sure this matches exactly with the icon name in icons.ts
    link: "https://web.facebook.com/abdulrehman.bit",
  },
  {
    name: "Instagram",
    icon: "instagram", // Make sure this matches exactly with the icon name in icons.ts
    link: "https://instagram.com/abdulrehman.bit",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:iamabdulrehman.technophile@gmail.com",
  },
  {
    name: "Fiverr",
    icon: "fiverr",
    link: "https://www.fiverr.com/tenacious_pro", // replace with your Fiverr profile
  },
  {
    name: "Upwork",
    icon: "upwork",
    link: "https://www.upwork.com/freelancers/~015f955fbbf0997968?mp_source=share", // replace with your Upwork profile
  },
];

const home = {
  label: "Home",
  title: `${person.name}`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Abdul Rehman</>,
  subline: (
    <>
      "Software engineering is not just about writing code; it's about solving problems
      <br /> and creating solutions that make a difference in people's lives."
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://wa.link/zp9qa7",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
      <p style={{ textAlign: "justify" }}>
        I am a results-driven <strong>Cyber Security Researcher</strong> and <strong>AI assisted Software Engineer</strong> specialized in <strong>AI Red Team Engineer</strong> passionate about building secure, intelligent, and scalable digital solutions. I combines <strong>AI-driven automation</strong> with <strong>offensives ecurity methodologies</strong>, <strong>vulnerability assessment</strong>, to identify, exploit, and mitigate vulnerabilities before real adversaries can. With hands-on experience across <strong>AI assisted Web App development</strong>, I contributed to organizations like <strong>Trillium Information Security Systems</strong>, <strong>Nexium</strong>, and <strong>Rayonix Solutions</strong>. My expertise extends to <strong>penetration testing, threat intelligence, AI-enhanced automation,</strong> and <strong>secure web architectures</strong>. Driven by curiosity and innovation, he strives to bridge the gap between <strong>software engineering</strong> and <strong>cybersecurity</strong> ensuring that technology is not only smart but also safe.
      </p>
    </>
    ),
  },
  techStack: {
    display: true,
    icons: [
      {
        icon: "/images/icons/linux.ico"
      },
      {
        icon: "/images/icons/vscode.ico"
      },
      {
        icon: "/images/icons/c++.ico"
      },
      // Java icon removed per request
      {
        icon: "/images/icons/react.ico"
      },
      {
        icon: "/images/icons/flutter.ico"
      },
      {
        icon: "/images/icons/firebase.ico"
      },
      {
        icon: "/images/icons/copoilet.ico"
      },
    ],
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      // experience 1
{
  company: "Rayonix Solutions",
  timeframe: "Aug-Sep, 2025 (Summer Internship-Remote)",
  role: "Cyber Security Intern (Vulnerability Assessment & Penetration Testing)",
  achievements: [
    <span key="rayonix-achievement-1">
      Conducted comprehensive vulnerability assessments and penetration testing on live web applications and corporate networks.
    </span>,
    <span key="rayonix-achievement-2">
      Utilized tools such as Nmap, Burp Suite, and Metasploit to identify, exploit, and document critical security vulnerabilities.
    </span>,
    <span key="rayonix-achievement-3">
      Assisted in creating automated security testing scripts and reports using Python and Bash for improved workflow efficiency.
    </span>,
    <span key="rayonix-achievement-4">
      Collaborated with senior engineers to perform AI-assisted threat detection and strengthen red team methodologies.
    </span>,
  ],
  images: [
    // optional: add relevant screenshots or project visuals here
    // Example:
    // {
    //   src: "/images/projects/rayonix-security-dashboard.png",
    //   alt: "Rayonix Solutions VAPT Project",
    //   width: 16,
    //   height: 9,
    // },
  ],
},

      // experience 1
{
  company: "ACM-UET Lahore",
  timeframe: "July-Sep, 2025 (Fellowship Program-Remote)",
  role: "Mobile App Development (Flutter)",
  achievements: [
    <span key="acm-achievement-1">
      Selected for a competitive fellowship program focused on hands-on mobile app development using Flutter.
    </span>,
    <span key="acm-achievement-2">
      Gained experience designing cross-platform UI, managing state, and integrating REST APIs.
    </span>,
    <span key="acm-achievement-3">
      Collaborated with peers and mentors to build functional mobile prototypes aimed at solving real-world use cases.
    </span>,
  ],
  images: [
    // optional: add your screenshots here
    // Example:
    // {
    //   src: "/images/projects/acm-uet-lahore-project.png",
    //   alt: "ACM-UET Lahore Fellowship Project",
    //   width: 16,
    //   height: 9,
    // },
  ],
}, 
      // experience 2
{
  company: "Nexium",
  timeframe: "June-Aug, 2025 (Summer Internship-Remote)",
  role: "AI Enhanced Web App Development Intern",
  achievements: [
    <span key="nexium-achievement-1">
      Collaborating on AI-integrated web applications with a focus on innovative UX and smart automation features.
    </span>,
    <span key="nexium-achievement-2">
      Learning to leverage AI APIs and tools to enhance user experience and business workflows.
    </span>,
    <span key="nexium-achievement-3">
      Working under mentorship to follow best practices in modern web development, component-based design, and performance optimization.
    </span>,
  ],
  images: [
    // optional: add your screenshots here
    // Example:
    // {
    //   src: "/images/projects/nexium-project.png",
    //   alt: "Nexium Internship Project",
    //   width: 16,
    //   height: 9,
    // },
  ],
},
      //experience 3
     {
  company: "HiSkyTech",
  timeframe: "June-Aug, 2025 (Summer Internship-Remote)",
  role: "MERN Stack Developer Intern",
  achievements: [
    <span key="hiskytech-achievement-1">
      Currently building a full-stack SaaS Freelancing Marketplace as part of a remote internship project.
    </span>,
    <span key="hiskytech-achievement-2">
      Working on core modules such as authentication with role-based access, job posting and bidding system, task tracking, chat messaging, and feedback/rating features.
    </span>,
    <span key="hiskytech-achievement-3">
      Practicing modular MERN architecture using MongoDB, Express.js, React.js, and Node.js to deliver a production-ready application.
    </span>,
  ],
  images: [
    // optional: add your screenshots here
    // Example:
    // {
    //   src: "/images/projects/hiskytech-project.png",
    //   alt: "HiSkyTech Internship Project",
    //   width: 16,
    //   height: 9,
    // },
  ],
},
    //experience 4
      {
        company: "Auto Levels Pvt.Ltd",
        timeframe: "2022 - 2025 (Onsite)",
        role: "IT Manager & CTO",
        achievements: [
          <span key="autolevels-achievement-1">
            Developed the Auto Levels portfolio website to showcase services and projects.
          </span>,
          <span key="autolevels-achievement-2">
            Currently developing an expense/accounts management system for Auto Levels to streamline financial tracking.
          </span>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.png",
            alt: "Autolevels.pk Project",
            width: 16,
            height: 9,
          },
        ],
      },
    
    // experience 4
{
  company: "Digital Pakistan – Cybersecurity Hackathon 2024",
  timeframe: "2024 (Multiple Rounds & Workshops)",
  role: "Participant – Hands-on Cybersecurity Training & CTF",
  achievements: [
    <span key="cyberhackathon-achievement-1">
      Participated in national-level hackathon program organized by Ignite, with hands-on CTF competitions, blue teaming challenges, and real-world cybersecurity scenarios.
    </span>,
    <span key="cyberhackathon-achievement-2">
      Completed <strong>Basic Cybersecurity Workshop (Sep 27–29, 2024)</strong> at University of Central Punjab, Lahore — focusing on practical vulnerability analysis, incident response, and Linux security.
    </span>,
    <span key="cyberhackathon-achievement-3">
      Attended <strong>Advanced Cybersecurity Workshop (Oct 19–20, 2024)</strong> at Bahria University, Karachi — advanced topics in network defense, threat hunting, and exploit mitigation.
    </span>,
    <span key="cyberhackathon-achievement-4">
      Successfully qualified for the pre-qualifying round as <strong>Team Lead of St0rm Reapers</strong>, solving CTF challenges and blue teaming tasks in timed online competition.
    </span>,
    <span key="cyberhackathon-achievement-5">
      Gained experience in solving real-world simulated attacks while collaborating with national-level participants, improving analytical and teamwork skills in high-pressure environments.
    </span>,
  ],
  images: [
    // optional: add your screenshots here
    // Example:
    // {
    //   src: "/images/projects/cyberhackathon2024.png",
    //   alt: "Digital Pakistan Cybersecurity Hackathon 2024",
    //   width: 16,
    //   height: 9,
    // },
  ],
},
      //experience 6
      {
        company: "Youth Impact",
        timeframe: "2022 - 2024",
        role: "Alumni | Chapter Coordinator, 2IC Marketing & Graphics Head",
        achievements: [
          <span key="youthimpact-achievement-1">
            Spearheaded the design and execution of impactful marketing strategies, overseeing the creation of
            promotional materials to effectively communicate Youth Impact's mission and engage with target audiences.
          </span>,
          <span key="youthimpact-achievement-2">
            Led the marketing and graphics team as the 2IC Marketing & Graphics Head, ensuring the delivery of high-quality
            design work and maintaining brand consistency across all digital and print materials.
          </span>,
          <span key="youthimpact-achievement-3">
            As Chapter Coordinator, managed local chapter operations, organized community events, and facilitated educational
            workshops to support the personal and professional development of youth in the community.
          </span>,
          <span key="youthimpact-achievement-4">
            Mentored new members by providing guidance, sharing experiences, and helping them integrate into the organization
            while fostering a positive and growth-oriented environment.
          </span>,
        ],
        images: [
          {
            src: "/images/projects/project-01/youthimpact.png",
            alt: "Youth Impact Project",
            width: 16,
            height: 9,
          },
        ],
      },
      //experience 7
      {
        company: "Dar e Arqam Schools",
        timeframe: "2021",
        role: "Administrative Support Specialist",
        achievements: [
          <span key="darearqam-achievement-1">
            Managed the accounts of the fees section, ensuring accurate record-keeping and timely processing of fee payments.
          </span>,
          <span key="darearqam-achievement-2">
            Handled various office-related computer tasks, including data entry, maintaining digital records, and generating reports to support administrative operations.
          </span>,
          <span key="darearqam-achievement-3">
            Assisted in the smooth functioning of office systems by providing technical support and troubleshooting minor hardware/software issues.
          </span>,
          <span key="darearqam-achievement-4">
            Coordinated with the administrative team to streamline communication and improve the overall efficiency of office operations.
          </span>,
        ],
        images: [
        ]
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    //STUDIES SECTION
    title: "Studies",
    institutions: [
      {
        name: "Virtual University of Pakistan",
        description: <span key="study-vu">Studying Software Engineering.</span>,
      },
    ],
  },
  //TECHNICAL SKILLS SECTION
  technical: {
    display: true,
    certifications: [
      {
        title: "Cybersecurity Training Workshop - Digital Pakistan",
        href: "#",
        content: "View details",
        link: "https://drive.google.com/file/d/1pbDEGiXLVldfwmPKtjc48QHGsudC6taU/view?usp=drive_link",
        images: [
          {
            src: "/images/certificates/cybersecurity-workshop-2024.png",
            alt: "Cybersecurity Training Workshop Certificate and Hackathon by Ignite and TrilliumInfoSec",
            width: 24,
            height: 17,
          }
        ],
        description: [
          <span key="cyber-workshop-desc-1">Participated in intensive cybersecurity training workshop organized by Digital Pakistan</span>,
          <span key="cyber-workshop-desc-2">Gained hands-on experience with latest cybersecurity tools and techniques</span>,
          <span key="cyber-workshop-desc-3">Learned about emerging cyber threats and defense strategies</span>,
          <span key="cyber-workshop-desc-4">Enhanced practical skills in cybersecurity through workshop exercises</span>,
          <span key="cyber-workshop-desc-5">Networked with industry professionals and cybersecurity experts</span>
        ],
      },
      {
        title: "Ethical Hacker License by CISCO",
        href: "#",
        content: "View details",
        link: "https://www.credly.com/badges/d9af35bf-fbd6-4c20-939c-e777359cf7ae/linked_in_profile",
        images: [
          {
            src: "/images/certificates/ethicalhackercisco.png",
            alt: "Ethical Hacker by CISCO",
            width: 11,
            height: 11,
          },
          {
            src: "/images/certificates/ethicalhacker.png",
            alt: "Ethical Hacker by CISCO",
            width: 16,
            height: 11,
          }
        ],
        description: [
          <span key="cisco-desc-1">Completed CISCO's comprehensive ethical hacking certification program</span>,
          <span key="cisco-desc-2">Mastered network security fundamentals and penetration testing techniques</span>,
          <span key="cisco-desc-3">Learned vulnerability assessment and exploitation methodologies</span>,
          <span key="cisco-desc-4">Gained hands-on experience with industry-standard security tools</span>,
          <span key="cisco-desc-5">Developed skills in identifying and mitigating cyber security threats</span>
        ],
      },
      {
        title: "Ethical Hacking Esssentials by EC-Council",
        href: "#",
        content: "View details",
        link: "https://codered.eccouncil.org/certificate/b95e9fe9-3ade-4ccf-96c3-260d71cd2322?logged=",
        images: [
          {
            src: "/images/certificates/ehe_council.png",
            alt: "Ethical Hacker by EC-Council",
            width: 17,
            height: 11,
          }
        ],
        description: [
          <span key="eccouncil-desc-1">Completed EC-Council's Essential Ethical Hacking (EHE) certification program</span>,
          <span key="eccouncil-desc-2">Mastered fundamental cybersecurity concepts and methodologies</span>,
          <span key="eccouncil-desc-3">Learned about common attack vectors and defense strategies</span>,
          <span key="eccouncil-desc-4">Gained practical experience with security assessment tools</span>,
          <span key="eccouncil-desc-5">Developed skills in identifying and analyzing security vulnerabilities</span>
        ],
      },
      {
        title: "Foundations of Cybersecurity",
        href: "#",
        content: "View details",
        link: "https://coursera.org/share/d1e1e0fb01dc703700f0cb380c815435",
        images: [
          {
            src: "/images/certificates/foundationsofcybersec.png",
            alt: "foundationsofcybersecurity",
            width: 22,
            height: 17,
          }
        ],
        description: [
          <span key="google-desc-1">Completed Google's Foundations of Cybersecurity certification program</span>,
          <span key="google-desc-2">Learned core cybersecurity concepts and terminology</span>,
          <span key="google-desc-3">Gained understanding of security frameworks and compliance standards</span>,
          <span key="google-desc-4">Studied common cyber threats, attacks, and defense mechanisms</span>,
          <span key="google-desc-5">Developed foundational knowledge in security tools and technologies</span>
        ],
      },
      {
        title: "Introduction to Dark Web, Anonymity and Cryptocurrency",
        href: "#",
        content: "View details",
        link: "https://codered.eccouncil.org/certificate/c8cc47fb-6875-4187-a62c-6f8c5acb598b?logged",
        images: [
          {
            src: "/images/certificates/darkweb.png",
            alt: "Dark Web Security Certificate",
            width: 17,
            height: 11,
          }
        ],
        description: [
          <span key="darkweb-desc-1">Mastered advanced concepts of dark web architecture, anonymity networks, and cryptocurrency fundamentals</span>,
          <span key="darkweb-desc-2">Developed expertise in secure communication protocols, encryption methods, and privacy-preserving technologies</span>,
          <span key="darkweb-desc-3">Gained comprehensive understanding of blockchain technology, cryptocurrency transactions, and digital forensics</span>,
          <span key="darkweb-desc-4">Learned advanced threat intelligence gathering techniques and dark web monitoring methodologies</span>,
          <span key="darkweb-desc-5">Acquired skills in implementing security measures for anonymous networks and cryptocurrency transactions</span>
        ],
      },
      {
        title: "Ethical Hacking by Hacking Real Websites Legally",
        href: "#",
        content: "View details",
        link: "https://codered.eccouncil.org/certificate/77f7f070-93aa-420f-b187-7ccd69f27f0b?logged=false",
        images: [
          {
            src: "/images/certificates/ehbyhackingrealwebsites.png",
            alt: "Ethical Hacking Real Websites Certificate", 
            width: 17,
            height: 11,
          }
        ],
        description: [
          <span key="realweb-desc-1">Conducted hands-on penetration testing on real-world websites under legal frameworks and ethical guidelines</span>,
          <span key="realweb-desc-2">Mastered advanced web application security testing methodologies including OWASP Top 10 vulnerabilities assessment</span>,
          <span key="realweb-desc-3">Developed expertise in identifying, analyzing, and exploiting web vulnerabilities using industry-standard tools and techniques</span>,
          <span key="realweb-desc-4">Implemented comprehensive security solutions including secure coding practices, vulnerability remediation, and defensive strategies</span>,
          <span key="realweb-desc-5">Gained practical experience in responsible disclosure and documentation of security findings to stakeholders</span>
        ],
      },
      {
        title: "Linux Commands & Shell Scripting",
        href: "#",
        content: "View details",
        link: "https://coursera.org/share/6f85c42a0582b2be79cd7f551932acaa",
        images: [
          {
            src: "/images/certificates/linuxcommands.png",
            alt: "Linux Commands Certificate",
            width: 22,
            height: 17,
          }
        ],
        description: [
          <span key="linux-desc-1">Mastered advanced Linux command line operations including text processing, networking tools, and system monitoring</span>,
          <span key="linux-desc-2">Developed expertise in system administration tasks including user management, package installation, and service configuration</span>,
          <span key="linux-desc-3">Created complex shell scripts for process automation, backup solutions, and system maintenance tasks</span>,
          <span key="linux-desc-4">Implemented robust security practices including access control, file permissions, and security auditing</span>,
          <span key="linux-desc-5">Gained proficiency in bash scripting fundamentals, regular expressions, and advanced pipeline operations</span>
        ],
      },
      {
        title: "OWASP Top 10 for Docker Containers and Kubernetes Security",
        href: "#",
        content: "View details",
        link: "https://codered.eccouncil.org/certificate/1238dc13-907b-4a16-a22d-8fb10e940e0c?logged=",
        images: [
          {
            src: "/images/certificates/owasptop10.png",
            alt: "OWASP Top 10 Certificate",
            width: 17,
            height: 11,
          }
        ],
        description: [
          <span key="owasp-desc-1">Mastered container security fundamentals and OWASP Top 10 vulnerabilities for containerized applications</span>,
          <span key="owasp-desc-2">Gained expertise in securing Docker containers and Kubernetes clusters against common attack vectors</span>,
          <span key="owasp-desc-3">Implemented security best practices for container orchestration and deployment pipelines</span>,
          <span key="owasp-desc-4">Developed skills in container vulnerability scanning, runtime security, and compliance monitoring</span>,
          <span key="owasp-desc-5">Learned advanced techniques for securing microservices architecture and container networking</span>
        ],
      },
      {
        title: "NDG Linux Unhatched",
        href: "#",
        content: "View details",
        link: "https://www.netacad.com/certificates?issuanceId=4b75c911-b0f7-4abd-851f-b897f290f679",
        images: [
          {
            src: "/images/certificates/NDG_Linux_Unhatched.png",
            alt: "NDG Linux Unhatched Certificate",
            width: 22,
            height: 17,
          }
        ],
        description: [
          <span key="ndg-linux-desc-1">Completed comprehensive Linux fundamentals training through Cisco's Network Development Group</span>,
          <span key="ndg-linux-desc-2">Mastered basic Linux system administration and command-line operations</span>,
          <span key="ndg-linux-desc-3">Learned essential file system management and user administration concepts</span>,
          <span key="ndg-linux-desc-4">Developed practical skills in Linux networking and security fundamentals</span>,
          <span key="ndg-linux-desc-5">Gained hands-on experience with Linux package management and system configuration</span>
        ],
      },
      // play it safe
      {
        title: "Play It Safe: Manage Security Risks by Google",
        href: "#",
        content: "View details",
        link: "https://coursera.org/share/dbc74ea619688690190c348a460b15ba",
        images: [
          {
            src: "/images/certificates/PlayItSafeManageSecurityRisksbygoogle.png",
            alt: "Google Security Risks Management Certificate",
            width: 22,
            height: 17,
          }
        ],
        description: [
          <span key="google-security-desc-1">Completed Google's comprehensive security risk management program</span>,
          <span key="google-security-desc-2">Mastered risk assessment methodologies and security frameworks</span>,
          <span key="google-security-desc-3">Learned strategies for identifying, analyzing, and mitigating security threats</span>,
          <span key="google-security-desc-4">Developed skills in security incident response and risk documentation</span>,
          <span key="google-security-desc-5">Gained expertise in implementing security controls and compliance measures</span>
        ],
      },
      {
        title: "CCNA: Enterprise Networking, Security and Automation",
        href: "#",
        content: "View details",
        link: "https://www.credly.com/badges/4f1685b3-b745-48ee-92ff-e97772c0accd",
        images: [
          {
            src: "/images/certificates/ccna-enterprise.png",
            alt: "CCNA Enterprise Certification Badge",
            width: 11,
            height: 11,
          },
          {
            src: "/images/certificates/ccna-enterprise-cert.png", 
            alt: "CCNA Enterprise Certificate",
            width: 16,
            height: 11,
          }
        ],
        description: [
          <span key="ccna-desc-1">Successfully completed Cisco's industry-leading CCNA Enterprise certification program, demonstrating comprehensive networking expertise</span>,
          <span key="ccna-desc-2">Mastered advanced enterprise networking concepts including SDN, network virtualization, and QoS implementation</span>,
          <span key="ccna-desc-3">Developed deep expertise in network security protocols, automation frameworks, and modern programmability techniques</span>,
          <span key="ccna-desc-4">Acquired hands-on experience in designing, implementing, and troubleshooting complex enterprise network infrastructures</span>,
          <span key="ccna-desc-5">Demonstrated proficiency in network architecture design, security policy implementation, and cutting-edge automation solutions</span>
        ],
      }
    ],
    skills: [
      {
        title: "Cybersecurity & Hacking",
        icon: "skillShield",
        description: [
          <span key="cyber-1">Ethical Hacking: Penetration Testing, Vulnerability Assessment, Metasploit Framework</span>,
          <span key="cyber-2">OWASP Top 10, Cyber Threat Hunting (CTH), Cyber Threat Intelligence (CTI)</span>,
          <span key="cyber-3">Network Security: CCNA, Network Administration, Packet Analysis</span>,
          <span key="cyber-4">System Security: Information Security Management, Security Policies, Risk Management</span>,
          <span key="cyber-5">Dark Web & Anonymity: Cryptocurrency, Blockchain, Tor Network</span>
        ],
      },
      {
        title: "Programming & Development",
        icon: "skillCode",
        description: [
          <span key="prog-1">Languages: C++, Java, Dart, PHP, Bash/Shell Scripting, HTML/CSS</span>,
          <span key="prog-2">Frameworks: Flutter, Laravel, Linux CLI</span>,
          <span key="prog-3">Version Control: Git & GitHub</span>,
          <span key="prog-4">Databases: MySQL, SQLite, Database Normalization</span>
        ],
      },
      {
        title: "Systems & Tools",
        icon: "skillTerminal",
        description: [
          <span key="sys-1">Linux Ecosystem: Kali Linux, GNU/Linux, Ubuntu, Debian</span>,
          <span key="sys-2">Security Tools: Metasploit, Nmap, Wireshark, Burp Suite</span>,
          <span key="sys-3">Advanced Tools: John the Ripper, Hydra</span>
        ],
      },
      {
        title: "Project Management",
        icon: "skillDoc",
        description: [
          <span key="pm-1">Team Building & Management, Project Planning & Execution</span>,
          <span key="pm-2">Hackathon & CTF Team Leadership</span>,
          <span key="pm-3">Tools: Google Sheets, Budgeting, Agile Methodologies</span>,
          <span key="pm-4">Task Prioritization and Delegation</span>
        ],
      },
      {
        title: "IT Operations",
        icon: "skillServer",
        description: [
          <span key="it-1">System Administration & Technical Support</span>,
          <span key="it-2">Software Troubleshooting & Local Server Hosting</span>,
          <span key="it-3">Asset Tracking & Management</span>
        ],
      },
      {
        title: "Marketing & Design",
        icon: "skillDesign",
        description: [
          <span key="md-1">Digital Marketing: Campaign Planning, Content Strategy</span>,
          <span key="md-2">Design Tools: Canva, Adobe Photoshop (Basic)</span>,
          <span key="md-3">Media Production: Video Editing, Basic Photography</span>
        ],
      },
      {
        title: "Business Operations",
        icon: "skillDoc",
        description: [
          <span key="bo-1">Vehicle Booking & Customer Management</span>,
          <span key="bo-2">Deal Pricing & Invoicing System Design</span>,
          <span key="bo-3">Expense Management & Reconciliation</span>
        ],
      },
      {
        title: "Analytical Skills",
        icon: "skillAnalytics",
        description: [
          <span key="as-1">Data Analysis: Excel/Google Sheets, Report Generation</span>,
          <span key="as-2">Research & Documentation</span>,
          <span key="as-3">Certification Preparation & Academic Support</span>
        ],
      },
      {
        title: "Soft Skills",
        icon: "skillTeam",
        description: [
          <span key="ss-1">Leadership & Emotional Intelligence</span>,
          <span key="ss-2">Team Communication & Public Speaking</span>,
          <span key="ss-3">Languages: Urdu & English Proficiency</span>,
          <span key="ss-4">Conflict Resolution & Diplomacy</span>
        ],
      }
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
