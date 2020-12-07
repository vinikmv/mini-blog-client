import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputField } from "../components/InputField";
import { TextAreaBox } from "../components/TextAreaBox";
import { useRouter } from "next/router";
import { useCreatePostMutation } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();

  useIsAuth();

  const [createPost] = useCreatePostMutation();
  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async values => {
          const { errors } = await createPost({
            variables: { input: values },
            update: cache => {
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <TextAreaBox name="text" placeholder="text" label="Text" />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantcolor="teal"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
