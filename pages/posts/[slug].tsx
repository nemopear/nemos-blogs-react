import { BasicLayout } from "@components/ui/Layout";
import Giscus from "@giscus/react";
import moment from "moment";
import { NextSeo } from "next-seo";
import CONFIG from "src/data/config";
import { graphCms } from "src/lib/graphCms";

const singlePost: React.FC = ({ post }) => {
  // console.log("post:", post);

  // const { title, createdAt, content } = post;
  return (
    <>
      <NextSeo
        title={CONFIG.defaultTitle}
        description={CONFIG.defaultDescription}
        openGraph={{
          url: `${CONFIG.url}posts/${post.slug}`,
          title: `${post.title}`,
          description: `${post.excerpt}`,
          images: [
            {
              url: `${post.thumbnail && post.thumbnail.url}`,
              width: 800,
              height: 600,
              alt: `${post.title}`,
              type: "image/jpeg",
            },
          ],
          site_name: `${CONFIG.defaultTitle}`,
        }}
        additionalMetaTags={[
          {
            name: "image",
            content: `${post.thumbnail && post.thumbnail.url}`,
          },
          {
            property: "og:title",
            content: `${post.title}`,
          },
          {
            property: "og:description",
            content: `${post.excerpt}`,
          },
          {
            property: "og:url",
            content: `${CONFIG.url}posts/${post.slug}`,
          },
          {
            property: "og:image",
            content: `${post.thumbnail && post.thumbnail.url}`,
          },
          {
            name: "twitter:url",
            content: `${CONFIG.url}posts/${post.slug}`,
          },
          {
            name: "twitter:title",
            content: `${post.title}`,
          },
          {
            name: "twitter:description",
            content: `${post.excerpt}`,
          },
          {
            name: "twitter:image:src",
            content: `${post.thumbnail && post.thumbnail.url}`,
          },
          {
            name: "twitter:image",
            content: `${post.thumbnail && post.thumbnail.url}`,
          },
        ]}
      />

      <BasicLayout>
        <div className="mt-10 lg:mt-20 lg:max-w-xl xl:max-w-2xl">
          <h1 className="mb-4 text-4xl font-medium">{post.title}</h1>
          <div className="create-at my-4 text-sm text-gray-500">
            {moment(post.createdAt).format("MMM Do, YYYY")}
          </div>
          <div
            className="content prose my-8 lg:prose-base lg:my-16"
            dangerouslySetInnerHTML={{ __html: post.content.html }}
          >
            {/* {post.content.html} */}
          </div>
          <Giscus
            id="comments"
            repo="nemopear/nemos-blog-react"
            repoId="R_kgDOHd-iKw"
            category="General"
            categoryId="DIC_kwDOHd-iK84CPk7v"
            mapping="title"
            term="Welcome to Nemo's Blog !"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="en"
          />
        </div>
      </BasicLayout>
    </>
  );
};

export default singlePost;

export async function getStaticPaths() {
  const { posts } = await graphCms.request(`
        {
            posts {
                slug
            }
        }
    `);
  const paths = posts.map(({ slug }) => ({
    params: {
      slug,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { post } = await graphCms.request(
    `
        query SinglePost($slug: String!) {
            post(where: {slug: $slug}) {
                slug
                title
                thumbnail {
                  url
                }
                createdAt
                content {
                    html
                }
                excerpt
            }
        }      
    `,
    { slug: params.slug }
  );

  return {
    props: {
      post,
      revalidate: 10,
    },
  };
}
