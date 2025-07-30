import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BinomialResult, formatCurrency, formatPercentage } from '@/lib/binomial';
import { motion } from 'framer-motion';

interface ResultsDisplayProps {
  result: BinomialResult | null;
  optionType: 'call' | 'put';
}

export function ResultsDisplay({ result, optionType }: ResultsDisplayProps) {
  if (!result) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>📈 Results</CardTitle>
          <CardDescription>
            Option pricing results will appear here after calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Configure parameters and click "Calculate Option Price" to see results
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Results
          </CardTitle>
          <CardDescription>
            Binomial option pricing model results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">
                {optionType.charAt(0).toUpperCase() + optionType.slice(1)} Option Price
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(result.optionPrice)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Up Factor (u):</span>
                <span className="font-medium">{result.u.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Down Factor (d):</span>
                <span className="font-medium">{result.d.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Risk-Neutral Probability (p):</span>
                <span className="font-medium">{formatPercentage(result.p)}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Model Interpretation</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• The up factor (u) represents the multiplicative increase in stock price per step</p>
              <p>• The down factor (d) represents the multiplicative decrease in stock price per step</p>
              <p>• Risk-neutral probability (p) is the probability of an up move in the risk-neutral world</p>
              <p>• Option value is calculated using backward induction from maturity to present</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}