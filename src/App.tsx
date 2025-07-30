import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ParameterInputs } from '@/components/ParameterInputs';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { BinomialTree } from '@/components/BinomialTree';
import { OptionParameters, BinomialResult, calculateBinomialOptionPrice } from '@/lib/binomial';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calculator, BarChart3 } from 'lucide-react';

function App() {
  const [parameters, setParameters] = useState<OptionParameters>({
    S0: 100,
    K: 100,
    r: 0.05,
    T: 1,
    sigma: 0.2,
    N: 3,
    optionType: 'call'
  });

  const [result, setResult] = useState<BinomialResult | null>(null);

  const handleParameterChange = (key: keyof OptionParameters, value: number | string) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCalculate = () => {
    try {
      const calculatedResult = calculateBinomialOptionPrice(parameters);
      setResult(calculatedResult);
    } catch (error) {
      console.error('Error calculating option price:', error);
      // You could add error handling UI here
    }
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="binomial-theme">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Binomial Option Pricing</h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Introduction */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Interactive Binomial Option Pricing Model
              </CardTitle>
              <CardDescription>
                A comprehensive tool for pricing European options using the binomial tree method. 
                Perfect for financial analysis, education, and understanding derivatives pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <BarChart3 className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Risk-Neutral Valuation</div>
                    <div className="text-muted-foreground">Uses risk-neutral probabilities for accurate pricing</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Visual Tree Structure</div>
                    <div className="text-muted-foreground">Interactive binomial tree visualization</div>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Calculator className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <div className="font-medium">Real-Time Calculation</div>
                    <div className="text-muted-foreground">Instant results with parameter changes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Inputs and Results */}
            <div className="space-y-8">
              <ParameterInputs
                parameters={parameters}
                onParameterChange={handleParameterChange}
                onCalculate={handleCalculate}
              />
              
              <ResultsDisplay
                result={result}
                optionType={parameters.optionType}
              />
            </div>

            {/* Right Column - Binomial Tree */}
            <div>
              <BinomialTree result={result} />
            </div>
          </div>

          {/* Educational Content */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Understanding the Binomial Model</CardTitle>
              <CardDescription>
                Key concepts and interpretation of the binomial option pricing model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Model Assumptions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Stock price follows a binomial process</li>
                    <li>• Constant risk-free rate and volatility</li>
                    <li>• No dividends during option life</li>
                    <li>• European exercise (only at maturity)</li>
                    <li>• No transaction costs or taxes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Parameters</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>S₀:</strong> Current stock price</li>
                    <li>• <strong>K:</strong> Strike price of the option</li>
                    <li>• <strong>r:</strong> Risk-free interest rate</li>
                    <li>• <strong>T:</strong> Time to expiration (years)</li>
                    <li>• <strong>σ:</strong> Volatility of the underlying</li>
                    <li>• <strong>N:</strong> Number of time steps</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Built with Love ❤️🤍 by Rupii</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;