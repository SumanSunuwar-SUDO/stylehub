exports.fileUpload = (req, res, next) => {
  try {
    console.log(req.file);
    let link = req.file.path;
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
