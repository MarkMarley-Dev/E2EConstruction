// app/page.tsx
import Link from 'next/link';
import styles from './styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Planning & Construction Platform
        </h1>
        <div className={styles.buttonContainer}>
          <Link href="/auth/login" className={styles.primaryButton}>
            Log In
          </Link>
          <Link href="/auth/register" className={styles.secondaryButton}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}