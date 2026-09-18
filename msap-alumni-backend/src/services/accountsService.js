/**
 * @fileoverview Financial accounts service for the MSAP Alumni backend.
 *
 * Provides a read-only summary of the association's financial accounts for
 * display on the public transparency page. Falls back to in-memory seed data
 * when Supabase is not configured.
 *
 * @module services/accountsService
 */

import { supabase, isConfigured } from '../config/supabase.js';

import { logger } from '../config/logger.js';

const initialAccounts = [
  { id: '1', category: 'Fixed Deposits', balance_formatted: '₹3,50,000', balance_numeric: 350000.00, status: 'Verified', fiscal_year: 'FY 2025–26' },
  { id: '2', category: 'Savings Account', balance_formatted: '₹1,24,350', balance_numeric: 124350.00, status: 'Verified', fiscal_year: 'FY 2025–26' },
  { id: '3', category: 'Membership Corpus', balance_formatted: '₹42,000', balance_numeric: 42000.00, status: 'Audited', fiscal_year: 'FY 2025–26' },
  { id: '4', category: 'Event & Cultural Fund', balance_formatted: '₹18,500', balance_numeric: 18500.00, status: 'Active', fiscal_year: 'FY 2025–26' },
];

let mockAccounts = [...initialAccounts];

function formatRupees(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export class AccountsService {
  static async getSummary() {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('financial_accounts')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        logger.warn('Supabase accounts query failed (table may not exist), falling back to mock accounts', { error: error.message });
        const totalNumeric = mockAccounts.reduce((acc, row) => acc + row.balance_numeric, 0);
        return {
          accounts: mockAccounts,
          total: formatRupees(totalNumeric),
          totalNumeric,
          lastUpdated: new Date().toISOString(),
        };
      }

      const totalNumeric = (data || []).reduce((acc, row) => acc + Number(row.balance_numeric || 0), 0);
      return {
        accounts: data,
        total: formatRupees(totalNumeric),
        totalNumeric,
        lastUpdated: new Date().toISOString(),
      };
    }

    const totalNumeric = mockAccounts.reduce((acc, row) => acc + row.balance_numeric, 0);
    return {
      accounts: mockAccounts,
      total: formatRupees(totalNumeric),
      totalNumeric,
      lastUpdated: new Date().toISOString(),
    };
  }
}
