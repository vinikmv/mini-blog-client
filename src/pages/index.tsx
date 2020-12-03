import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  if (!fetching && !data) {
    return <div>Something wrong happened.</div>;
  }

  return (
    <Layout>
      <Flex>
        <Heading>MiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>

      <br />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map(p => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>{" "}
              <Text>Posted by: {p.author.username}</Text>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      <Flex>
        {data && data.posts.hasMore ? (
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
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

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
