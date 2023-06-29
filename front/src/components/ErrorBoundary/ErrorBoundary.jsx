import { Header } from '../Header';
import styles from './ErrorBoundary.module.scss';
export const ErrorBoundary = ({ text }) => {
  return (
    <>
      <Header />
      <p className={styles.error}></p>
    </>
  );
};
