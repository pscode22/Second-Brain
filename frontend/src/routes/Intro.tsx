import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import Brain from '../icons/BrainIcon';
import { Link } from 'react-router-dom';

export default function IntroPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex max-w-lg flex-col items-center gap-4"
      >
        <div className="flex items-center gap-2">
          <Brain style={{ width: '2.5rem', height: '2.5rem' }} />
          <h1 className="text-3xl font-semibold tracking-tight">Second Brain</h1>
        </div>

        <p className="text-muted-foreground text-base leading-relaxed">
          Organize your knowledge, ideas, and inspirations in one smart place. Second Brain helps
          you capture, categorize, and retrieve your digital thoughts effortlessly.
        </p>

        <div className="mt-6 flex gap-4">
          <Link to="/signIn">
            <Button
              variant="primary"
              text="Sign In"
              className="rounded-2xl px-6 py-2 shadow-md transition-all duration-200 hover:shadow-lg"
            />
          </Link>
          <Link to="/signUp">
            <Button
              variant="secondary"
              text="Get Started"
              className="rounded-2xl border px-6 py-2 transition-all duration-200 hover:border-purple-600"
            />
          </Link>
        </div>
      </motion.div>

      <footer className="text-muted-foreground mt-12 text-sm">
        © {new Date().getFullYear()} Second Brain. All rights reserved.
      </footer>
    </div>
  );
}
