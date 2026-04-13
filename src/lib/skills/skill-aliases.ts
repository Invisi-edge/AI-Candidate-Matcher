export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "cloud"
  | "devops"
  | "data-science"
  | "mobile"
  | "design"
  | "soft-skill"
  | "certification"
  | "language"
  | "testing"
  | "security"
  | "other";

export type SkillDefinition = {
  canonical: string;
  aliases: string[];
  category: SkillCategory;
};

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // Frontend (30+ skills)
  { canonical: "react", aliases: ["react", "react.js", "reactjs"], category: "frontend" },
  { canonical: "next.js", aliases: ["next.js", "nextjs", "next js", "next"], category: "frontend" },
  { canonical: "vue", aliases: ["vue", "vue.js", "vuejs", "vue 3"], category: "frontend" },
  { canonical: "nuxt", aliases: ["nuxt", "nuxt.js", "nuxtjs"], category: "frontend" },
  { canonical: "angular", aliases: ["angular", "angular.js", "angularjs", "angular 2+"], category: "frontend" },
  { canonical: "svelte", aliases: ["svelte", "svelte.js", "sveltekit"], category: "frontend" },
  { canonical: "javascript", aliases: ["javascript", "js", "ecmascript", "es6", "es2015+"], category: "frontend" },
  { canonical: "typescript", aliases: ["typescript", "ts"], category: "frontend" },
  { canonical: "html", aliases: ["html", "html5", "semantic html"], category: "frontend" },
  { canonical: "css", aliases: ["css", "css3", "cascading style sheets"], category: "frontend" },
  { canonical: "sass", aliases: ["sass", "scss", "less"], category: "frontend" },
  { canonical: "tailwind", aliases: ["tailwind", "tailwindcss", "tailwind css"], category: "frontend" },
  { canonical: "bootstrap", aliases: ["bootstrap", "bootstrap 5"], category: "frontend" },
  { canonical: "material ui", aliases: ["material ui", "mui", "material design"], category: "frontend" },
  { canonical: "chakra ui", aliases: ["chakra ui", "chakra"], category: "frontend" },
  { canonical: "styled-components", aliases: ["styled-components", "styled components", "css-in-js"], category: "frontend" },
  { canonical: "redux", aliases: ["redux", "redux toolkit", "rtk"], category: "frontend" },
  { canonical: "zustand", aliases: ["zustand"], category: "frontend" },
  { canonical: "mobx", aliases: ["mobx"], category: "frontend" },
  { canonical: "webpack", aliases: ["webpack"], category: "frontend" },
  { canonical: "vite", aliases: ["vite", "vitejs"], category: "frontend" },
  { canonical: "babel", aliases: ["babel", "babeljs"], category: "frontend" },
  { canonical: "jquery", aliases: ["jquery"], category: "frontend" },
  { canonical: "htmx", aliases: ["htmx"], category: "frontend" },
  { canonical: "astro", aliases: ["astro", "astro.js"], category: "frontend" },
  { canonical: "remix", aliases: ["remix", "remix.run"], category: "frontend" },
  { canonical: "gatsby", aliases: ["gatsby", "gatsby.js"], category: "frontend" },
  { canonical: "storybook", aliases: ["storybook"], category: "frontend" },
  { canonical: "web components", aliases: ["web components", "custom elements", "shadow dom"], category: "frontend" },
  { canonical: "pwa", aliases: ["pwa", "progressive web app", "progressive web apps"], category: "frontend" },

  // Backend (35+ skills)
  { canonical: "node.js", aliases: ["node.js", "nodejs", "node js", "node"], category: "backend" },
  { canonical: "express", aliases: ["express", "express.js", "expressjs"], category: "backend" },
  { canonical: "fastify", aliases: ["fastify"], category: "backend" },
  { canonical: "nestjs", aliases: ["nestjs", "nest.js", "nest"], category: "backend" },
  { canonical: "python", aliases: ["python", "python3"], category: "backend" },
  { canonical: "django", aliases: ["django", "django rest framework", "drf"], category: "backend" },
  { canonical: "flask", aliases: ["flask"], category: "backend" },
  { canonical: "fastapi", aliases: ["fastapi", "fast api"], category: "backend" },
  { canonical: "java", aliases: ["java", "java 8", "java 11", "java 17", "java 21"], category: "backend" },
  { canonical: "spring boot", aliases: ["spring boot", "spring", "spring framework", "springboot"], category: "backend" },
  { canonical: "kotlin", aliases: ["kotlin"], category: "backend" },
  { canonical: "go", aliases: ["go", "golang"], category: "backend" },
  { canonical: "gin", aliases: ["gin", "gin framework"], category: "backend" },
  { canonical: "rust", aliases: ["rust", "rustlang"], category: "backend" },
  { canonical: "actix", aliases: ["actix", "actix-web"], category: "backend" },
  { canonical: "c#", aliases: ["c#", "csharp", "c sharp"], category: "backend" },
  { canonical: ".net", aliases: [".net", "dotnet", ".net core", "asp.net"], category: "backend" },
  { canonical: "ruby", aliases: ["ruby"], category: "backend" },
  { canonical: "rails", aliases: ["rails", "ruby on rails", "ror"], category: "backend" },
  { canonical: "php", aliases: ["php", "php 8"], category: "backend" },
  { canonical: "laravel", aliases: ["laravel"], category: "backend" },
  { canonical: "symfony", aliases: ["symfony"], category: "backend" },
  { canonical: "elixir", aliases: ["elixir"], category: "backend" },
  { canonical: "phoenix", aliases: ["phoenix", "phoenix framework"], category: "backend" },
  { canonical: "scala", aliases: ["scala"], category: "backend" },
  { canonical: "graphql", aliases: ["graphql", "gql"], category: "backend" },
  { canonical: "rest api", aliases: ["rest api", "restful api", "rest", "api integration", "apis", "api development"], category: "backend" },
  { canonical: "grpc", aliases: ["grpc", "protobuf", "protocol buffers"], category: "backend" },
  { canonical: "websocket", aliases: ["websocket", "websockets", "socket.io", "ws"], category: "backend" },
  { canonical: "microservices", aliases: ["microservices", "micro-services", "microservice architecture"], category: "backend" },
  { canonical: "message queue", aliases: ["message queue", "rabbitmq", "kafka", "sqs", "message broker"], category: "backend" },
  { canonical: "redis", aliases: ["redis", "redis cache"], category: "backend" },
  { canonical: "memcached", aliases: ["memcached"], category: "backend" },
  { canonical: "oauth", aliases: ["oauth", "oauth2", "oauth 2.0", "openid connect", "oidc"], category: "backend" },
  { canonical: "jwt", aliases: ["jwt", "json web token", "json web tokens"], category: "backend" },

  // Databases (20+ skills)
  { canonical: "sql", aliases: ["sql", "structured query language"], category: "database" },
  { canonical: "postgresql", aliases: ["postgresql", "postgres", "psql"], category: "database" },
  { canonical: "mysql", aliases: ["mysql", "mariadb"], category: "database" },
  { canonical: "sql server", aliases: ["sql server", "mssql", "microsoft sql server"], category: "database" },
  { canonical: "oracle", aliases: ["oracle", "oracle db", "oracle database"], category: "database" },
  { canonical: "sqlite", aliases: ["sqlite", "sqlite3"], category: "database" },
  { canonical: "mongodb", aliases: ["mongodb", "mongo db", "mongo"], category: "database" },
  { canonical: "dynamodb", aliases: ["dynamodb", "dynamo db", "amazon dynamodb"], category: "database" },
  { canonical: "cassandra", aliases: ["cassandra", "apache cassandra"], category: "database" },
  { canonical: "couchdb", aliases: ["couchdb", "couch db"], category: "database" },
  { canonical: "firebase", aliases: ["firebase", "firestore", "firebase realtime database"], category: "database" },
  { canonical: "supabase", aliases: ["supabase"], category: "database" },
  { canonical: "elasticsearch", aliases: ["elasticsearch", "elastic search", "elk"], category: "database" },
  { canonical: "neo4j", aliases: ["neo4j", "graph database"], category: "database" },
  { canonical: "prisma", aliases: ["prisma", "prisma orm"], category: "database" },
  { canonical: "typeorm", aliases: ["typeorm"], category: "database" },
  { canonical: "sequelize", aliases: ["sequelize"], category: "database" },
  { canonical: "drizzle", aliases: ["drizzle", "drizzle orm"], category: "database" },
  { canonical: "mongoose", aliases: ["mongoose"], category: "database" },
  { canonical: "sqlalchemy", aliases: ["sqlalchemy", "sql alchemy"], category: "database" },
  { canonical: "clickhouse", aliases: ["clickhouse"], category: "database" },
  { canonical: "snowflake", aliases: ["snowflake"], category: "database" },

  // Cloud (25+ skills)
  { canonical: "aws", aliases: ["aws", "amazon web services"], category: "cloud" },
  { canonical: "ec2", aliases: ["ec2", "amazon ec2", "aws ec2"], category: "cloud" },
  { canonical: "s3", aliases: ["s3", "amazon s3", "aws s3"], category: "cloud" },
  { canonical: "lambda", aliases: ["lambda", "aws lambda", "serverless functions"], category: "cloud" },
  { canonical: "rds", aliases: ["rds", "amazon rds", "aws rds"], category: "cloud" },
  { canonical: "aurora", aliases: ["aurora", "amazon aurora", "aurora postgresql", "aurora mysql", "aurora serverless"], category: "cloud" },
  { canonical: "cloudformation", aliases: ["cloudformation", "aws cloudformation"], category: "cloud" },
  { canonical: "azure", aliases: ["azure", "microsoft azure"], category: "cloud" },
  { canonical: "azure functions", aliases: ["azure functions"], category: "cloud" },
  { canonical: "azure devops", aliases: ["azure devops", "ado"], category: "cloud" },
  { canonical: "gcp", aliases: ["gcp", "google cloud", "google cloud platform"], category: "cloud" },
  { canonical: "cloud run", aliases: ["cloud run", "google cloud run"], category: "cloud" },
  { canonical: "bigquery", aliases: ["bigquery", "google bigquery", "big query"], category: "cloud" },
  { canonical: "vercel", aliases: ["vercel"], category: "cloud" },
  { canonical: "netlify", aliases: ["netlify"], category: "cloud" },
  { canonical: "heroku", aliases: ["heroku"], category: "cloud" },
  { canonical: "digitalocean", aliases: ["digitalocean", "digital ocean"], category: "cloud" },
  { canonical: "cloudflare", aliases: ["cloudflare", "cloudflare workers"], category: "cloud" },
  { canonical: "cdn", aliases: ["cdn", "content delivery network"], category: "cloud" },
  { canonical: "serverless", aliases: ["serverless", "serverless architecture", "faas"], category: "cloud" },
  { canonical: "cloud architecture", aliases: ["cloud architecture", "cloud native", "cloud-native"], category: "cloud" },
  { canonical: "iaas", aliases: ["iaas", "infrastructure as a service"], category: "cloud" },
  { canonical: "paas", aliases: ["paas", "platform as a service"], category: "cloud" },
  { canonical: "saas", aliases: ["saas", "software as a service"], category: "cloud" },

  // Application Servers (5+ skills)
  { canonical: "apache tomcat", aliases: ["apache tomcat", "tomcat", "tomcat server", "tomcat 9"], category: "devops" },
  { canonical: "jboss", aliases: ["jboss", "wildfly", "jboss eap"], category: "devops" },
  { canonical: "weblogic", aliases: ["weblogic", "oracle weblogic", "weblogic server"], category: "devops" },
  { canonical: "websphere", aliases: ["websphere", "ibm websphere"], category: "devops" },

  // DevOps (25+ skills)
  { canonical: "docker", aliases: ["docker", "containerization", "containers", "dockerfile"], category: "devops" },
  { canonical: "kubernetes", aliases: ["kubernetes", "k8s", "kube"], category: "devops" },
  { canonical: "helm", aliases: ["helm", "helm charts"], category: "devops" },
  { canonical: "terraform", aliases: ["terraform", "hashicorp terraform"], category: "devops" },
  { canonical: "ansible", aliases: ["ansible"], category: "devops" },
  { canonical: "pulumi", aliases: ["pulumi"], category: "devops" },
  { canonical: "jenkins", aliases: ["jenkins"], category: "devops" },
  { canonical: "github actions", aliases: ["github actions", "gh actions"], category: "devops" },
  { canonical: "gitlab ci", aliases: ["gitlab ci", "gitlab ci/cd", "gitlab pipelines"], category: "devops" },
  { canonical: "circleci", aliases: ["circleci", "circle ci"], category: "devops" },
  { canonical: "travis ci", aliases: ["travis ci", "travis"], category: "devops" },
  { canonical: "argocd", aliases: ["argocd", "argo cd", "argo"], category: "devops" },
  { canonical: "ci/cd", aliases: ["ci/cd", "ci cd", "continuous integration", "continuous deployment", "continuous delivery"], category: "devops" },
  { canonical: "git", aliases: ["git"], category: "devops" },
  { canonical: "github", aliases: ["github"], category: "devops" },
  { canonical: "gitlab", aliases: ["gitlab"], category: "devops" },
  { canonical: "bitbucket", aliases: ["bitbucket"], category: "devops" },
  { canonical: "nginx", aliases: ["nginx"], category: "devops" },
  { canonical: "apache", aliases: ["apache", "apache http server"], category: "devops" },
  { canonical: "linux", aliases: ["linux", "unix", "ubuntu", "centos", "debian"], category: "devops" },
  { canonical: "bash", aliases: ["bash", "shell scripting", "shell", "sh", "shell scripts", "shell script"], category: "devops" },
  { canonical: "secdevops", aliases: ["secdevops", "devsecops", "secure devops", "security devops"], category: "devops" },
  { canonical: "release management", aliases: ["release management", "release manager", "release engineering"], category: "devops" },
  { canonical: "prometheus", aliases: ["prometheus"], category: "devops" },
  { canonical: "grafana", aliases: ["grafana"], category: "devops" },
  { canonical: "datadog", aliases: ["datadog"], category: "devops" },
  { canonical: "new relic", aliases: ["new relic", "newrelic"], category: "devops" },
  { canonical: "splunk", aliases: ["splunk"], category: "devops" },
  { canonical: "istio", aliases: ["istio", "service mesh"], category: "devops" },

  // Data Integration & ETL (5+ skills)
  { canonical: "informatica", aliases: ["informatica", "informatica powercenter", "informatica etl", "informatica certified", "informatica professional"], category: "data-science" },
  { canonical: "crystal reports", aliases: ["crystal reports", "sap crystal reports", "crystal"], category: "data-science" },
  { canonical: "ssis", aliases: ["ssis", "sql server integration services"], category: "data-science" },
  { canonical: "talend", aliases: ["talend", "talend open studio"], category: "data-science" },
  { canonical: "mulesoft", aliases: ["mulesoft", "mule esb"], category: "data-science" },

  // Data Science & AI (30+ skills)
  { canonical: "machine learning", aliases: ["machine learning", "ml"], category: "data-science" },
  { canonical: "deep learning", aliases: ["deep learning", "dl", "neural networks"], category: "data-science" },
  { canonical: "artificial intelligence", aliases: ["artificial intelligence", "ai"], category: "data-science" },
  { canonical: "llm", aliases: ["llm", "llms", "large language model", "large language models"], category: "data-science" },
  { canonical: "nlp", aliases: ["nlp", "natural language processing"], category: "data-science" },
  { canonical: "computer vision", aliases: ["computer vision", "cv", "image recognition"], category: "data-science" },
  { canonical: "tensorflow", aliases: ["tensorflow", "tf"], category: "data-science" },
  { canonical: "pytorch", aliases: ["pytorch", "torch"], category: "data-science" },
  { canonical: "keras", aliases: ["keras"], category: "data-science" },
  { canonical: "scikit-learn", aliases: ["scikit-learn", "sklearn", "scikit learn"], category: "data-science" },
  { canonical: "pandas", aliases: ["pandas"], category: "data-science" },
  { canonical: "numpy", aliases: ["numpy"], category: "data-science" },
  { canonical: "jupyter", aliases: ["jupyter", "jupyter notebook", "jupyter lab"], category: "data-science" },
  { canonical: "data analysis", aliases: ["data analysis", "analytics", "analytical", "data analytics"], category: "data-science" },
  { canonical: "data visualization", aliases: ["data visualization", "data viz"], category: "data-science" },
  { canonical: "tableau", aliases: ["tableau"], category: "data-science" },
  { canonical: "power bi", aliases: ["power bi", "powerbi"], category: "data-science" },
  { canonical: "looker", aliases: ["looker"], category: "data-science" },
  { canonical: "spark", aliases: ["spark", "apache spark", "pyspark"], category: "data-science" },
  { canonical: "hadoop", aliases: ["hadoop", "hdfs"], category: "data-science" },
  { canonical: "airflow", aliases: ["airflow", "apache airflow"], category: "data-science" },
  { canonical: "dbt", aliases: ["dbt", "data build tool"], category: "data-science" },
  { canonical: "etl", aliases: ["etl", "extract transform load", "data pipeline", "data pipelines"], category: "data-science" },
  { canonical: "prompt engineering", aliases: ["prompt engineering", "prompt design", "prompting"], category: "data-science" },
  { canonical: "vector database", aliases: ["vector database", "vector databases", "pinecone", "weaviate", "qdrant", "milvus", "chroma"], category: "data-science" },
  { canonical: "rag", aliases: ["rag", "retrieval augmented generation"], category: "data-science" },
  { canonical: "langchain", aliases: ["langchain"], category: "data-science" },
  { canonical: "openai api", aliases: ["openai api", "openai", "gpt api", "chatgpt api"], category: "data-science" },
  { canonical: "hugging face", aliases: ["hugging face", "huggingface", "transformers"], category: "data-science" },
  { canonical: "mlops", aliases: ["mlops", "ml ops", "machine learning operations"], category: "data-science" },

  // Mobile (15+ skills)
  { canonical: "react native", aliases: ["react native", "rn"], category: "mobile" },
  { canonical: "flutter", aliases: ["flutter", "dart"], category: "mobile" },
  { canonical: "ios", aliases: ["ios", "ios development"], category: "mobile" },
  { canonical: "swift", aliases: ["swift", "swiftui"], category: "mobile" },
  { canonical: "objective-c", aliases: ["objective-c", "obj-c", "objc"], category: "mobile" },
  { canonical: "android", aliases: ["android", "android development"], category: "mobile" },
  { canonical: "android studio", aliases: ["android studio"], category: "mobile" },
  { canonical: "jetpack compose", aliases: ["jetpack compose", "compose"], category: "mobile" },
  { canonical: "expo", aliases: ["expo"], category: "mobile" },
  { canonical: "ionic", aliases: ["ionic", "ionic framework"], category: "mobile" },
  { canonical: "xamarin", aliases: ["xamarin"], category: "mobile" },
  { canonical: "cordova", aliases: ["cordova", "phonegap"], category: "mobile" },
  { canonical: "app store", aliases: ["app store", "app store connect", "ios deployment"], category: "mobile" },
  { canonical: "play store", aliases: ["play store", "google play", "android deployment"], category: "mobile" },
  { canonical: "mobile ui", aliases: ["mobile ui", "mobile ux", "mobile design"], category: "mobile" },

  // Design (20+ skills)
  { canonical: "figma", aliases: ["figma"], category: "design" },
  { canonical: "sketch", aliases: ["sketch"], category: "design" },
  { canonical: "adobe xd", aliases: ["adobe xd", "xd"], category: "design" },
  { canonical: "invision", aliases: ["invision"], category: "design" },
  { canonical: "zeplin", aliases: ["zeplin"], category: "design" },
  { canonical: "photoshop", aliases: ["photoshop", "adobe photoshop"], category: "design" },
  { canonical: "illustrator", aliases: ["illustrator", "adobe illustrator"], category: "design" },
  { canonical: "adobe premiere pro", aliases: ["adobe premiere pro", "premiere pro", "premiere"], category: "design" },
  { canonical: "after effects", aliases: ["after effects", "adobe after effects"], category: "design" },
  { canonical: "motion graphics", aliases: ["motion graphics", "motion design"], category: "design" },
  { canonical: "video editing", aliases: ["video editing", "video editor", "editing videos"], category: "design" },
  { canonical: "final cut pro", aliases: ["final cut pro", "final cut", "fcpx"], category: "design" },
  { canonical: "davinci resolve", aliases: ["davinci resolve", "davinci"], category: "design" },
  { canonical: "product design", aliases: ["product design", "ux design", "ui/ux", "ui ux"], category: "design" },
  { canonical: "prototyping", aliases: ["prototyping", "prototype", "prototypes"], category: "design" },
  { canonical: "design systems", aliases: ["design systems", "design system"], category: "design" },
  { canonical: "wireframing", aliases: ["wireframing", "wireframes", "wireframe"], category: "design" },
  { canonical: "user research", aliases: ["user research", "ux research", "usability testing"], category: "design" },
  { canonical: "accessibility", aliases: ["accessibility", "a11y", "wcag"], category: "design" },
  { canonical: "responsive design", aliases: ["responsive design", "responsive web design", "rwd"], category: "design" },

  // Testing (15+ skills)
  { canonical: "jest", aliases: ["jest"], category: "testing" },
  { canonical: "mocha", aliases: ["mocha"], category: "testing" },
  { canonical: "cypress", aliases: ["cypress", "cypress.io"], category: "testing" },
  { canonical: "playwright", aliases: ["playwright"], category: "testing" },
  { canonical: "selenium", aliases: ["selenium", "selenium webdriver"], category: "testing" },
  { canonical: "testing library", aliases: ["testing library", "react testing library", "rtl"], category: "testing" },
  { canonical: "pytest", aliases: ["pytest"], category: "testing" },
  { canonical: "junit", aliases: ["junit", "junit5"], category: "testing" },
  { canonical: "testng", aliases: ["testng"], category: "testing" },
  { canonical: "rspec", aliases: ["rspec"], category: "testing" },
  { canonical: "tdd", aliases: ["tdd", "test driven development", "test-driven development"], category: "testing" },
  { canonical: "bdd", aliases: ["bdd", "behavior driven development", "cucumber"], category: "testing" },
  { canonical: "unit testing", aliases: ["unit testing", "unit tests"], category: "testing" },
  { canonical: "integration testing", aliases: ["integration testing", "integration tests"], category: "testing" },
  { canonical: "e2e testing", aliases: ["e2e testing", "end to end testing", "e2e tests"], category: "testing" },
  { canonical: "load testing", aliases: ["load testing", "performance testing", "stress testing", "k6", "jmeter"], category: "testing" },

  // Security (12+ skills)
  { canonical: "security", aliases: ["security", "application security", "appsec"], category: "security" },
  { canonical: "owasp", aliases: ["owasp", "owasp top 10"], category: "security" },
  { canonical: "penetration testing", aliases: ["penetration testing", "pen testing", "pentesting"], category: "security" },
  { canonical: "soc 2", aliases: ["soc 2", "soc2", "soc compliance"], category: "security" },
  { canonical: "hipaa", aliases: ["hipaa", "hipaa compliance"], category: "security" },
  { canonical: "gdpr", aliases: ["gdpr", "data privacy"], category: "security" },
  { canonical: "encryption", aliases: ["encryption", "cryptography"], category: "security" },
  { canonical: "ssl/tls", aliases: ["ssl/tls", "ssl", "tls", "https"], category: "security" },
  { canonical: "vault", aliases: ["vault", "hashicorp vault"], category: "security" },
  { canonical: "iam", aliases: ["iam", "identity and access management"], category: "security" },
  { canonical: "sso", aliases: ["sso", "single sign-on", "single sign on"], category: "security" },
  { canonical: "mfa", aliases: ["mfa", "multi-factor authentication", "2fa", "two-factor authentication"], category: "security" },

  // Soft Skills (20+ skills)
  { canonical: "leadership", aliases: ["leadership", "leading teams", "team leadership", "tech lead"], category: "soft-skill" },
  { canonical: "communication", aliases: ["communication", "written communication", "verbal communication", "communication skills"], category: "soft-skill" },
  { canonical: "collaboration", aliases: ["collaboration", "collaborative", "working with teams"], category: "soft-skill" },
  { canonical: "problem solving", aliases: ["problem solving", "problem-solving", "analytical thinking"], category: "soft-skill" },
  { canonical: "teamwork", aliases: ["teamwork", "team player"], category: "soft-skill" },
  { canonical: "cross-functional", aliases: ["cross-functional collaboration", "cross-functional teams", "cross functional"], category: "soft-skill" },
  { canonical: "project management", aliases: ["project management", "pm"], category: "soft-skill" },
  { canonical: "agile", aliases: ["agile", "agile methodology", "agile methodologies"], category: "soft-skill" },
  { canonical: "scrum", aliases: ["scrum", "scrum master"], category: "soft-skill" },
  { canonical: "kanban", aliases: ["kanban"], category: "soft-skill" },
  { canonical: "jira", aliases: ["jira", "atlassian jira"], category: "soft-skill" },
  { canonical: "confluence", aliases: ["confluence"], category: "soft-skill" },
  { canonical: "asana", aliases: ["asana"], category: "soft-skill" },
  { canonical: "trello", aliases: ["trello"], category: "soft-skill" },
  { canonical: "notion", aliases: ["notion"], category: "soft-skill" },
  { canonical: "slack", aliases: ["slack"], category: "soft-skill" },
  { canonical: "mentoring", aliases: ["mentoring", "coaching", "mentor"], category: "soft-skill" },
  { canonical: "presentation", aliases: ["presentation", "presentations", "public speaking"], category: "soft-skill" },
  { canonical: "time management", aliases: ["time management", "prioritization"], category: "soft-skill" },
  { canonical: "remote work", aliases: ["remote work", "remote", "work from home", "wfh"], category: "soft-skill" },
  { canonical: "sales", aliases: ["sales", "b2b sales", "saas sales", "enterprise sales"], category: "soft-skill" },
  { canonical: "negotiation", aliases: ["negotiation", "negotiating"], category: "soft-skill" },

  // Tools & Platforms (15+ skills)
  { canonical: "hubspot", aliases: ["hubspot"], category: "other" },
  { canonical: "salesforce", aliases: ["salesforce", "sfdc"], category: "other" },
  { canonical: "excel", aliases: ["excel", "microsoft excel", "google sheets", "spreadsheets"], category: "other" },
  { canonical: "sap", aliases: ["sap", "sap erp"], category: "other" },
  { canonical: "shopify", aliases: ["shopify", "shopify development"], category: "other" },
  { canonical: "wordpress", aliases: ["wordpress", "wp"], category: "other" },
  { canonical: "webflow", aliases: ["webflow"], category: "other" },
  { canonical: "stripe", aliases: ["stripe", "stripe api"], category: "other" },
  { canonical: "twilio", aliases: ["twilio"], category: "other" },
  { canonical: "sendgrid", aliases: ["sendgrid"], category: "other" },
  { canonical: "mailchimp", aliases: ["mailchimp"], category: "other" },
  { canonical: "segment", aliases: ["segment", "segment.io"], category: "other" },
  { canonical: "mixpanel", aliases: ["mixpanel"], category: "other" },
  { canonical: "amplitude", aliases: ["amplitude"], category: "other" },
  { canonical: "google analytics", aliases: ["google analytics", "ga", "ga4"], category: "other" },

  // Network & Infrastructure (20+ skills)
  { canonical: "cisco", aliases: ["cisco", "cisco systems", "cisco networking"], category: "backend" },
  { canonical: "routing protocols", aliases: ["routing protocols", "routing", "bgp", "ospf", "is-is", "eigrp", "rip"], category: "backend" },
  { canonical: "bgp", aliases: ["bgp", "border gateway protocol"], category: "backend" },
  { canonical: "ospf", aliases: ["ospf", "open shortest path first"], category: "backend" },
  { canonical: "mpls", aliases: ["mpls", "multiprotocol label switching", "mpls/rsvp"], category: "backend" },
  { canonical: "vpn", aliases: ["vpn", "virtual private network", "ipsec vpn", "ssl vpn", "layer-2 vpn", "layer-3 vpn"], category: "backend" },
  { canonical: "ipsec", aliases: ["ipsec", "ip security", "ipsec vpn"], category: "backend" },
  { canonical: "firewall", aliases: ["firewall", "firewalls", "network firewall", "palo alto", "fortinet", "checkpoint"], category: "backend" },
  { canonical: "load balancing", aliases: ["load balancing", "load balancer", "f5", "nginx load balancer"], category: "backend" },
  { canonical: "wireshark", aliases: ["wireshark", "packet capture", "network analysis"], category: "devops" },
  { canonical: "sip", aliases: ["sip", "sip trunking", "session initiation protocol"], category: "backend" },
  { canonical: "voip", aliases: ["voip", "voice over ip", "unified communications", "uc"], category: "backend" },
  { canonical: "network security", aliases: ["network security", "netsec", "network protection"], category: "security" },
  { canonical: "snmp", aliases: ["snmp", "simple network management protocol", "snmp traps"], category: "devops" },
  { canonical: "multicast", aliases: ["multicast", "ip multicast"], category: "backend" },
  { canonical: "lan/wan", aliases: ["lan", "wan", "lan/wan", "local area network", "wide area network"], category: "backend" },
  { canonical: "switching", aliases: ["switching", "network switching", "layer 2", "layer 3"], category: "backend" },
  { canonical: "dns", aliases: ["dns", "domain name system", "bind"], category: "devops" },
  { canonical: "dhcp", aliases: ["dhcp", "dynamic host configuration protocol"], category: "devops" },
  { canonical: "active directory", aliases: ["active directory", "ad", "ldap", "azure ad"], category: "devops" },

  // Certifications (15+ skills)
  { canonical: "aws certified", aliases: ["aws certified", "aws certification", "aws solutions architect", "aws developer", "aws cloud practitioner"], category: "certification" },
  { canonical: "azure certified", aliases: ["azure certified", "azure certification", "az-900", "az-104", "az-204"], category: "certification" },
  { canonical: "gcp certified", aliases: ["gcp certified", "google cloud certified"], category: "certification" },
  { canonical: "kubernetes certified", aliases: ["cka", "ckad", "kubernetes certified"], category: "certification" },
  { canonical: "pmp", aliases: ["pmp", "project management professional"], category: "certification" },
  { canonical: "csm", aliases: ["csm", "certified scrum master"], category: "certification" },
  { canonical: "cissp", aliases: ["cissp"], category: "certification" },
  { canonical: "ceh", aliases: ["ceh", "certified ethical hacker"], category: "certification" },
  { canonical: "comptia", aliases: ["comptia", "comptia a+", "comptia security+", "comptia network+"], category: "certification" },
  { canonical: "cisco certified", aliases: ["ccna", "ccnp", "cisco certified"], category: "certification" },
  { canonical: "terraform certified", aliases: ["terraform certified", "hashicorp certified"], category: "certification" },
  { canonical: "databricks certified", aliases: ["databricks certified"], category: "certification" },
  { canonical: "snowflake certified", aliases: ["snowflake certified", "snowpro"], category: "certification" },
  { canonical: "itil", aliases: ["itil", "itil foundation", "itil certified", "itil v3", "itil v4"], category: "certification" },
  { canonical: "security+", aliases: ["security+", "comptia security+", "sec+", "comptia sec+"], category: "certification" },
  { canonical: "network+", aliases: ["network+", "comptia network+", "net+"], category: "certification" },
  { canonical: "a+", aliases: ["a+", "comptia a+"], category: "certification" },

  // Project Management & Soft Skills (additional)
  { canonical: "confluence", aliases: ["confluence", "atlassian confluence"], category: "soft-skill" },
  { canonical: "risk management", aliases: ["risk management", "risk mitigation", "risk assessment"], category: "soft-skill" },
  { canonical: "stakeholder management", aliases: ["stakeholder management", "stakeholder communication", "stakeholder engagement"], category: "soft-skill" },
  { canonical: "change management", aliases: ["change management", "change control", "change requests"], category: "soft-skill" },
  { canonical: "quality assurance", aliases: ["quality assurance", "qa", "qasp", "quality control"], category: "soft-skill" },
  { canonical: "documentation", aliases: ["documentation", "technical documentation", "technical writing"], category: "soft-skill" },
  { canonical: "disaster recovery", aliases: ["disaster recovery", "dr", "business continuity", "bcdr"], category: "devops" },
  { canonical: "government contracts", aliases: ["government contracts", "federal contracts", "government contracting", "federal government"], category: "soft-skill" },
  { canonical: "dod experience", aliases: ["dod", "department of defense", "dod experience", "military", "defense"], category: "soft-skill" },
  { canonical: "security clearance", aliases: ["security clearance", "secret clearance", "top secret", "ts/sci", "clearance"], category: "certification" },
  { canonical: "oracle certified", aliases: ["oracle certified", "ocp", "oracle certified professional", "oracle certification"], category: "certification" },
  { canonical: "postgresql certified", aliases: ["postgresql certified", "postgresql certification", "postgres certified"], category: "certification" },
  { canonical: "informatica certified", aliases: ["informatica certified", "informatica certification", "informatica certified professional"], category: "certification" },
  { canonical: "hspd-12", aliases: ["hspd-12", "hspd12", "homeland security presidential directive 12"], category: "certification" },
  { canonical: "naci", aliases: ["naci", "national agency check inquiry", "background investigation"], category: "certification" },
  { canonical: "pmi-acp", aliases: ["pmi-acp", "agile certified practitioner", "pmi acp"], category: "certification" },

  // Additional FEC/Government skills
  { canonical: "code review", aliases: ["code review", "code reviews", "peer review", "peer code review"], category: "soft-skill" },
  { canonical: "database migration", aliases: ["database migration", "data migration", "db migration", "schema migration"], category: "database" },
  { canonical: "performance optimization", aliases: ["performance optimization", "performance tuning", "optimization", "perf optimization"], category: "backend" },
  { canonical: "software testing", aliases: ["software testing", "test plans", "test planning", "test management"], category: "testing" },
  { canonical: "technical leadership", aliases: ["technical leadership", "tech lead", "technical lead", "engineering leadership"], category: "soft-skill" },
  { canonical: "knowledge transfer", aliases: ["knowledge transfer", "knowledge sharing", "kt", "training"], category: "soft-skill" },
];

// Build lookup maps for fast access
const aliasToCanonical = new Map<string, string>();
const canonicalToAliases = new Map<string, string[]>();
const canonicalToCategory = new Map<string, SkillCategory>();

for (const skill of SKILL_DEFINITIONS) {
  canonicalToAliases.set(skill.canonical, skill.aliases);
  canonicalToCategory.set(skill.canonical, skill.category);
  for (const alias of skill.aliases) {
    aliasToCanonical.set(alias.toLowerCase(), skill.canonical);
  }
}

export function getCanonicalSkill(alias: string): string | undefined {
  return aliasToCanonical.get(alias.toLowerCase());
}

export function getSkillAliases(canonical: string): string[] {
  return canonicalToAliases.get(canonical) ?? [];
}

export function getSkillCategory(canonical: string): SkillCategory | undefined {
  return canonicalToCategory.get(canonical);
}

export function getAllCanonicalSkills(): string[] {
  return SKILL_DEFINITIONS.map((s) => s.canonical);
}

export function getSkillsByCategory(category: SkillCategory): string[] {
  return SKILL_DEFINITIONS.filter((s) => s.category === category).map((s) => s.canonical);
}

// Legacy compatibility: export the old SKILL_ALIASES format
export const SKILL_ALIASES: Record<string, string[]> = Object.fromEntries(
  SKILL_DEFINITIONS.map((s) => [s.canonical, s.aliases])
);
