INSERT INTO settings(id,data) VALUES ('profile','{"name": "Abdul Rehman", "role": "Cloud & Security Engineer \u00b7 Solution Architect", "headline": "Built to work.\nEngineered to last.", "intro": "I design secure cloud infrastructure and build practical web applications \u2014 from the first architecture decision to deployment and handover.", "email": "iamabdulrehman.technophile@gmail.com", "location": "Lahore, Pakistan \u00b7 Working worldwide", "fiverr": "https://www.fiverr.com/tenacious_pro", "github": "https://github.com/abdulrehman-dev-ai", "linkedin": "https://www.linkedin.com/in/abdulrehmansarwar", "availability": "Available for selected projects", "payment_instructions": ""}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('ocean-yacht-registration','projects','ocean-yacht-registration','Ocean Yacht Registration','A registration platform with customer workflows, a dealer portal and an administration workspace.','The brief
Bring yacht registration, partner applications and customer tracking into one consistent experience.

The implementation
Built registration forms, document upload flows, order references, email notifications and an admin workspace. Added a dealer application and approval workflow, partner access and distinct references for customers referred by dealers.

Engineering decisions
Used Cloudflare infrastructure and a database-backed workflow. Kept staging and production separate for testing and handover. Designed responsive layouts and transactional email templates around the same visual identity.

Delivery
Delivered the public site and partner portal. Future changes follow the staging, verification and production release process. No client records or internal credentials are included in this case study.','published','{"stage": "Delivered", "stack": "Cloudflare \u00b7 D1 \u00b7 Resend", "url": "https://oceanyachtregistration.com/", "image": ""}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('maqwi-organics','projects','maqwi-organics','Maqwi Organics','A Pakistani organic products storefront, built around real products and a manageable WooCommerce setup.','The brief
Build a distinctive organic products store for honey, desi ghee, achaar and itar, with a clear mobile shopping experience.

The implementation
Developing the storefront, product presentation, category navigation and branded WooCommerce pages. The project includes product variations, Pakistan-focused checkout and nationwide shipping configuration.

Working constraints
The store uses InfinityFree hosting. Source control and deployment safeguards help make updates repeatable within that environment.

Current stage
In development. Public ordering remains closed while product data, stock, delivery, email and end-to-end checkout are verified. This is an ongoing build, not a completed launch.','published','{"stage": "In progress", "stack": "WordPress \u00b7 WooCommerce \u00b7 InfinityFree", "url": "", "image": ""}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('auto-levels','projects','auto-levels','Auto Levels','A digital showroom for automotive modification services and completed work.','The brief
Give an automotive modification business a clear online home for its services and portfolio.

The implementation
Built a responsive website presenting the company, modification services, project photography and contact information. Organized the content so prospective customers can understand the offering before making an enquiry.

Outcome
Delivered the company website. The case study describes the scope delivered without claiming unmeasured conversion or traffic improvements.','published','{"stage": "Delivered", "stack": "Next.js \u00b7 Tailwind CSS \u00b7 Firebase", "url": "https://www.autolevels.pk/", "image": "/autolevels.webp"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('wordpress-cloud-recovery','projects','wordpress-cloud-recovery','WordPress migration & recovery','Restoring access, correcting redirects and moving a WordPress site to a clean server setup.','The situation
A WordPress client needed help with administrator access, redirects and SSL while moving to a new server.

The work
Configured Nginx, MariaDB and PHP on Vultr, migrated the site, corrected WordPress URLs with WP-CLI and configured certificates. Investigated Cloudflare redirect behavior and checked the mobile experience.

Delivery
Returned the working site to the client after migration and troubleshooting. Client identity, infrastructure addresses and vulnerability details are intentionally omitted.','published','{"stage": "Delivered", "stack": "Vultr \u00b7 Nginx \u00b7 MariaDB \u00b7 Cloudflare", "url": "", "image": ""}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('docker-containerization','services','docker-containerization','Docker Containerization','Containerize your application with a documented deployment workflow.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 18000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('linux-automation-scripting','services','linux-automation-scripting','Linux Automation & Scripting','Shell scripting and automation for recurring operational work.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 12000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('wordpress-website-development','services','wordpress-website-development','WordPress Website Development','Responsive WordPress websites, WooCommerce and practical content management.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 15000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('vulnerability-assessment-pentesting','services','vulnerability-assessment-pentesting','Vulnerability Assessment & Penetration Testing','An authorized assessment with clear findings and remediation guidance.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 35000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('full-stack-web-development','services','full-stack-web-development','Full-Stack Web Development','Custom web applications with maintainable interfaces and backend workflows.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 40000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('server-migration-administration','services','server-migration-administration','Server Migration & Administration','Planned server migration, Linux administration and troubleshooting.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 15000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('devops-cicd-pipeline','services','devops-cicd-pipeline','DevOps CI/CD Pipeline','Repeatable builds, release workflows and practical deployment automation.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 20000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('cloud-infrastructure-setup','services','cloud-infrastructure-setup','Cloud Infrastructure Setup','Cloud foundations, networking, access controls and deployment planning.','Scope, delivery schedule and final price are confirmed after reviewing your requirements.','published','{"price": 25000, "currency": "PKR"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('staging-before-production','posts','staging-before-production','Why I separate staging from production','A practical release workflow for small projects that still need dependable deployments.','A small project still needs a safe place to change.

I use staging to test the complete workflow before updating a working production site. That includes form validation, database changes, email delivery and the mobile interface.

A release checklist
Record the current version and take a database backup. Apply additive migrations first. Run the same user journeys on staging. Deploy the reviewed version, then check the public routes and server responses.

After release
Keep the previous version available for rollback and document any database change that cannot be reversed by a code rollback. A passing build is a starting point; the user workflow is the actual test.','draft','{"category": "Engineering notes"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('resume-tailor','projects','resume-tailor','Resume Tailor','A resume tailoring application developed during the Nexium internship.','Earlier work

A resume tailoring application developed during the Nexium internship.

This project remains part of the portfolio archive. See the linked project for its current availability.','published','{"stage": "Earlier work", "stack": "Next.js \u00b7 AI integration", "url": "https://nexium-resume-tailor-wine.vercel.app"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('quote-generator-nexium-internship','projects','quote-generator-nexium-internship','Quote Generator','A responsive quote generator built as a Nexium internship project.','Earlier work

A responsive quote generator built as a Nexium internship project.

This project remains part of the portfolio archive. See the linked project for its current availability.','published','{"stage": "Earlier work", "stack": "Web application \u00b7 Internship", "url": "https://nexium-abdul-rehman-ai-web-dev-quot.vercel.app/assignment-1"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('blog-summarzier-nexium-internship','projects','blog-summarzier-nexium-internship','Blog Summarizer','An internship project exploring AI-assisted blog summarization.','Earlier work

An internship project exploring AI-assisted blog summarization.

This project remains part of the portfolio archive. See the linked project for its current availability.','published','{"stage": "Earlier work", "stack": "AI integration \u00b7 Internship", "url": "https://nexium-abdul-rehman-blog-summarizer.vercel.app/"}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('simple-portfolio-builder','projects','simple-portfolio-builder','Simple Portfolio Builder','A tool for assembling a personal portfolio from structured information.','Earlier work

A tool for assembling a personal portfolio from structured information.

This project remains part of the portfolio archive. See the linked project for its current availability.','published','{"stage": "Earlier work", "stack": "Web application", "url": ""}');
INSERT INTO content(id,kind,slug,title,summary,body,status,data) VALUES ('ai-vs-core-skills-for-freshers','posts','ai-vs-core-skills-for-freshers','AI tools and core engineering skills','Thoughts on using AI assistance while building a solid foundation in software development.','The rise of AI tools like GitHub Copilot, ChatGPT, and other code generators has dramatically changed how software is built. For fresh graduates entering the world of software engineering, these tools can seem like magical shortcuts to getting the job done faster — or even avoiding deep learning entirely.

But is it wise to totally rely on AI and vibe coding? Let''s break it down.

🚀 What is "Vibe Coding"?

"Vibe coding" is the practice of writing code based on intuition, vibes, or copying from Stack Overflow, without truly understanding the logic. It may feel productive — but it''s like building a house on sand.

💡 How AI Can Help

AI can be an amazing productivity enhancer when used correctly:
- Speed: AI tools can autocomplete functions, find bugs, and generate boilerplate code quickly.
- Learning Aid: They''re great for exploring new syntax or concepts when you''re stuck.
- Experimentation: You can prototype features faster without spending hours Googling.

🚨 The Hidden Dangers

However, there are serious downsides to full dependence:
- No Foundation: If you skip the basics, you''ll struggle during interviews or debugging.
- Overconfidence: AI might generate code that works but has critical flaws — and you won’t spot them.
- Shallow Learning: You won’t build the muscle memory needed to grow as a real developer.

"The more you rely on AI for everything, the less you’ll grow as a creative problem solver."

🔍 A Better Approach: Assisted, Not Replaced

You should treat AI as an assistant, not a replacement for understanding. Here''s how:
- Use AI to review or suggest — not to think for you.
- Try solving the problem first, then check AI''s version.
- Keep a learning mindset: study the code you get from AI and ask *why* it works.

🎓 Advice for CS Fresh Graduates

- Master at least one programming language (JavaScript, Python, etc.)
- Understand data structures, algorithms, and system design
- Use AI tools to debug, learn, and explore — not to escape effort

✅ Final Thoughts

AI is not your enemy — it’s your sidekick. But relying only on AI and vibe coding will stunt your growth and confidence in the long run.

Be a developer who uses AI smartly, not one who hides behind it.

“Let AI boost your coding — not block your learning.”

---','published','{"category": "Engineering practice"}');
