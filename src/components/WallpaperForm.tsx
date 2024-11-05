import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Separate interfaces for form and database
interface FormValues {
  name: string;
  category: string;
  photographer: string;
  tags: string;
}

interface FirebaseWallpaper extends Omit<FormValues, "tags"> {
  url: string;
  tags: string[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  category: Yup.string().required("Required"),
  photographer: Yup.string().required("Required"),
  tags: Yup.string().required("Required"),
});

const WallpaperForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues, resetForm: () => void) => {
    const fileInput =
      document.querySelector<HTMLInputElement>('input[name="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    setLoading(true);
    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `wallpapers/${values.name}-${Date.now()}.jpg`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Prepare and save wallpaper data
      const wallpaperData: FirebaseWallpaper = {
        ...values,
        url,
        tags: values.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await addDoc(collection(getFirestore(), "wallpapers"), wallpaperData);
      alert(`Wallpaper uploaded: ${values.name}`);
      resetForm();
      fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Upload Wallpaper
        </h2>
        <Formik
          initialValues={{ name: "", category: "", photographer: "", tags: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        >
          <Form className="space-y-4">
            {["name", "category", "photographer"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block mb-2 font-medium text-gray-700 capitalize"
                >
                  {field}:
                </label>
                <Field
                  id={field}
                  name={field}
                  type="text"
                  placeholder={`Enter ${field}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage
                  name={field}
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="tags"
                className="block mb-2 font-medium text-gray-700"
              >
                Tags (comma separated):
              </label>
              <Field
                id="tags"
                name="tags"
                as="textarea"
                placeholder="nature, landscape, mountains"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <ErrorMessage
                name="tags"
                component="div"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="block mb-2 font-medium text-gray-700"
              >
                Image File:
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Uploading..." : "Upload Wallpaper"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default WallpaperForm;
