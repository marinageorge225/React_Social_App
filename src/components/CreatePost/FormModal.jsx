import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link,
  Textarea,
  toast,
  Toast,
  alert,
} from "@heroui/react";
import { useRef, useState } from "react";
import { IoIosPhotos } from "react-icons/io";
import { MdAddPhotoAlternate } from "react-icons/md";
import { createPost } from "../../services/postServices";

export default function FormModal({ isOpen, onOpenChange, fetchAllPosts }) {
  const [displayedPhoto, setDisplayedPhoto] = useState("");
  const [sendPhoto, setSendPhoto] = useState("");
  const [postContent, setPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputPhoto = useRef(null);
  function handleUploadImage() {
    inputPhoto.current.click();
  }
  function handleSelectedImage() {
    // console.log(inputPhoto.current.files[0]);
    //format for photo to sent to the endpoint
    setSendPhoto(inputPhoto.current.files[0]);

    //format to display photo
    setDisplayedPhoto(URL.createObjectURL(inputPhoto.current.files[0]));
  }
  async function handleFetchingPost() {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("body", postContent);
      formData.append("image", sendPhoto);
      const response = await createPost(formData);
      console.log(response);
      alert("Post created successfully!");
      onOpenChange();
      fetchAllPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={() => {
          setDisplayedPhoto("");
          setSendPhoto("");
          onOpenChange();
        }}
        className="bg-pink-100"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-pink-700">
                Create Post
              </ModalHeader>
              <ModalBody>
                <Textarea
                  minRows={50}
                  className="max-w-md"
                  label="Post"
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                {displayedPhoto && (
                  <img
                    src={displayedPhoto}
                    alt="Preview"
                    className="mt-4 max-w-full h-auto"
                  />
                )}
                <div className="flex items-center gap-2 mt-4 cursor-pointer">
                  <p className="text-pink-500">Upload Photo</p>
                  <MdAddPhotoAlternate
                    className="text-2xl text-pink-400 "
                    onClick={() => {
                      handleUploadImage();
                    }}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    ref={inputPhoto}
                    onChange={handleSelectedImage}
                    className="hidden"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={isLoading}
                  onClick={() => {
                    handleFetchingPost();
                  }}
                  color="danger"
                  variant="flat"
                  className="w-full"
                >
                  Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
