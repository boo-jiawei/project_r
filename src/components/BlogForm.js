import { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  useToast,
  FormControl,
  FormLabel,
  Image,
  Stack,
} from "@chakra-ui/react";

const UPload_Preset = "free-upload";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgtrzafgv/image/upload";

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPload_Preset);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return data.public_id;
    } else {
      throw new Error(data.error.message || "Image upload failed");
    }
  };

  // const uploadImageToImgur = async (image) => {
  //   const formData = new FormData();
  //   FormData.append("image", image);

  //   const response = await fetch("https://api.imgur.com/3/image", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
  //     },
  //     body: formData,
  //     mode: 'cors'
  //   });

  //   const data = await response.json();
  //   if (data.success) {
  //     return data.data.link;
  //   } else {
  //     throw new Error("Image upload failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !author) {
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
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const timestamp = Date.now();

      const newPost = {
        title: title,
        content: content,
        date: new Date(timestamp).toLocaleDateString(),
        imageUrl,
        author: author,
      };

      addBlog(newPost);

      setTitle("");
      setContent("");
      setAuthor("");
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
{/* <a href="https://console.cloudinary.com/app/c-af2612e3fd7b730b1ae4c0700ebaf6/assets/media_library/homepage" target="_blank" color="">
  Open Cloudinary
</a> */}
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
          <FormLabel>Author</FormLabel>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author's name"
          ></Input>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Cover Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>

        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview-Image"
            boxSize="100pxs"
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
