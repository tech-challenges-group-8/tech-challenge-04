
import { apiClient } from "./apiClient";
import { transactionsCache } from "./cache";
import type { Transaction, NewTransaction } from "./types";

const sortByDateDesc = (transactions: Transaction[]): Transaction[] =>
  [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const transactionApi = {
  getTransactions: async (accountId: string): Promise<Transaction[]> => {
    const cached = transactionsCache.get(accountId);
    if (cached) return cached;

    const response = await apiClient.get(`/account/${accountId}/statement`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load transactions");
    }

    const sorted = sortByDateDesc(data.result.transactions);
    transactionsCache.set(accountId, sorted);

    return sorted;
  },

  createTransaction: async (transaction: NewTransaction): Promise<Transaction> => {
    const response = await apiClient.post("/account/transaction", transaction);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create transaction");
    }

    const savedTx: Transaction = data.result;

    transactionsCache.update(savedTx.accountId, (transactions) => [savedTx, ...transactions]);

    return savedTx;
  },

  deleteTransaction: async (transactionId: string, accountId: string): Promise<void> => {
    const response = await apiClient.delete(`/account/${accountId}/transaction/${transactionId}/`);

    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }

    transactionsCache.update(accountId, (transactions) =>
      transactions.filter((t) => t.id !== transactionId)
    );
  },

  updateTransaction: async (transaction: Transaction): Promise<Transaction> => {
    const response = await apiClient.patch(
      `/account/${transaction.accountId}/transaction/${transaction.id}/`,
      transaction
    );

    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }

    transactionsCache.update(transaction.accountId, (transactions) =>
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );

    return transaction;
  },

  clearCache: (accountId?: string): void => {
    if (accountId) {
      transactionsCache.delete(accountId);
    } else {
      transactionsCache.clear();
    }
  },
};
