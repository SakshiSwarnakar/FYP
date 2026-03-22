import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";

function SubmitTaskForm() {
  const { taskId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      title: "",
      summary: "",
      proofFiles: [],
    },
  });

  const [previews, setPreviews] = useState([]);

  const proofFiles = watch("proofFiles");

  // Generate image previews when files are selected
  useState(() => {
    if (!proofFiles?.length) {
      setPreviews([]);
      return;
    }

    const objectUrls = Array.from(proofFiles).map((file) =>
      URL.createObjectURL(file),
    );

    setPreviews(objectUrls);

    // Cleanup
    return () => objectUrls.forEach(URL.revokeObjectURL);
  }, [proofFiles]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("summary", data.summary.trim());

      // Optional: append title if your backend supports it
      if (data.title?.trim()) {
        formData.append("title", data.title.trim());
      }

      if (data.proofFiles?.length) {
        for (const file of data.proofFiles) {
          formData.append("proof", file);
        }
      }

      const res = await api.post(
        `/task/tasks/${taskId}/submissions`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data?.status === "success") {
        toast.success("Task submitted successfully!");
        reset();
        setPreviews([]);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to submit task";

      toast.error(message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl border border-primary/15 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-primary/10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Submit Your Work
          </h2>
          <p className="mt-2 text-gray-600">
            Share what you accomplished and upload proof to receive your points.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-7">
          {/* Title (optional) */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <input
              id="title"
              {...register("title")}
              placeholder="Brief title of your submission"
              className={`
                w-full px-4 py-2.5 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                bg-white text-gray-800 placeholder-gray-400
                transition-all duration-200
              `}
            />
          </div>

          {/* Summary - required */}
          <div className="space-y-2">
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700"
            >
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              {...register("summary", {
                required: "Please provide a summary of your work",
                minLength: { value: 10, message: "Summary is too short" },
              })}
              rows={5}
              placeholder="Describe what you did, challenges faced, and results achieved..."
              className={`
                w-full px-4 py-3 rounded-xl border
                ${errors.summary ? "border-red-400 focus:ring-red-400/40" : "border-gray-300 focus:ring-primary/40 focus:border-primary/40"}
                bg-white text-gray-800 placeholder-gray-400 resize-y min-h-[120px]
                transition-all duration-200
              `}
            />
            {errors.summary && (
              <p className="text-sm text-red-600 mt-1">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Proof Files */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Proof / Evidence{" "}
              <span className="text-gray-400 text-xs">
                (images recommended)
              </span>
            </label>

            {/* Dropzone-like area */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                {...register("proofFiles")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`
                border-2 border-dashed rounded-xl p-8 text-center
                ${proofFiles?.length ? "border-primary/40 bg-primary/5" : "border-gray-300 hover:border-primary/30 bg-gray-50"}
                transition-all duration-300 cursor-pointer group
              `}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-primary/70 transition-colors" />
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-medium text-primary">
                    Click to upload
                  </span>{" "}
                  or drag & drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF (max 10MB per file recommended)
                </p>
              </div>
            </div>

            {/* File previews */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {previews.map((src, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm group"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const dt = new DataTransfer();
                        Array.from(proofFiles || [])
                          .filter((_, i) => i !== index)
                          .forEach((file) => dt.items.add(file));
                        // Reset field value
                        document.querySelector('input[type="file"]').value = "";
                        // Trigger react-hook-form update
                        register("proofFiles").onChange({
                          target: { files: dt.files },
                        });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full sm:w-auto px-8 py-3 rounded-xl font-medium text-white
                bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 focus:outline-none
                shadow-sm transition-all duration-200 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-primary
                flex items-center justify-center gap-2
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubmitTaskForm;
