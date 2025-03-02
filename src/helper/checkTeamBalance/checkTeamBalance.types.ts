interface BalancedTeam {
  isBalanced: true;
  message?: string;
}

interface UnbalancedTeam {
  isBalanced: false;
  message: string;
}

export type TeamBalanceResult = BalancedTeam | UnbalancedTeam;
