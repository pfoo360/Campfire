import React from "react";

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
    <section>
      <p>
        Unable to upload image
        <br />
        Continue to upload without image?
      </p>
      <button onClick={handleSubmit}>upload without image</button>
      <button onClick={handleCancel}>no thanks</button>
    </section>
  );
};

export default UploadImageError;
