import { MDXRemote } from 'next-mdx-remote/rsc'
import { Embed } from './embed'

const components = {
  Embed,
}

export function MDXContent({ content }: { content: string }) {
  return (
    <MDXRemote source={content} components={components} />
  )
}
