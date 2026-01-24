import { MonthlySummary } from '../types';
import React from 'react';

interface SummaryDisplayProps {
  summary: MonthlySummary[];
  isLoading: boolean;
  total: number;
}

export default function SummaryDisplay({ summary, isLoading, total }: SummaryDisplayProps) {
  if (isLoading) {
    return <div className="text-center py-4">Chargement du résumé...</div>;
  }

  if (summary.length === 0 && total === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Pas de résumé pour ce mois.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {summary.map((item, index) => (
        <div key={item.categorie.id || index} className="flex justify-between items-center">
          <span className="text-gray-700">{item.categorie.nom}</span>
          <span className="font-semibold">{item.total?.toFixed(2)} €</span>
        </div>
      ))}
      <hr className="my-2 border-gray-200" />
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Total</span>
        <span>{total.toFixed(2)} €</span>
      </div>
    </div>
  );
}
