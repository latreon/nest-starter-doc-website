module.exports = {
    docs: [
        'introduction',
        'getting-started',
        'setup-guide',
        {
            type: 'category',
            label: 'Authentication',
            items: [
                'authentication/jwt',
                'authentication/two-factor',
                'authentication/api-key',
            ],
        },
        {
            type: 'category',
            label: 'Security',
            items: [
                'security/encryption',
                'security/password-handling',
                'security/rate-limiting',
            ],
        },
        {
            type: 'category',
            label: 'Database',
            items: [
                'database/typeorm-setup',
                'database/migrations',
                'database/pagination',
            ],
        },
        {
            type: 'category',
            label: 'API Documentation',
            items: [
                'api-docs/swagger',
                'api-docs/endpoints',
            ],
        },
        {
            type: 'category',
            label: 'Configuration',
            items: [
                'configuration/environment',
                'configuration/validation',
            ],
        },
        /* 
        // Commented out sections that don't have documentation files yet
        {
            type: 'category',
            label: 'Error Handling',
            items: [
                'error-handling/global-exceptions',
                'error-handling/custom-exceptions',
            ],
        },
        {
            type: 'category',
            label: 'Development',
            items: [
                'development/project-structure',
                'development/coding-standards',
                'development/testing',
                'development/debugging',
            ],
        },
        {
            type: 'category',
            label: 'Deployment',
            items: [
                'deployment/docker',
                'deployment/production',
            ],
        },
        */
    ],
}; 