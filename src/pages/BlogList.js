import { useEffect, useState } from "react";
import {
  Divider,
  SimpleGrid,
  Box,
  Heading,
  Text,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import BlogForm from "../components/BlogForm";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const storedBlogs = JSON.parse(localStorage.getItem("blog-posts")) || [];
    setBlogs(storedBlogs);
  }, []);

  const addBlog = (newBlog) => {
    const updatedBlog = [newBlog, ...blogs];
    setBlogs(updatedBlog);
    localStorage.setItem("blog-posts", JSON.stringify(updatedBlog));
  };

  const deleteBlog = (id) => {
    const updatedBlog = blogs.filter((blog) => blog.id !== id);
    setBlogs(updatedBlog);
    localStorage.setItem("blog-posts", JSON.stringify(updatedBlog));
  };

  return (
    <Box maxWidth="6xl" mx="auto" p={6}>
      <BlogForm addBlog={addBlog} />
      <Divider my={8} />
      {blogs.length === 0 ? (
        <Text textAlign="center" fontSize="x1" color="gray.500">
          No blogs found.
        </Text>
      ) : (
        <SimpleGrid columns={3} spacing={6}>
          {blogs.map((blog) => (
            <Box
              padding={4}
              key={blog.id}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              pos="relative"
              _hover={{
                boxShadow: "lg",
                transform: "translateY(-4px",
                transition: "0.2s",
              }}
              role="group"
            >
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                pos="absolute"
                top="2"
                right="2"
                onClick={() => deleteBlog(blog.id)}
                opacity="0"
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
              />
              <Stack spacing={3}>
                <Heading size={"md"} color="gray.800">
                  {blog.title}
                </Heading>
                <Text fontSize={"sm"} color="gray.400">
                  {blog.date}
                </Text>
                <Text fontSize="md" color="grey.700" noOfLines={4}>
                  {blog.content}
                </Text>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default BlogList;
