import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withApollo } from "../utils/withApollo";
import NextLink from "next/link";
import React from "react";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { ReactionSection } from "../components/ReactionSection";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <Box>
        <Box>Something wrong happened.</Box>
        <Box>{error?.message}</Box>
      </Box>
    );
  }

  return (
    <Layout>
      <br />
      {!data && loading ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map(p =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <ReactionSection post={p} />

                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by: {p.author.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <Box ml="auto">
                      <EditDeletePostButtons id={p.id} authorId={p.author.id} />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      <Flex>
        {data && data.posts.hasMore ? (
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            Load More
          </Button>
        ) : null}
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
