import React from "react";
import UploadImageErrorCSS from "./UploadImageError.module.css";

const UploadImageError = ({
  submitWithNoImage,
  setIsSubmitting,
  setUploadImageError,
  setSubmitError,
}) => {
  const handleSubmit = () => {
    submitWithNoImage();
  };

  const handleCancel = () => {
    setSubmitError("Submit failed");
    setIsSubmitting(false);
    setUploadImageError("");
  };

  return (
    <section className={UploadImageErrorCSS.UploadImageError_section}>
      <p className={UploadImageErrorCSS.UploadImageError_paragraph}>
        Unable to upload image
      </p>
      <p className={UploadImageErrorCSS.UploadImageError_paragraph}>
        Continue to upload without image?
      </p>
      <div className={UploadImageErrorCSS.Button_section}>
        <button
          onClick={handleSubmit}
          className={UploadImageErrorCSS.UploadImageError_button}
        >
          upload without image
        </button>
        <button
          onClick={handleCancel}
          className={UploadImageErrorCSS.UploadImageError_button}
        >
          no thanks
        </button>
      </div>
    </section>
  );
};

export default UploadImageError;
