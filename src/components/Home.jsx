import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { FiDownload, FiTrash } from "react-icons/fi";

const Home = ({ token, setToken }) => {
  const BACKEND_URI = process.env.BACKEND_URI
  const [files, setFiles] = useState([]);
  const [userRole, setUserRole] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchFiles(token);
    } else {
      navigate("/signin");
    }
  }, [token]);

  const fetchFiles = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URI}/api/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(response.data.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${BACKEND_URI}/api/delete/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const fetchName = async () => {
    try {
      const response = await axios.get(`${BACKEND_URI}/api/getme`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    fetchName();
  }, []);

  const handleDownloadFile = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <>
      <Navbar token={token} setToken={setToken} />
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-4">Files</h1>
        <div className="grid grid-cols-2 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-300 ease-in-out"
            >
              <img
                src={
                  file.type === "application/pdf"
                    ? "/pdf_logo.png"
                    : file.type === "application/octet-stream"
                    ? "/download.png"
                    : `${BACKEND_URI}${file.imageUrl}`
                }
                alt={file.name}
                className="object-cover w-full rounded-t-lg h-64 md:h-auto md:w-48 md:rounded-none md:rounded-tr-lg"
              />

              <div className="flex flex-col justify-between p-4 leading-normal w-full">
                <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-800 dark:text-white">
                  {file.name}
                </h5>
                {userRole === "admin" && (
                  <p className="mb-3 font-normal text-sm text-gray-600 dark:text-gray-400">
                    Uploaded by: {file.user.name}
                  </p>
                )}
                <div className="flex justify-between items-center mt-2">
                  <button
                    className="text-blue-500 hover:text-blue-600"
                    onClick={() =>
                      handleDownloadFile(
                        `${BACKEND_URI}${file.imageUrl}`
                      )
                    }
                  >
                    <FiDownload className="w-6 h-6" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <FiTrash className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
