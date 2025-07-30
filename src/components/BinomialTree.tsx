import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BinomialResult} from '@/lib/binomial';
import { motion } from 'framer-motion';

interface BinomialTreeProps {
  result: BinomialResult | null;
}

export function BinomialTree({ result }: BinomialTreeProps) {
  if (!result) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>🌳 Binomial Tree</CardTitle>
          <CardDescription>
            Visual representation of the binomial tree will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Calculate option price to visualize the binomial tree
          </div>
        </CardContent>
      </Card>
    );
  }

  const { tree } = result;
  const maxSteps = tree.length - 1;

  // Calculate positions for tree nodes with better spacing
  const getNodePosition = (step: number, upMoves: number) => {
    const x = (step / maxSteps) * 80; // Use 80% width for better margins
    const totalNodesAtStep = step + 1;
    // Improved vertical spacing with padding
    const padding = 10;
    const availableHeight = 80 - (2 * padding);
    const y = padding + ((upMoves + 0.5) / totalNodesAtStep) * availableHeight;
    return { x, y };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌳 Binomial Tree
          </CardTitle>
          <CardDescription>
            Stock price evolution and option value propagation through time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full bg-gradient-to-br from-background to-muted/20 rounded-lg border">
            {/* Mobile responsive height with horizontal scroll */}
            <div className="h-[350px] md:h-[450px] lg:h-[550px] overflow-auto p-4">
              <svg 
                className="w-full h-full min-w-[600px] min-h-[300px]" 
                viewBox="0 0 120 100" 
                preserveAspectRatio="xMidYMid meet"
                style={{ backgroundColor: 'transparent' }}
              >
                {/* Background grid for better visibility */}
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path 
                      d="M 10 0 L 0 0 0 10" 
                      fill="none" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth="0.1" 
                      opacity="0.2"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Draw connections between nodes */}
                {tree.slice(0, -1).map((stepNodes, stepIndex) =>
                  stepNodes.map((_, nodeIndex) => {
                    const currentPos = getNodePosition(stepIndex, nodeIndex);
                    const upPos = getNodePosition(stepIndex + 1, nodeIndex + 1);
                    const downPos = getNodePosition(stepIndex + 1, nodeIndex);
                    
                    // Calculate line endpoints to start/end at circle edges
                    const circleRadius = 4;
                    const currentX = currentPos.x + 10;
                    const currentY = 90 - currentPos.y;
                    const upX = upPos.x + 10;
                    const upY = 90 - upPos.y;
                    const downX = downPos.x + 10;
                    const downY = 90 - downPos.y;
                    
                    // Calculate direction vectors and normalize for up connection
                    const upDx = upX - currentX;
                    const upDy = upY - currentY;
                    const upLength = Math.sqrt(upDx * upDx + upDy * upDy);
                    const upUnitX = upDx / upLength;
                    const upUnitY = upDy / upLength;
                    
                    // Calculate direction vectors and normalize for down connection
                    const downDx = downX - currentX;
                    const downDy = downY - currentY;
                    const downLength = Math.sqrt(downDx * downDx + downDy * downDy);
                    const downUnitX = downDx / downLength;
                    const downUnitY = downDy / downLength;
                    
                    return (
                      <g key={`connections-${stepIndex}-${nodeIndex}`}>
                        {/* Up connection - starts from edge of current circle, ends at edge of up circle */}
                        <line
                          x1={currentX + upUnitX * circleRadius}
                          y1={currentY + upUnitY * circleRadius}
                          x2={upX - upUnitX * circleRadius}
                          y2={upY - upUnitY * circleRadius}
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth="1.5"
                          strokeDasharray="3,2"
                          opacity="0.8"
                        />
                        {/* Down connection - starts from edge of current circle, ends at edge of down circle */}
                        <line
                          x1={currentX + downUnitX * circleRadius}
                          y1={currentY + downUnitY * circleRadius}
                          x2={downX - downUnitX * circleRadius}
                          y2={downY - downUnitY * circleRadius}
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth="1.5"
                          strokeDasharray="3,2"
                          opacity="0.8"
                        />
                      </g>
                    );
                  })
                )}
                
                {/* Draw nodes */}
                {tree.map((stepNodes, stepIndex) =>
                  stepNodes.map((node, nodeIndex) => {
                    const pos = getNodePosition(stepIndex, nodeIndex);
                    const isInitial = stepIndex === 0;
                    const isFinal = stepIndex === maxSteps;
                    
                    return (
                      <g key={`node-${stepIndex}-${nodeIndex}`}>
                        {/* Node background circle */}
                        <motion.circle
                          initial={{ scale: 0 }}
                          animate={{ scale: 0.6 }}
                          transition={{ delay: stepIndex * 0.1 + nodeIndex * 0.05 }}
                          cx={pos.x + 10}
                          cy={90 - pos.y}
                          r="4"
                          fill="hsl(var(--background))"
                          stroke={
                            isInitial ? 'hsl(var(--primary))' : 
                            isFinal ? 'hsl(142 76% 36%)' : 
                            'hsl(217 91% 60%)'
                          }
                          strokeWidth="2"
                        />
                        
                        {/* Node center dot */}
                        <circle
                          cx={pos.x + 10}
                          cy={90 - pos.y}
                          r="1.5"
                          fill={
                            isInitial ? 'hsl(var(--primary))' : 
                            isFinal ? 'hsl(142 76% 36%)' : 
                            'hsl(217 91% 60%)'
                          }
                        />
                        
                        {/* Node labels - show for trees with 5 or fewer steps */}
                        {maxSteps <= 5 && (
                          <g>
                            {/* Stock price label */}
                            <text
                              x={pos.x + 10}
                              y={90 - pos.y - 4}
                              textAnchor="middle"
                              fill="hsl(var(--foreground))"
                              fontSize="4"
                              fontWeight="600"
                              className="select-none"
                            >
                              ${node.stockPrice.toFixed(1)}
                            </text>
                            {/* Option value label */}
                            <text
                              x={pos.x + 10}
                              y={90 - pos.y + 6}
                              textAnchor="middle"
                              fill="hsl(142 76% 36%)"
                              fontSize="3.5"
                              fontWeight="500"
                              className="select-none"
                            >
                              ${node.optionValue.toFixed(2)}
                            </text>
                          </g>
                        )}
                        
                        {/* Hover tooltip for larger trees */}
                        {maxSteps > 5 && (
                          <title>
                            Step {stepIndex}: Stock ${node.stockPrice.toFixed(2)}, Option ${node.optionValue.toFixed(2)}
                          </title>
                        )}
                      </g>
                    );
                  })
                )}
                
                {/* Time step labels */}
                {Array.from({ length: maxSteps + 1 }, (_, i) => (
                  <text
                    key={`time-${i}`}
                    x={(i / maxSteps) * 80 + 10}
                    y={96}
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    fontSize="3"
                    fontWeight="500"
                    className="select-none"
                  >
                    t={i}
                  </text>
                ))}
              </svg>
            </div>
            
            {/* Legend - responsive positioning */}
            <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2 shadow-lg border border-border">
              <div className="font-semibold text-foreground mb-2">Legend</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-primary bg-background"></div>
                <span className="text-foreground">Initial Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-background"></div>
                <span className="text-foreground">Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-green-600 bg-background"></div>
                <span className="text-foreground">Final Payoff</span>
              </div>
            </div>
            
            {/* Instructions for mobile */}
            <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm rounded-lg p-2 text-xs shadow-lg border border-border md:hidden">
              <div className="text-foreground font-medium">Scroll to explore</div>
            </div>
            
            {/* Time axis label */}
            <div className="absolute bottom-5 right-3 bg-background/95 backdrop-blur-sm rounded-lg p-2 text-xs shadow-lg border border-border">
              <span className="text-foreground font-medium">Time: 0 to T</span>
            </div>
          </div>
          
          {maxSteps > 5 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> For trees with more than 5 steps, individual node values are hidden for clarity. 
                Hover over nodes to see stock prices and option values. The tree structure shows the price evolution paths from initial stock price to all possible final outcomes.
              </p>
            </div>
          )}
          
          {/* Mobile optimization note */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg md:hidden">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Mobile Tip:</strong> The tree diagram is scrollable. Swipe horizontally and vertically to explore all nodes and connections.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}