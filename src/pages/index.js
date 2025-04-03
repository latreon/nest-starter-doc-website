import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import CodeBlock from '@theme/CodeBlock';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/">
                        Get Started
                    </Link>

                </div>
            </div>
        </header>
    );
}

function Feature({ title, description, icon, subFeatures }) {
    return (
        <div className={clsx('col col--4')}>
            <div className={styles.featureCard}>
                <div className="text--center padding-horiz--md">
                    <div className={styles.featureIcon}>{icon}</div>
                    <h3 className={styles.featureTitle}>{title}</h3>
                    <p className={styles.featureDescription}>{description}</p>
                    {subFeatures && (
                        <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
                            {subFeatures.map((feature, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout
            title={`${siteConfig.title}`}
            description="A powerful, production-ready NestJS starter template">
            <HomepageHeader />
            <main>
                {/* Install Command Section */}
                <section className={styles.section}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Create Your Project in Seconds</h2>
                        <div className={styles.installCommand}>
                            <h3 className={styles.installTitle}>Generate a new project:</h3>
                            <CodeBlock className="language-bash">
                                npx nestjs-starter-kit my-project
                            </CodeBlock>
                            <p style={{ marginTop: '1rem', opacity: '0.8' }}>
                                This will create a new NestJS project with all the features and best practices already configured.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={styles.features}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Key Features</h2>
                        <div className="row">
                            <Feature
                                icon="🔐"
                                title="Advanced Authentication"
                                description="Complete authentication system with multiple strategies"
                                subFeatures={[
                                    "JWT-based authentication with refresh tokens",
                                    "Two-factor authentication (2FA) with encrypted secrets",
                                    "API key authentication"
                                ]}
                            />
                            <Feature
                                icon="🛡️"
                                title="Security Enhancements"
                                description="Military-grade security features built-in"
                                subFeatures={[
                                    "AES-256-CBC encryption for sensitive data",
                                    "Secure password handling with bcrypt",
                                    "Protection against common web vulnerabilities",
                                    "Rate limiting and throttling"
                                ]}
                            />
                            <Feature
                                icon="🔑"
                                title="Authorization"
                                description="Fine-grained access control"
                                subFeatures={[
                                    "Role-based access control",
                                    "Public/private route decorators"
                                ]}
                            />
                        </div>
                        <div className="row" style={{ marginTop: '2rem' }}>
                            <Feature
                                icon="🗄️"
                                title="Database Integration"
                                description="Powerful ORM setup ready to use"
                                subFeatures={[
                                    "TypeORM with PostgreSQL",
                                    "Entity inheritance with BaseEntity",
                                    "Efficient pagination"
                                ]}
                            />
                            <Feature
                                icon="📚"
                                title="API Documentation"
                                description="Comprehensive API docs out of the box"
                                subFeatures={[
                                    "Swagger/OpenAPI with rich metadata",
                                    "Detailed endpoint descriptions",
                                    "Authentication examples"
                                ]}
                            />
                            <Feature
                                icon="⚙️"
                                title="Environment Configuration"
                                description="Robust configuration system"
                                subFeatures={[
                                    "Environment-specific configurations",
                                    "Strong validation with Joi",
                                    "Sensible defaults"
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Security Features Section */}
                <section className={styles.securityFeatures}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Security First Approach</h2>
                        <div className="row">
                            <div className="col col--6">
                                <div className={styles.featureCard} style={{ height: '100%' }}>
                                    <h3 className={styles.sectionHeader}>
                                        <span role="img" aria-label="lock">🔒</span> Encrypted 2FA Secrets
                                    </h3>
                                    <p>This starter kit implements industry-standard encryption for 2FA secrets, addressing a common security vulnerability:</p>
                                    <ul style={{ marginTop: '1rem' }}>
                                        <li><strong>AES-256-CBC Encryption:</strong> Military-grade encryption for 2FA secrets</li>
                                        <li><strong>Unique Initialization Vectors:</strong> Each secret gets a unique IV for enhanced security</li>
                                        <li><strong>Transparent Encryption/Decryption:</strong> Handled automatically by the system</li>
                                        <li><strong>Error Handling:</strong> Robust error handling for cryptographic operations</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.featureCard} style={{ height: '100%' }}>
                                    <h3 className={styles.sectionHeader}>
                                        <span role="img" aria-label="shield">🛡️</span> Data Protection
                                    </h3>
                                    <p>All sensitive data is properly protected following industry best practices:</p>
                                    <ul style={{ marginTop: '1rem' }}>
                                        <li><strong>Encrypted Data:</strong> All sensitive data is properly encrypted or hashed</li>
                                        <li><strong>Secure Password Storage:</strong> Passwords are hashed using bcrypt with proper salt rounds</li>
                                        <li><strong>Privacy Protection:</strong> Personal information is protected according to best practices</li>
                                        <li><strong>Attack Prevention:</strong> Protection against common authentication attacks</li>
                                        <li><strong>Secure Tokens:</strong> Configurable token expiration and secure storage</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '2rem' }}>
                            <div className="col col--12">
                                <div className={styles.featureCard} style={{ textAlign: 'center', padding: '2rem' }}>
                                    <h3 className={styles.securityHeader}>Security Best Practices</h3>
                                    <div className="row">
                                        <div className="col col--4">
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '2rem', color: '#e0234e' }} role="img" aria-label="lock">🔐</span>
                                                <h4>No Plain Text Secrets</h4>
                                                <p style={{ fontSize: '0.9rem' }}>All sensitive data is encrypted or hashed</p>
                                            </div>
                                        </div>
                                        <div className="col col--4">
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '2rem', color: '#e0234e' }} role="img" aria-label="key">🔑</span>
                                                <h4>Secure JWT</h4>
                                                <p style={{ fontSize: '0.9rem' }}>Properly configured signing and expiration</p>
                                            </div>
                                        </div>
                                        <div className="col col--4">
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '2rem', color: '#e0234e' }} role="img" aria-label="shield">🛡️</span>
                                                <h4>Rate Limiting</h4>
                                                <p style={{ fontSize: '0.9rem' }}>Protection against brute force attacks</p>
                                            </div>
                                        </div>
                                        <div className="col col--4">
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '2rem', color: '#e0234e' }} role="img" aria-label="check">✅</span>
                                                <h4>Input Validation</h4>
                                                <p style={{ fontSize: '0.9rem' }}>All input is validated before processing</p>
                                            </div>
                                        </div>
                                        <div className="col col--4">
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '2rem', color: '#e0234e' }} role="img" aria-label="document">📝</span>
                                                <h4>Content Security</h4>
                                                <p style={{ fontSize: '0.9rem' }}>Headers properly set for security</p>
                                            </div>
                                        </div>
                                        <div className="col col--4">
                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '2rem', color: '#e0234e' }} role="img" aria-label="database">🗄️</span>
                                                <h4>Database Security</h4>
                                                <p style={{ fontSize: '0.9rem' }}>Parameterized queries to prevent SQL injection</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Code Showcase Section */}
                <section className={styles.codeShowcase}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Ready to Use</h2>
                        <div className="row">
                            <div className="col col--6">
                                <div className={styles.featureCard}>
                                    <h3 className={styles.sectionHeader}>
                                        <span role="img" aria-label="rocket">🚀</span> Quick Start
                                    </h3>
                                    <CodeBlock className="language-bash">
                                        {`# Clone the repository
git clone https://github.com/latreon/nest-starter-kit.git

# Install dependencies
cd nest-starter-kit
npm install

# Configure environment variables
cp .env.example .env.development

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev`}
                                    </CodeBlock>
                                    <div className={styles.infoBox}>
                                        <p><strong>Access the API documentation:</strong> http://localhost:3000/api/docs</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.featureCard}>
                                    <h3 className={styles.sectionHeader}>
                                        <span role="img" aria-label="folder">📁</span> Project Structure
                                    </h3>
                                    <CodeBlock className="language-text" style={{ fontSize: '0.85rem' }}>
                                        {`src/
├── app/                # Application core
│   ├── common/         # Common utilities and helpers
│   │   ├── decorators/ # Custom decorators
│   │   ├── docs/       # API documentation
│   │   ├── entities/   # Base entities
│   │   ├── dto/        # Common DTOs
│   │   ├── services/   # Common services
│   │   └── exception/  # Exception filters
│   └── modules/        # Feature modules
│       ├── auth/       # Authentication module
│       ├── user/       # User management module
│       └── shared/     # Shared services and utilities
├── config/             # Configuration settings
├── database/           # Database setup and migrations
└── main.ts             # Application entry point`}
                                    </CodeBlock>
                                    <div className={styles.infoBox}>
                                        <p>A well-organized structure following <strong>NestJS best practices</strong> and ensuring <strong>maintainability</strong>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Authentication Flow Section */}
                <section className={styles.authFlow}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Authentication Flow</h2>
                        <div className="row">
                            <div className="col col--4">
                                <div className={styles.featureCard}>
                                    <h3 className={styles.authSectionHeader}>JWT Authentication</h3>
                                    <ul>
                                        <li>Login with email/password to receive JWT token</li>
                                        <li>Use token for subsequent authenticated requests</li>
                                        <li>Automatic handling of token expiration and refresh</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.featureCard}>
                                    <h3 className={styles.authSectionHeader}>Two-Factor Authentication</h3>
                                    <ul>
                                        <li>Enable 2FA for enhanced security</li>
                                        <li>2FA secrets are securely encrypted in the database</li>
                                        <li>TOTP-based verification (compatible with apps like Google Authenticator)</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.featureCard}>
                                    <h3 className={styles.authSectionHeader}>API Key Authentication</h3>
                                    <ul>
                                        <li>Alternative authentication for service-to-service communication</li>
                                        <li>Unique per-user API keys with fine-grained permissions</li>
                                        <li>Easily integrate with external services</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className={styles.callToAction}>
                    <div className="container">
                        <h2>Start Building Secure Applications Today</h2>
                        <p>
                            Get started with NestJS Starter Kit and focus on building your business logic rather than spending time on boilerplate code and security concerns.
                        </p>
                        <div className={styles.buttons}>
                            <Link
                                className={clsx("button button--secondary button--lg", styles.callToActionButton)}
                                to="/docs/introduction">
                                Read Documentation
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}