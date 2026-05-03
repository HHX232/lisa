import ReactMarkdown from 'react-markdown';
import styles from './PrivacyPage.module.scss';

// npm install react-markdown

interface PrivacyPageProps {
  markdown: string;
}

export default function MDContentPage({ markdown }: PrivacyPageProps) {
  return (
    <article className={`container ${styles.privacy}`}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </article>
  );
}