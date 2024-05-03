import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Upload = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [fileSelected, setFileSelected] = useState(false);
  const [fileData, setFileData] = useState();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please Login.", { autoClose: 2000 });
        return;
      }

      const formData = new FormData();
      if (data.uploadFile) {
        formData.append("file", fileData);
      } else {
        toast.error("Please select a file.");
        return;
      }

      const response = await axios.post(
        `${process.env.BACKEND_URI}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("File uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error("An error occurred:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error uploading file. Please try again.";
      toast.error(errorMessage);
    } finally {
      setFileSelected(false);
      setFileData();
    }
  };

  useEffect(() => {
    if (errors.uploadFile) {
      toast.error(errors.uploadFile.message);
    }
  }, [errors]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setFileData(file);
    if (file) {
      setFileSelected(true);
    } else {
      setFileSelected(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />

      <div className="flex flex-col items-center justify-center w-full mt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
          encType="multipart/form-data"
        >
          {errors._error && (
            <div className="text-red-500">{errors._error.message}</div>
          )}
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8l2 2 2-2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              name="uploadFile"
              type="file"
              className="hidden"
              {...register("uploadFile", { required: "File is required" })}
              onChange={handleFileSelect}
            />
          </label>
          {fileSelected && (
            <div className="text-black font-bold">
              File selected successfully! {fileData.name}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md shadow-md"
          >
            Upload
          </button>
        </form>
      </div>
    </>
  );
};

export default Upload;
