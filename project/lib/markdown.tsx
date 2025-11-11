export function parseMarkdown(markdown: string): string {
  let html = markdown;

  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/^(?!<[hubloa])/gim, '<p>');
  html = html.replace(/(?<![hubloa]>)$/gim, '</p>');

  return html;
}
