'use client';

import { useState } from 'react';
import { useFinancialStatements } from '@/hooks/use-stock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface FinancialStatementsProps {
  symbol: string;
}

function formatLargeNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '-';
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  let formatted: string;
  if (absNum >= 1e12) formatted = `$${(absNum / 1e12).toFixed(1)}T`;
  else if (absNum >= 1e9) formatted = `$${(absNum / 1e9).toFixed(1)}B`;
  else if (absNum >= 1e6) formatted = `$${(absNum / 1e6).toFixed(1)}M`;
  else formatted = `$${absNum.toLocaleString()}`;
  return isNegative ? `(${formatted})` : formatted;
}

function formatYear(dateStr: string): string {
  if (!dateStr) return '-';
  return dateStr.split('-')[0];
}

export function FinancialStatements({ symbol }: FinancialStatementsProps) {
  const { data, isLoading, error } = useFinancialStatements(symbol);
  const [activeTab, setActiveTab] = useState('income');

  if (isLoading) {
    return (
      <div className="border border-border p-3">
        <div className="h-4 w-32 bg-secondary animate-pulse mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-secondary animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="border border-border p-3">
        <span className="font-mono text-xs text-muted-foreground">
          No financial data available
        </span>
      </div>
    );
  }

  const incomeData = data.incomeStatementHistory || [];
  const balanceData = data.balanceSheetHistory || [];
  const cashFlowData = data.cashFlowHistory || [];

  return (
    <div className="border border-border">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-3 py-1.5 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">FINANCIAL STATEMENTS</span>
          <TabsList className="h-7 bg-secondary/50">
            <TabsTrigger value="income" className="text-xs px-2 py-1 h-6">Income</TabsTrigger>
            <TabsTrigger value="balance" className="text-xs px-2 py-1 h-6">Balance</TabsTrigger>
            <TabsTrigger value="cashflow" className="text-xs px-2 py-1 h-6">Cash Flow</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="income" className="mt-0">
          {incomeData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="text-left px-3 py-2 text-muted-foreground font-normal sticky left-0 bg-secondary/20">Item</th>
                    {incomeData.map((s, i) => (
                      <th key={i} className="text-right px-3 py-2 text-muted-foreground font-normal min-w-[100px]">
                        {formatYear(s.endDate)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background">Total Revenue</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2">{formatLargeNumber(s.totalRevenue)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Cost of Revenue</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.costOfRevenue)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background font-medium">Gross Profit</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 font-medium">{formatLargeNumber(s.grossProfit)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">R&D</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.researchDevelopment)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">SG&A</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.sellingGeneralAdministrative)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background font-medium">Operating Income</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 font-medium">{formatLargeNumber(s.operatingIncome)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background">EBIT</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2">{formatLargeNumber(s.ebit)}</td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/10">
                    <td className="px-3 py-2 sticky left-0 bg-secondary/10 font-medium">Net Income</td>
                    {incomeData.map((s, i) => (
                      <td key={i} className={cn(
                        "text-right px-3 py-2 font-medium",
                        s.netIncome && s.netIncome > 0 ? 'text-gain' : s.netIncome && s.netIncome < 0 ? 'text-loss' : ''
                      )}>{formatLargeNumber(s.netIncome)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 font-mono text-xs text-muted-foreground">No income statement data</div>
          )}
        </TabsContent>

        <TabsContent value="balance" className="mt-0">
          {balanceData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="text-left px-3 py-2 text-muted-foreground font-normal sticky left-0 bg-secondary/20">Item</th>
                    {balanceData.map((s, i) => (
                      <th key={i} className="text-right px-3 py-2 text-muted-foreground font-normal min-w-[100px]">
                        {formatYear(s.endDate)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-secondary/10">
                    <td className="px-3 py-2 sticky left-0 bg-secondary/10 font-medium">Total Assets</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 font-medium">{formatLargeNumber(s.totalAssets)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Cash</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.cash)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Short-term Investments</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.shortTermInvestments)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background">Current Assets</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2">{formatLargeNumber(s.totalCurrentAssets)}</td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/10">
                    <td className="px-3 py-2 sticky left-0 bg-secondary/10 font-medium">Total Liabilities</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 font-medium">{formatLargeNumber(s.totalLiab)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Current Liabilities</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.totalCurrentLiabilities)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Long-term Debt</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.longTermDebt)}</td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/10">
                    <td className="px-3 py-2 sticky left-0 bg-secondary/10 font-medium">Stockholder Equity</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 font-medium">{formatLargeNumber(s.totalStockholderEquity)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Retained Earnings</td>
                    {balanceData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.retainedEarnings)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 font-mono text-xs text-muted-foreground">No balance sheet data</div>
          )}
        </TabsContent>

        <TabsContent value="cashflow" className="mt-0">
          {cashFlowData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    <th className="text-left px-3 py-2 text-muted-foreground font-normal sticky left-0 bg-secondary/20">Item</th>
                    {cashFlowData.map((s, i) => (
                      <th key={i} className="text-right px-3 py-2 text-muted-foreground font-normal min-w-[100px]">
                        {formatYear(s.endDate)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background">Net Income</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2">{formatLargeNumber(s.netIncome)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Depreciation</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.depreciation)}</td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/10">
                    <td className="px-3 py-2 sticky left-0 bg-secondary/10 font-medium">Operating Cash Flow</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className={cn(
                        "text-right px-3 py-2 font-medium",
                        s.totalCashFromOperatingActivities && s.totalCashFromOperatingActivities > 0 ? 'text-gain' : 'text-loss'
                      )}>{formatLargeNumber(s.totalCashFromOperatingActivities)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Capital Expenditures</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.capitalExpenditures)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background">Investing Cash Flow</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2">{formatLargeNumber(s.totalCashflowsFromInvestingActivities)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background text-muted-foreground pl-6">Dividends Paid</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2 text-muted-foreground">{formatLargeNumber(s.dividendsPaid)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 sticky left-0 bg-background">Financing Cash Flow</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className="text-right px-3 py-2">{formatLargeNumber(s.totalCashFromFinancingActivities)}</td>
                    ))}
                  </tr>
                  <tr className="bg-secondary/10">
                    <td className="px-3 py-2 sticky left-0 bg-secondary/10 font-medium">Change in Cash</td>
                    {cashFlowData.map((s, i) => (
                      <td key={i} className={cn(
                        "text-right px-3 py-2 font-medium",
                        s.changeInCash && s.changeInCash > 0 ? 'text-gain' : s.changeInCash && s.changeInCash < 0 ? 'text-loss' : ''
                      )}>{formatLargeNumber(s.changeInCash)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 font-mono text-xs text-muted-foreground">No cash flow data</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
