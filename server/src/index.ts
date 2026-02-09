import app from './app';

const port = process.env.PORT || 8080;

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port}`);
    });
}

export default app;