import { AnimatePresence } from 'framer-motion';
import { usePaid } from '../hooks/usePaid';
import UpgradeModal from './UpgradeModal';

// Gates the entire app. If the user isn't a paid member, the dashboard
// behind it is blurred + non-interactive and the UpgradeModal is forced.
export default function PaywallGate({ children }) {
  const { isPaid, unlock } = usePaid();

  return (
    <>
      <div
        className={
          isPaid
            ? 'contents'
            : 'pointer-events-none max-h-screen select-none overflow-hidden blur-md saturate-50'
        }
        aria-hidden={!isPaid}
      >
        {children}
      </div>

      <AnimatePresence>{!isPaid && <UpgradeModal onUnlock={unlock} />}</AnimatePresence>
    </>
  );
}
