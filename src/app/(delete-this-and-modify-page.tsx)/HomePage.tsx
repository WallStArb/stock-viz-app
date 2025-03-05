import StockScreener from '@/app/components/StockScreener';

const HomePage: React.FC = () => {
    return (
        <main className='container mx-auto py-6 space-y-8'>
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Stock Analysis Dashboard
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                    Real-time market insights powered by FinViz data
                </p>
            </div>
            
            <StockScreener className="mt-6" />
        </main>
    );
};

export default HomePage;
