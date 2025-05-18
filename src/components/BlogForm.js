import React, { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
// import { title } from "framer-motion/client";

const BlogForm = ({addBlog}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast({
        title: "All fields are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const timestamp = Date.now();

    const newPost = {
      title: title,
      content: content,
      date: new Date(timestamp).toLocaleDateString(),
    };

    addBlog(newPost);

    setTitle("");
    setContent("");
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack>
        <Input
          placeholder="Blog title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <Textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          rows={6}
        />
        <Button type="submit" colorScheme="teal">
          Create Post
        </Button>
      </VStack>
    </Box>
  );
};

export default BlogForm;
