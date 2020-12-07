import React from "react";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import { withApollo } from "../../utils/withApollo";

const Post = ({}) => {
  const { data, error, loading } = useGetPostFromUrl();
  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>Post not found.</Box>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Layout>
      <Heading mb={4}>{data?.post?.title}</Heading>
      {data?.post?.text}
      <Box mt={4}>
        <EditDeletePostButtons
          id={data.post.id}
          authorId={data.post.author.id}
        />
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
