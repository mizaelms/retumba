import { MDXRemote } from 'next-mdx-remote/rsc'
import { Embed } from './embed'

const components = {
  Embed,
}

export function MDXContent({ content }: { content: string }) {
  // Sanitize content to remove AI citation markers which look like :contentReference[oaicite:0]{index=0}
  // These cause "index is not defined" because MDX treats {index=0} as a variable expression.
  const sanitizedContent = content.replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, '');

  return (
    <MDXRemote source={sanitizedContent} components={components} />
  )
}
