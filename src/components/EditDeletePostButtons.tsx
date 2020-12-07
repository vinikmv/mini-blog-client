import React from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonProps {
  id: number;
  authorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonProps> = ({
  id,
  authorId,
}) => {
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();

  if (meData?.me?.id !== authorId) {
    return null;
  }
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          mr={4}
          as={Link}
          aria-label="Edit Post"
          icon={<EditIcon />}
        />
      </NextLink>

      <IconButton
        onClick={() => {
          deletePost({
            variables: { id },
            update: cache => {
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
        aria-label="Delete Post"
        icon={<DeleteIcon />}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
