import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './PrivacyPage.module.scss';

interface PrivacyPageProps {
  markdown: string;
}

export default function MDContentPage({ markdown }: PrivacyPageProps) {
  return (
    <article className={`container ${styles.privacy}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}