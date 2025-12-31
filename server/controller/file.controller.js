exports.fileUpload = (req, res, next) => {
  try {
    console.log(req.file.filename);
    let link = `http://localhost:9000/images/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      imageUrl: link,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
