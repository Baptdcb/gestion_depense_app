import { FaWallet } from "react-icons/fa";
import type { MonthlyHistoryItem } from "../../services/reportApi";

export default function TotaleBalance({
  history,
}: {
  history: MonthlyHistoryItem[] | undefined;
}) {
const lastBalance =
    history && history.length > 0
        ? (history
                .filter((item) => {
                    const itemDate = new Date(item.month);
                    const today = new Date();
                    return (
                        itemDate.getFullYear() < today.getFullYear() ||
                        (itemDate.getFullYear() === today.getFullYear() &&
                            itemDate.getMonth() <= today.getMonth())
                    );
                })
                .at(-1)?.runningBalance ?? 0)
        : 0;

  return (
    <div className="flex items-center space-x-3 mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
      <div className="p-3 rounded-full bg-linear-accent/20 text-linear-accent">
        <FaWallet size={20} />
      </div>
      <div>
        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
          Balance Totale
        </p>
        <span
          className={`text-xl font-mono font-bold ${lastBalance >= 0 ? "text-white" : "text-red-400"}`}
        >
          {lastBalance.toFixed(2)} €
        </span>
      </div>
    </div>
  );
}
