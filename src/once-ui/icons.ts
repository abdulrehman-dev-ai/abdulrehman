import { IconType } from "react-icons";

import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiArrowUpRight,
  HiOutlineArrowPath,
  HiCheck,
  HiMiniQuestionMarkCircle,
  HiMiniXMark,
  HiOutlineLink,
  HiExclamationTriangle,
  HiInformationCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiMiniGlobeAsiaAustralia,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiClipboard,
  HiArrowRight,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiShieldCheck,
  HiCodeBracket,
  HiCommandLine,
  HiChartBar,
  HiServerStack,
  HiPhoto,
  HiDocumentText,
  HiChartPie,
  HiUserGroup,
  HiComputerDesktop,
  HiWrench,
  HiClipboardDocument,
} from "react-icons/hi2";

import {
  PiHouseDuotone,
  PiUserCircleDuotone,
  PiGridFourDuotone,
  PiBookBookmarkDuotone,
  PiImageDuotone,
} from "react-icons/pi";

import { 
  FaDiscord, 
  FaGithub, 
  FaLinkedin, 
  FaXTwitter, 
  FaFacebook, 
  FaInstagram 
} from "react-icons/fa6";

type IconLibraryType = {
  [key: string]: IconType | string;
};

export const iconLibrary: IconLibraryType = {
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  refresh: HiOutlineArrowPath,
  arrowUpRight: HiArrowUpRight,
  check: HiCheck,
  arrowRight: HiArrowRight,
  helpCircle: HiMiniQuestionMarkCircle,
  infoCircle: HiInformationCircle,
  warningTriangle: HiExclamationTriangle,
  errorCircle: HiExclamationCircle,
  checkCircle: HiCheckCircle,
  email: HiEnvelope,
  globe: HiMiniGlobeAsiaAustralia,
  calendar: HiCalendarDays,
  close: HiMiniXMark,
  openLink: HiOutlineLink,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  
  // Social icons
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  instagram: FaInstagram,
  discord: FaDiscord,
  x: FaXTwitter,

  // Navigation icons
  home: PiHouseDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  person: PiUserCircleDuotone,
  gallery: PiImageDuotone,

  // Skill section icons
  skillShield: HiShieldCheck,
  skillCode: HiCodeBracket,
  skillTerminal: HiCommandLine,
  skillServer: HiServerStack,
  skillDesign: HiPhoto,
  skillDoc: HiDocumentText,
  skillAnalytics: HiChartPie,
  skillTeam: HiUserGroup,
  skillTools: HiWrench,
  
  // Action icons
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  
  // Tech Stack icons
  vscode: "/images/icons/vscode.png",
  flutter: "/images/icons/flutter.png",
  react: "/images/icons/react.png",
  cpp: "/images/icons/cpp.png",
  java: "/images/icons/java.png",
  ai: "/images/icons/ai.png",
};
