import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { OptionParameters } from '@/lib/binomial';

interface ParameterInputsProps {
  parameters: OptionParameters;
  onParameterChange: (key: keyof OptionParameters, value: number | string) => void;
  onCalculate: () => void;
}

export function ParameterInputs({ parameters, onParameterChange, onCalculate }: ParameterInputsProps) {
  const handleInputChange = (key: keyof OptionParameters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = key === 'optionType' ? e.target.value : parseFloat(e.target.value) || 0;
    onParameterChange(key, value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Option Parameters
        </CardTitle>
        <CardDescription>
          Configure the market parameters for the binomial option pricing model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="S0">Initial Stock Price (S₀)</Label>
            <Input
              id="S0"
              type="number"
              step="0.01"
              value={parameters.S0}
              onChange={handleInputChange('S0')}
              placeholder="100.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="K">Strike Price (K)</Label>
            <Input
              id="K"
              type="number"
              step="0.01"
              value={parameters.K}
              onChange={handleInputChange('K')}
              placeholder="100.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="r">Risk-Free Rate (r)</Label>
            <Input
              id="r"
              type="number"
              step="0.001"
              value={parameters.r}
              onChange={handleInputChange('r')}
              placeholder="0.05"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="T">Time to Maturity (T) - Years</Label>
            <Input
              id="T"
              type="number"
              step="0.01"
              value={parameters.T}
              onChange={handleInputChange('T')}
              placeholder="1.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sigma">Volatility (σ)</Label>
            <Input
              id="sigma"
              type="number"
              step="0.001"
              value={parameters.sigma}
              onChange={handleInputChange('sigma')}
              placeholder="0.20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="N">Number of Steps (N)</Label>
            <Input
              id="N"
              type="number"
              step="1"
              min="1"
              max="10"
              value={parameters.N}
              onChange={handleInputChange('N')}
              placeholder="3"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Option Type</Label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="optionType"
                value="call"
                checked={parameters.optionType === 'call'}
                onChange={handleInputChange('optionType')}
                className="text-primary"
              />
              <span>Call Option</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="optionType"
                value="put"
                checked={parameters.optionType === 'put'}
                onChange={handleInputChange('optionType')}
                className="text-primary"
              />
              <span>Put Option</span>
            </label>
          </div>
        </div>
        
        <Button onClick={onCalculate} className="w-full" size="lg">
          Calculate Option Price
        </Button>
      </CardContent>
    </Card>
  );
}