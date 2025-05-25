import React, { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Image,
  Stack,
} from "@chakra-ui/react";
import { body, image } from "framer-motion/client";
// import { title } from "framer-motion/client";

const IMGUR_CLIENT_ID = "a4b00867ea9e951";

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageToImgur = async (image) => {
    const formData = new FormData();
    FormData.append("image", image);

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
      body: formData,
      mode: 'cors'
    });

    const data = await response.json();
    if (data.success) {
      return data.data.link;
    } else {
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
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

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToImgur(imageFile);
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
      setImageFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Blog Title"
          ></Input>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Content</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter Blog Content"
          ></Textarea>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Cover Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>

        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview-Image"
            boxSize="200px"
            objectFit="cover"
          />
        )}

        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Create Post
        </Button>
      </Stack>
    </Box>
  );
};

export default BlogForm;
