module.exports = {
    title: 'NestJS Starter Kit',
    tagline: 'A powerful, production-ready NestJS starter template',
    url: 'https://your-domain.com',
    baseUrl: '/',
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'latreon',
    projectName: 'nest-starter-kit',
    themeConfig: {
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: 'NestJS Starter Kit',
            logo: {
                alt: 'NestJS Starter Kit Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: 'Documentation',
                    position: 'left',
                },
                {
                    href: 'https://github.com/latreon/nest-starter-kit',
                    label: 'GitHub',
                    position: 'right',
                    className: 'github-button',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Documentation',
                    items: [
                        {
                            label: 'Introduction',
                            to: 'docs/',
                        },
                        {
                            label: 'Getting Started',
                            to: 'docs/getting-started',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/latreon/nest-starter-kit',
                        },
                        {
                            label: 'Report Issues',
                            href: 'https://github.com/latreon/nest-starter-kit/issues',
                        }
                    ],
                },
                {
                    title: 'Resources',
                    items: [
                        {
                            label: 'NestJS Documentation',
                            href: 'https://docs.nestjs.com/',
                        },
                        {
                            label: 'TypeORM',
                            href: 'https://typeorm.io/',
                        },
                        {
                            label: 'JWT',
                            href: 'https://jwt.io/',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Karimov Farda. Built with Docusaurus.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    routeBasePath: 'docs',
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/latreon/nest-starter-kit-doc/edit/main/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};