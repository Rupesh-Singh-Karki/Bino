export interface OptionParameters {
  S0: number;      // Initial stock price
  K: number;       // Strike price
  r: number;       // Risk-free rate
  T: number;       // Time to maturity
  sigma: number;   // Volatility
  N: number;       // Number of steps
  optionType: 'call' | 'put';
}

export interface TreeNode {
  stockPrice: number;
  optionValue: number;
  step: number;
  upMoves: number;
}

export interface BinomialResult {
  optionPrice: number;
  tree: TreeNode[][];
  u: number;  // Up factor
  d: number;  // Down factor
  p: number;  // Risk-neutral probability
}

export function calculateBinomialOptionPrice(params: OptionParameters): BinomialResult {
  const { S0, K, r, T, sigma, N, optionType } = params;
  
  // Calculate parameters
  const dt = T / N;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const p = (Math.exp(r * dt) - d) / (u - d);
  
  // Initialize the tree
  const tree: TreeNode[][] = [];
  
  // Build stock price tree (forward pass)
  for (let i = 0; i <= N; i++) {
    tree[i] = [];
    for (let j = 0; j <= i; j++) {
      const stockPrice = S0 * Math.pow(u, j) * Math.pow(d, i - j);
      tree[i][j] = {
        stockPrice,
        optionValue: 0, // Will be calculated in backward pass
        step: i,
        upMoves: j
      };
    }
  }
  
  // Calculate option values at maturity (final step)
  for (let j = 0; j <= N; j++) {
    const stockPrice = tree[N][j].stockPrice;
    if (optionType === 'call') {
      tree[N][j].optionValue = Math.max(stockPrice - K, 0);
    } else {
      tree[N][j].optionValue = Math.max(K - stockPrice, 0);
    }
  }
  
  // Backward induction to calculate option values
  for (let i = N - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      const upValue = tree[i + 1][j + 1].optionValue;
      const downValue = tree[i + 1][j].optionValue;
      tree[i][j].optionValue = Math.exp(-r * dt) * (p * upValue + (1 - p) * downValue);
    }
  }
  
  return {
    optionPrice: tree[0][0].optionValue,
    tree,
    u,
    d,
    p
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(value);
}