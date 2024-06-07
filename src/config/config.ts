export default (): {
    application: {
        port: number;
        name: string;
        description: string;
        version: string;
    };
} => ({
    application: {
        port: parseInt(process.env.PORT, 10) || 3000,
        name: process.env.APPLICATION_NAME || 'Service',
        description: process.env.APPLICATION_DESCRIPTION || 'Service documentation',
        version: process.env.APPLICATION_VERSION || '1.0',
    },
});
