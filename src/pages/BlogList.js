import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import db from "../firebase";
import {
  Divider,
  SimpleGrid,
  Box,
  Heading,
  Text,
  Stack,
  IconButton,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import BlogForm from "../components/BlogForm";
const cld = new Cloudinary({
  cloud: {
    cloudName: "dgtrzafgv",
  },
});

const BlogImage = ({ public_id }) => {
  if (!public_id) return null;

  const Img = cld
    .image(public_id)
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(500).height(300));

  return (
    <Box mb={4} borderRadius="md" overflow="hidden" maxH="300px">
      <AdvancedImage cldImg={Img} />
    </Box>
  );
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const blogCollection = collection(db, "blogs");

  const fetchBlogs = async () => {
    const snapshot = await getDocs(blogCollection);
    const blogData = snapshot.docs.map((doc) => ({
      id: doc.id, // firestore id
      ...doc.data(),
    }));
    setBlogs(
      blogData.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
    );
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const addBlog = async (newBlog) => {
    await addDoc(blogCollection, {
      ...newBlog,
      timestamp: serverTimestamp(),
    });
    fetchBlogs();
  };

  const deleteBlog = async (id) => {
    try {
      const blog = doc(db, "blogs", id);
      await deleteDoc(blog);
      fetchBlogs();
    } catch (error) {
      alert("Error deleting blog:", error);
    }
  };

  return (
    <Box maxWidth="6xl" mx="auto" p={6}>
      <Accordion>
        <AccordionItem
          borderRadius="md"
          fontSize="1x"
          borderColor="grey.200"
          overflow="hidden"
        >
          <h2>
            <AccordionButton
              px={4}
              py={3}
              _expanded={{ bg: "cyan.600", color: "white" }}
            >
              <Box flex="1" textAlign="left" fontWeight="bold">
                Create New Blog
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} px={4}>
            <BlogForm addBlog={addBlog} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Divider my={8} />
      {blogs.length === 0 ? (
        <Text textAlign="center" fontSize="x1" color="gray.500">
          No blogs found.
        </Text>
      ) : (
        <SimpleGrid columns={2} spacing={7}>
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
                <BlogImage public_id={blog.imageUrl} />
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
